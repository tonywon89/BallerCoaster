var Ball = require("./ball.js");
var Bounds = require("../util/bounds.js");
var Portal = function (portalId, entry, exit, pos, angle, width, color, main) {
  this.portalId = portalId;
  this.entry = entry;
  this.exit = exit;
  this.pos = pos;
  this.angle = -angle;
  this.width = width;
  this.height = 10;
  this.color = color;
  this.main = main;
  this.pulseInterval = 0;
};

Portal.prototype.draw = function (context) {
  var firstCorner = Bounds.computeFirstCorner(this);
  context.beginPath();
  context.ellipse(this.pos.x, this.pos.y, this.width/2, this.height/2, this.angle, 0, Math.PI * 2, false);
  context.closePath();
  context.fillStyle = this.color;
  context.stroke();
  context.fill();
  context.fillStyle = "none";
  context.beginPath();
  context.ellipse(this.pos.x, this.pos.y, this.width/2 * this.pulseInterval , this.height/2 * this.pulseInterval, this.angle, 0, Math.PI * 2, false);
  context.closePath();
  context.strokeStyle = "white";
  context.stroke();
  context.strokeStyle = "black";
  if (this.exit) {
    context.beginPath();
    context.moveTo(firstCorner.x, firstCorner.y);
    var secondX = firstCorner.x + this.width * Math.cos(this.angle);
    var secondY = firstCorner.y + this.width * Math.sin(this.angle);
    context.lineTo(secondX, secondY);
    context.closePath();
    context.stroke();
  }
};

Portal.prototype.step = function () {
  this.pulseInterval += 0.05;
  if (this.pulseInterval >= 1) {
    this.pulseInterval = 0;
  }
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
      return;
    }
  }.bind(this));
  return pair;
};

Portal.prototype.isCollideWith = function (otherObject) {
  if (this.entry) {
    if (otherObject instanceof Ball) {
      var ball = otherObject;
      var ballBounds = Bounds.circleBounds(ball);
      var topVertex = { x: ball.pos.x, y: ballBounds.top };
      var bottomVertex = { x: ball.pos.x, y: ballBounds.bottom };
      var leftVertex = { x: ballBounds.left, y: ball.pos.y };
      var rightVertex = { x: ballBounds.right, y: ball.pos.y };

      if (Bounds.containRect(this, bottomVertex)) {
        return true;
      } else if (Bounds.containRect(this, topVertex)) {
        return true;
      } else if (Bounds.containRect(this, leftVertex)) {
        return true;
      } else if (Bounds.containRect(this, rightVertex)) {
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
  var portalBounds = Bounds.rectBounds(exitPortal);
  var width = (portalBounds.right + portalBounds.left) / 2 ;
  var height = (portalBounds.bottom + portalBounds.top) / 2;
  
  ball.pos.x = width;
  ball.pos.y = height;

  var speed = Math.sqrt(Math.pow(ball.velocity.x, 2) + Math.pow(ball.velocity.y, 2));

  ball.velocity.x = speed * Math.cos(Math.PI / 2 + exitPortal.angle);
  ball.velocity.y = speed * Math.sin(Math.PI / 2 + exitPortal.angle);
};

Portal.prototype.containPoint = function (pos) {
  return Bounds.containRect(this, pos);
};

module.exports = Portal;
