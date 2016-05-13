var Ball = require("./ball.js");
var Utils = require("./utils.js");

var Portal = function (portalId, entry, exit, pos, angle, width, color, main) {
  this.portalId = portalId;
  this.entry = entry
  this.exit = exit;
  this.pos = pos;
  this.angle = -angle;
  this.width = width;
  this.height = 10;
  this.color = color;
  this.main = main;
};

Portal.prototype.draw = function (context) {
  context.beginPath();
  context.moveTo(this.pos.x, this.pos.y);
  var secondX = this.pos.x + this.width * Math.cos(this.angle);
  var secondY = this.pos.y + this.width * Math.sin(this.angle);
  context.lineTo(secondX, secondY);
  var thirdX = secondX + this.height * Math.cos(this.angle + Math.PI / 2);
  var thirdY = secondY + this.height * Math.sin(this.angle + Math.PI / 2);
  context.lineTo(thirdX, thirdY);
  var fourthX = thirdX + this.width * Math.cos(this.angle + Math.PI);
  var fourthY = thirdY + this.width * Math.sin(this.angle + Math.PI);
  context.lineTo(fourthX, fourthY);
  context.closePath();
  context.fillStyle = this.color;
  context.stroke();
  context.fill()
  context.fillStyle = "none";
  if (this.exit) {
    context.strokeStyle = "yellow"
    context.beginPath();
    context.moveTo(thirdX, thirdY);
    context.lineTo(fourthX, fourthY);
    context.stroke();
    context.strokeStyle = "black";
  }

};

Portal.prototype.step = function () {

};

Portal.prototype.findPair = function () {
  var pair;
  this.main.objects.forEach(function (object) {
    if (object === this) return;
    if (object instanceof Portal) {
      if (object.portalId === this.portalId) {
        pair = object;
      }
    } else {
      return
    }
  }.bind(this));
  return pair;
};

Portal.prototype.isCollideWith = function (otherObject) {
  if (this.entry) {
    if (otherObject instanceof Ball) {
      var ball = otherObject;
      var ballBounds = Utils.circleBounds(ball);
      var topVertex = { x: ball.pos.x, y: ballBounds.top }
      var bottomVertex = { x: ball.pos.x, y: ballBounds.bottom }
      var leftVertex = { x: ballBounds.left, y: ball.pos.y }
      var rightVertex = { x: ballBounds.right, y: ball.pos.y }

      var portalBounds = Utils.rectBounds(this);

      if (bottomVertex.x >= portalBounds.left && bottomVertex.x <= portalBounds.right && bottomVertex.y >= portalBounds.top && bottomVertex.y <= portalBounds.bottom) {
        return true;
      } else if (topVertex.x >= portalBounds.left && topVertex.x <= portalBounds.right && topVertex.y >= portalBounds.top && topVertex.y <= portalBounds.bottom) {
        return true;
      } else if (leftVertex.x >= portalBounds.left && leftVertex.x <= portalBounds.right && leftVertex.y >= portalBounds.top && leftVertex.y <= portalBounds.bottom) {
        return true;
      } else if (rightVertex.x >= portalBounds.left && rightVertex.x <= portalBounds.right && rightVertex.y >= portalBounds.top && rightVertex.y <= portalBounds.bottom) {
        return true;
      } else {
        return false;
      }
    }
  } else {
    return false;
  }
};

Portal.prototype.collideWith = function (otherObject) {
  var exitPortal = this.findPair();
  var ball = otherObject;
  var portalBounds = Utils.rectBounds(exitPortal);
  var width = (portalBounds.right + portalBounds.left) / 2 ;
  var height = (portalBounds.bottom + portalBounds.top) / 2;

  ball.pos.x = width;
  ball.pos.y = height;

  var speed = Math.sqrt(Math.pow(ball.velocity.x, 2) + Math.pow(ball.velocity.y, 2));

  ball.velocity.x = speed * Math.cos(Math.PI / 2 + exitPortal.angle);
  ball.velocity.y = speed * Math.sin(Math.PI / 2 + exitPortal.angle);
};

Portal.prototype.containPoint = function (pos) {
  return Utils.containRect(this, pos);
};

module.exports = Portal;
