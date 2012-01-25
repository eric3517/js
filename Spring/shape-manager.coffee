
class ShapeManager
  constructor: (@panel, @size) ->
    @tracked = null
    @offsetX = 0.0
    @offsetY = 0.0
    @shapes = []

  isTracked: (shape) -> shape == @tracked

  add: (x, y, atEnd) ->

    shape  = @panel.circle(x, y, 10)
    color = if atEnd then "#f00" else "#0f0"
    shape.attr("fill", color)
    shape.attr("stroke-width", "0")

    @shapes.push shape

#    shape.click (e) ->
#      console.log "x=#{e.pageX}, y=#{e.pageY}"



root = exports ? window
root.ShapeManager = ShapeManager
