###
Copyright (c) 2010-2011 Eric R. Johnson, http://www.lostbearlabs.com

All code on LostBearLabs.com is made available under the terms of the
Artistic License 2.0, for details please see:
   http://www.opensource.org/licenses/artistic-license-2.0.php
###

# (note: recompile in-place with 'coffee -cwo . .')

WIDTH = 400
HEIGHT = 400
_paper = null

_colors = ["red", "orange", "yellow", "green", "blue"]
_selected = []
_harm = [1, 3, 5, 7, 9]
NHARM = 5


_tunings = [
  {
    name: "equal temperament"
    names: [ "C", "D", "E", "F", "G", "A", "B", "C" ]
    notes: [523,587,659,699,784,880,988, 1047] # http://peabody.sapp.org/class/st2/lab/notehz/
    midi: [0x3C, 0x3E, 0x40, 0x41, 0x43, 0x45, 0x47, 0x48]
  },
  {
    name: "just intonation"
    names: [ "C", "D", "E", "F", "G", "A", "B", "C" ]
    notes: [ 523*1/1, 523*9/8, 523*5/4, 523*4/3, 523*3/2, 523*5/3, 523*15/8, 523*2/1 ] # http://www.kylegann.com/tuning.html
    midi: [0x3C, 0x3E, 0x40, 0x41, 0x43, 0x45, 0x47, 0x48]
  }
]
_cur = _tunings[0]

height = (pitch) ->
  minPitch = _cur.notes[0]
  maxPitch = _cur.notes[ _cur.notes.length - 1]
  while( pitch<minPitch )
    pitch = pitch * 2
  while( pitch>maxPitch)
    pitch = pitch / 2

  logMax = Math.log(maxPitch)
  logMin = Math.log(minPitch)
  logPitch = Math.log(pitch)

  pct = (logPitch-logMin) / (logMax-logMin)
  num = _cur.names.length
  dy = HEIGHT/10
  y = dy + pct*num*dy
  HEIGHT - y

xpos = (note) ->
  dx = WIDTH / (_cur.names.length+2)
  (note+1) * dx

bar = (note, harm, pos) ->
  dx = WIDTH / (_cur.names.length+2)
  y = height( _cur.notes[note]*_harm[harm] )
  x0 = xpos(pos)
  x1 = x0 + 0.5*(xpos(pos+1)-x0)
  line = _paper.path "M #{x0},#{y} L #{x1},#{y}"
  line.attr "stroke", _colors[harm]
  line.attr "stroke-width", 3

draw = ->
  _paper.clear() if _paper

  # note lines
  for i in [0 ... _cur.names.length]
    dx = xpos(1) - xpos(0)
    x0 = xpos(0) - dx/2
    x1 = xpos(_cur.names.length) - dx/2
    y0 = y1 = height( _cur.notes[i] )
    line = _paper.path "M #{x0},#{y0} L #{x1},#{y1}"
    line.attr "stroke", "#888"

  # vertical labels
  for i in [0 ... _cur.names.length]
    x = dx/4
    y = height( _cur.notes[i] )
    _paper.text x, y, _cur.names[i]

  # horizontal labels
  for i in [0 ... _cur.names.length-1]
    _paper.text xpos(i)+10, HEIGHT-10, _cur.names[i]

  # harmonics
  for i in [0 ... _cur.names.length-1]
    for j in [0 ... NHARM]
      bar( i, j, i )

  # chord
  for i in [0 ... _cur.names.length-1]
    if _selected[i]
      for j in [0 ... NHARM]
        bar( i, j,  _cur.names.length )

  # hilite boxes
  for i in [0 ... _cur.names.length - 1]
    x0 = xpos(i)
    dx = 0.8 * (xpos(i+1) - x0)
    y0 = 0
    r = _paper.rect(x0, y0, dx, HEIGHT)
    r.attr "fill", "darkgrey"
    r.attr "opacity", (if _selected[i] then "0.2" else "0" )
    r.data "idx", i
    r.click( ->
      idx = this.data("idx")
      _selected[ idx ] = !_selected[idx]
      draw()
    )


onChangeTuning = ->
  selected = $("#selectTuning option:selected");
  val = selected.val();
  for t in _tunings
    if t.name == val
      _cur = t
  draw()

onClickPlay = ->

  duration = 128
  noteEvents = []

  # pause to intialize
  noteEvents.push(MidiEvent.noteOff(_cur.midi[0], duration))

  # play scale
  for x in _cur.midi
    noteEvents.push MidiEvent.noteOn(x)
    noteEvents.push(MidiEvent.noteOff(x, duration))

  # play selected notes (twice)
  for repeat in [0...2]
    for i in [0 ... _cur.names.length]
      if _selected[i]
        x = _cur.midi[i]
        noteEvents.push MidiEvent.noteOn(x)
        noteEvents.push(MidiEvent.noteOff(x, duration))

  # play chord
  for i in [0 ... _cur.names.length]
    if _selected[i]
      x = _cur.midi[i]
      noteEvents.push MidiEvent.noteOn(x)

  for i in [0 ... _cur.names.length]
    if _selected[i]
      x = _cur.midi[i]
      noteEvents.push(MidiEvent.noteOff(x, 4*duration))


#  for note in ["C4", "E4", "G4"]
#    evts = MidiEvent.createNote(note)
#    for evt in evts
#      noteEvents.push evt

  track = new MidiTrack({ events: noteEvents })
  song  = MidiWriter({ tracks: [track] })
  $('#sound_').remove()
  embed = document.createElement("embed");
  embed.setAttribute("src", "data:audio/midi;base64," + song.b64);
  embed.setAttribute("type", "audio/midi");
  embed.setAttribute("id", "sound_")
  document.body.appendChild(embed);



$(document).ready ->
  for i in [0 ... _tunings.length]
    t = _tunings[i]
    $('#selectTuning').append('<option value="' + t.name + '">' + t.name + '</option>');
    $('#selectTuning').change(onChangeTuning)

  $('#play').click( onClickPlay )

  _paper = Raphael("TheCanvas", WIDTH, HEIGHT);
  draw()


