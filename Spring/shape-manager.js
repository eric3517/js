(function() {
  var ShapeManager, root;

  ShapeManager = (function() {

    function ShapeManager(panel, size) {
      this.panel = panel;
      this.size = size;
      this.tracked = null;
      this.offsetX = 0.0;
      this.offsetY = 0.0;
      this.shapes = [];
    }

    ShapeManager.prototype.isTracked = function(shape) {
      return shape === this.tracked;
    };

    ShapeManager.prototype.add = function(x, y, atEnd) {
      var color, shape;
      shape = this.panel.circle(x, y, 10);
      color = atEnd ? "#f00" : "#0f0";
      shape.attr("fill", color);
      shape.attr("stroke-width", "0");
      return this.shapes.push(shape);
    };

    return ShapeManager;

  })();

  root = typeof exports !== "undefined" && exports !== null ? exports : window;

  root.ShapeManager = ShapeManager;

}).call(this);
