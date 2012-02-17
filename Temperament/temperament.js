
/*
Copyright (c) 2010-2011 Eric R. Johnson, http://www.lostbearlabs.com

All code on LostBearLabs.com is made available under the terms of the
Artistic License 2.0, for details please see:
   http://www.opensource.org/licenses/artistic-license-2.0.php
*/

(function() {
  var HEIGHT, NHARM, WIDTH, bar, draw, height, onChangeTuning, onClickPaper, xpos, _colors, _cur, _harm, _paper, _selected, _tunings;

  WIDTH = 400;

  HEIGHT = 400;

  _paper = null;

  _colors = ["red", "orange", "yellow", "green", "blue"];

  _selected = [];

  _harm = [1, 3, 5, 7, 9];

  NHARM = 5;

  _tunings = [
    {
      name: "equal temperament",
      names: ["C", "D", "E", "F", "G", "A", "B", "C"],
      notes: [523, 587, 659, 699, 784, 880, 988, 1047]
    }, {
      name: "just intonation",
      names: ["C", "D", "E", "F", "G", "A", "B", "C"],
      notes: [523 * 1 / 1, 523 * 9 / 8, 523 * 5 / 4, 523 * 4 / 3, 523 * 3 / 2, 523 * 5 / 3, 523 * 15 / 8, 523 * 2 / 1]
    }
  ];

  _cur = _tunings[0];

  height = function(pitch) {
    var dy, logMax, logMin, logPitch, maxPitch, minPitch, num, pct, y;
    minPitch = _cur.notes[0];
    maxPitch = _cur.notes[_cur.notes.length - 1];
    while (pitch < minPitch) {
      pitch = pitch * 2;
    }
    while (pitch > maxPitch) {
      pitch = pitch / 2;
    }
    logMax = Math.log(maxPitch);
    logMin = Math.log(minPitch);
    logPitch = Math.log(pitch);
    pct = (logPitch - logMin) / (logMax - logMin);
    num = _cur.names.length;
    dy = HEIGHT / 10;
    y = dy + pct * num * dy;
    return HEIGHT - y;
  };

  xpos = function(note) {
    var dx;
    dx = WIDTH / (_cur.names.length + 2);
    return (note + 1) * dx;
  };

  bar = function(note, harm, pos) {
    var dx, line, x0, x1, y;
    dx = WIDTH / (_cur.names.length + 2);
    y = height(_cur.notes[note] * _harm[harm]);
    x0 = xpos(pos);
    x1 = x0 + 0.5 * (xpos(pos + 1) - x0);
    line = _paper.path("M " + x0 + "," + y + " L " + x1 + "," + y);
    line.attr("stroke", _colors[harm]);
    return line.attr("stroke-width", 3);
  };

  draw = function() {
    var dx, i, j, line, r, x, x0, x1, y, y0, y1, _ref, _ref2, _ref3, _ref4, _ref5, _ref6, _results;
    if (_paper) _paper.clear();
    for (i = 0, _ref = _cur.names.length; 0 <= _ref ? i < _ref : i > _ref; 0 <= _ref ? i++ : i--) {
      dx = xpos(1) - xpos(0);
      x0 = xpos(0) - dx / 2;
      x1 = xpos(_cur.names.length) - dx / 2;
      y0 = y1 = height(_cur.notes[i]);
      line = _paper.path("M " + x0 + "," + y0 + " L " + x1 + "," + y1);
      line.attr("stroke", "#888");
    }
    for (i = 0, _ref2 = _cur.names.length; 0 <= _ref2 ? i < _ref2 : i > _ref2; 0 <= _ref2 ? i++ : i--) {
      x = dx / 4;
      y = height(_cur.notes[i]);
      _paper.text(x, y, _cur.names[i]);
    }
    for (i = 0, _ref3 = _cur.names.length - 1; 0 <= _ref3 ? i < _ref3 : i > _ref3; 0 <= _ref3 ? i++ : i--) {
      _paper.text(xpos(i) + 10, HEIGHT - 10, _cur.names[i]);
    }
    for (i = 0, _ref4 = _cur.names.length - 1; 0 <= _ref4 ? i < _ref4 : i > _ref4; 0 <= _ref4 ? i++ : i--) {
      for (j = 0; 0 <= NHARM ? j < NHARM : j > NHARM; 0 <= NHARM ? j++ : j--) {
        bar(i, j, i);
      }
    }
    for (i = 0, _ref5 = _cur.names.length - 1; 0 <= _ref5 ? i < _ref5 : i > _ref5; 0 <= _ref5 ? i++ : i--) {
      if (_selected[i]) {
        for (j = 0; 0 <= NHARM ? j < NHARM : j > NHARM; 0 <= NHARM ? j++ : j--) {
          bar(i, j, _cur.names.length);
        }
      }
    }
    _results = [];
    for (i = 0, _ref6 = _cur.names.length - 1; 0 <= _ref6 ? i < _ref6 : i > _ref6; 0 <= _ref6 ? i++ : i--) {
      x0 = xpos(i);
      dx = 0.8 * (xpos(i + 1) - x0);
      y0 = 0;
      r = _paper.rect(x0, y0, dx, HEIGHT);
      r.attr("fill", "darkgrey");
      r.attr("opacity", (_selected[i] ? "0.2" : "0"));
      r.data("idx", i);
      _results.push(r.click(function() {
        var idx;
        idx = this.data("idx");
        _selected[idx] = !_selected[idx];
        return draw();
      }));
    }
    return _results;
  };

  onChangeTuning = function() {
    var selected, t, val, _i, _len;
    selected = $("#selectTuning option:selected");
    val = selected.val();
    for (_i = 0, _len = _tunings.length; _i < _len; _i++) {
      t = _tunings[_i];
      if (t.name === val) _cur = t;
    }
    return draw();
  };

  onClickPaper = function() {};

  $(document).ready(function() {
    var i, t, _ref;
    for (i = 0, _ref = _tunings.length; 0 <= _ref ? i < _ref : i > _ref; 0 <= _ref ? i++ : i--) {
      t = _tunings[i];
      $('#selectTuning').append('<option value="' + t.name + '">' + t.name + '</option>');
      $('#selectTuning').change(onChangeTuning);
    }
    _paper = Raphael("TheCanvas", WIDTH, HEIGHT);
    return draw();
  });

}).call(this);
