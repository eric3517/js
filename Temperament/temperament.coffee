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

_tunings = [
  {
    name: "standard"
    names: [ "C", "D", "E", "F", "G", "A", "B", "C" ]
    notes: [523,587,659,699,784,880,988,1047] # http://peabody.sapp.org/class/st2/lab/notehz/
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
  console.log "#pitch={pitch}, min/max=#{minPitch},#{maxPitch}, logMin/logMax=#{logMin},#{logMax}, y=#{y}"
  HEIGHT - y


initData = ->
  _paper = Raphael("TheCanvas", WIDTH, WIDTH)

  for i in [0 ... _tunings.length]
    t = _tunings[i]
    $('#selectTuning').append('<option value="' + t.name + '">' + t.name + '</option>');

  dx = WIDTH / _cur.names.length
  for i in [0 ... _cur.names.length]
    x0 = dx/2
    x1 = WIDTH - dx/2
    y0 = y1 = height( _cur.notes[i] )
    line = _paper.path "M #{x0},#{y0} L #{x1},#{y1}"
    line.attr "stroke", "#888"

  for i in [0 ... _cur.names.length]
    x = dx/4
    y = height( _cur.notes[i] )
    _paper.text x, y, _cur.names[i]



$(document).ready ->
  initData()


