(function() {
  var ShapeManager, root;

  ShapeManager = (function() {

    function ShapeManager(panel, size) {
      this.panel = panel;
      this.size = size;
      this.shapes = [];
      this.rDot = 10;
    }

    ShapeManager.prototype.isTracked = function(shape) {
      return shape.tracked;
    };

    ShapeManager.prototype.add = function(x, y, atEnd) {
      var color, maxPos, minPos, onEnd, onMove, onStart, shape;
      shape = this.panel.circle(x, y, this.rDot);
      color = atEnd ? "#f00" : "#0f0";
      shape.attr("fill", color);
      shape.attr("stroke-width", "0");
      shape.attr({
        cx: x,
        cy: y
      });
      console.log("new shape: " + x + "," + y);
      minPos = this.rDot;
      maxPos = this.size - this.rDot;
      this.shapes.push(shape);
      onMove = function(dx, dy, x, y, obj) {
        var cx, cy;
        cx = this.x0 + dx;
        cy = this.y0 + dy;
        cx = Math.max(cx, minPos);
        cy = Math.max(cy, minPos);
        cx = Math.min(cx, maxPos);
        cy = Math.min(cy, maxPos);
        return shape.attr({
          cx: cx,
          cy: cy
        });
      };
      onStart = function(x, y, obj) {
        this.x0 = shape.attr("cx");
        this.y0 = shape.attr("cy");
        return shape.tracked = true;
      };
      onEnd = function(e, obj) {
        return shape.tracked = false;
      };
      return shape.drag(onMove, onStart, onEnd);
    };

    return ShapeManager;

  })();

  root = typeof exports !== "undefined" && exports !== null ? exports : window;

  root.ShapeManager = ShapeManager;

}).call(this);
