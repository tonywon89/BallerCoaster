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
    var first = this.computeFirstCorner(object);

    var secondX = first.x + object.width * Math.cos(object.angle);
    var secondY = first.y + object.width * Math.sin(object.angle);

    var thirdX = secondX + object.height * Math.cos(object.angle + Math.PI / 2);
    var thirdY = secondY + object.height * Math.sin(object.angle + Math.PI / 2);

    var fourthX = thirdX + object.width * Math.cos(object.angle + Math.PI);
    var fourthY = thirdY + object.width * Math.sin(object.angle + Math.PI);

    var xPositions = [first.x, secondX, thirdX, fourthX];
    var yPositions = [first.y, secondY, thirdY, fourthY];
    left = Math.min(...xPositions);
    right = Math.max(...xPositions);
    top = Math.min(...yPositions);
    bottom = Math.max(...yPositions);

    return {left: left, right: right, top: top, bottom: bottom };
  },

  rectCorners: function (object) {
    var first = this.computeFirstCorner(object);

    var secondX = first.x + object.width * Math.cos(object.angle);
    var secondY = first.y + object.width * Math.sin(object.angle);

    var thirdX = secondX + object.height * Math.cos(object.angle + Math.PI / 2);
    var thirdY = secondY + object.height * Math.sin(object.angle + Math.PI / 2);

    var fourthX = thirdX + object.width * Math.cos(object.angle + Math.PI);
    var fourthY = thirdY + object.width * Math.sin(object.angle + Math.PI);

    return {first: {x: first.x, y: first.y}, second: {x: secondX, y: secondY}, third: {x: thirdX, y: thirdY}, fourth: {x: fourthX, y: fourthY}};
  },

  containRect: function (object, pos) {
    var bounds = this.rectBounds(object);
    var corners = this.rectCorners(object);
    if (Math.floor(reactangleArea(corners)) === Math.floor(
      triangleArea(pos, corners.first, corners.second) + triangleArea(pos, corners.second, corners.third) +
      triangleArea(pos, corners.third, corners.fourth) + triangleArea(pos, corners.fourth, corners.first)
    )) {
      return true;
    } else {
      return false;
    }
    // if (pos.x >= bounds.left && pos.x <= bounds.right && pos.y >= bounds.top && pos.y <= bounds.bottom) {
    //   return true
    // } else {
    //   return false;
    // }
  },

  computeFirstCorner: function (object) {
    var center = {x: object.pos.x, y: object.pos.y};
    var y = center.y - object.width/2 * Math.sin(object.angle) + object.height/2 * Math.sin(object.angle - Math.PI / 2);
    var x = center.x - object.width/2 * Math.cos(object.angle) + object.height/2 * Math.cos(object.angle - Math.PI / 2 );
    return {x: x, y: y};
  }
};

var reactangleArea = function (corners) {
  var width = Math.sqrt(Math.pow(corners.first.y - corners.second.y, 2) + Math.pow(corners.first.x - corners.second.x, 2));
  var height = Math.sqrt(Math.pow(corners.second.y - corners.third.y, 2) + Math.pow(corners.second.x - corners.third.x, 2));
  return width * height;
};

var triangleArea = function(pos1, pos2, pos3) {
  var side1 = Math.sqrt(Math.pow(pos2.y - pos1.y, 2) + Math.pow(pos2.x - pos1.x, 2));
  var side2 = Math.sqrt(Math.pow(pos3.y - pos2.y, 2) + Math.pow(pos3.x - pos2.x, 2));
  var side3 = Math.sqrt(Math.pow(pos1.y - pos3.y, 2) + Math.pow(pos1.x - pos3.x, 2));
  var perimeter = (side1 + side2 + side3)/2;
  var area =  Math.sqrt(perimeter*((perimeter-side1)*(perimeter-side2)*(perimeter-side3)));
  return area;
};

module.exports = Bounds;
