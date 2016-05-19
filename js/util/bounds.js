var Bounds = {
  circleBounds: function (object) {
    var left, right, top, bottom;

    left = object.pos.x - object.radius;
    right = object.pos.x + object.radius;
    top = object.pos.y - object.radius;
    bottom = object.pos.y + object.radius;

    return {left: left, right: right, top: top, bottom: bottom };
  },

  rectBounds: function (object) {
    var left, right, top, bottom;

    var firstX = object.pos.x;
    var firstY = object.pos.y;

    var secondX = object.pos.x + object.width * Math.cos(object.angle);
    var secondY = object.pos.y + object.width * Math.sin(object.angle);

    var thirdX = secondX + object.height * Math.cos(object.angle + Math.PI / 2);
    var thirdY = secondY + object.height * Math.sin(object.angle + Math.PI / 2);

    var fourthX = thirdX + object.width * Math.cos(object.angle + Math.PI);
    var fourthY = thirdY + object.width * Math.sin(object.angle + Math.PI);

    var xPositions = [firstX, secondX, thirdX, fourthX];
    var yPositions = [firstY, secondY, thirdY, fourthY];
    left = Math.min(...xPositions);
    right = Math.max(...xPositions);
    top = Math.min(...yPositions);
    bottom = Math.max(...yPositions);

    return {left: left, right: right, top: top, bottom: bottom };
  },

  containRect: function (object, pos) {
    var bounds = this.rectBounds(object);
    if (pos.x >= bounds.left && pos.x <= bounds.right && pos.y >= bounds.top && pos.y <= bounds.bottom) {
      return true
    } else {
      return false;
    }
  },
};

module.exports = Bounds;
