var Track = require("./track.js");

var Ball = function (pos, radius, velocity, main) {
  this.pos = pos;
  this.radius = radius;
  this.velocity = velocity
  this.acceleration = {x: 0, y: main.gravity};
  this.main = main;
  this.isCollided = false;
};

Ball.prototype.draw = function (context) {
  context.beginPath();
  context.arc(this.pos.x, this.pos.y, this.radius, 0, Math.PI * 2);
  context.stroke();
};

Ball.prototype.step = function () {
  this.velocity.y += this.acceleration.y;
  this.velocity.x += this.acceleration.x;
  this.pos.y += this.velocity.y;
  this.pos.x += this.velocity.x;
  if (this.pos.y > this.main.canvasHeight || this.pos.x > this.main.canvasWidth) {
    var idx = this.main.objects.indexOf(this);
    this.main.objects.splice(idx, 1);
  }
};

Ball.prototype.isCollideWith = function (otherObject) {
  if (otherObject instanceof Track) {
    var A = { x: otherObject.point1.x, y: otherObject.point1.y };
    var B = { x: otherObject.point2.x, y: otherObject.point2.y };
    var C = { x: this.pos.x, y: this.pos.y }
    var LAB = Math.sqrt(Math.pow((B.x - A.x), 2) + Math.pow((B.y - A.y), 2));

    var Dx = (B.x - A.x) / LAB;
    var Dy = (B.y - A.y) / LAB;

    var t = Dx * (C.x - A.x) + Dy * (C.y - A.y);

    var Ex = t * Dx + A.x;
    var Ey = t * Dy + A.y;

    var LEC = Math.sqrt(Math.pow((Ex - C.x), 2) + Math.pow((Ey - C.y), 2))

    var largerX = B.x > A.x ? B.x : A.x
    var smallerX = B.x >= A.x ? A.x : B.x

    var largerY = B.y > A.y ? B.y : A.y
    var smallerY = B.y >= A.y ? A.y : B.y

    if (LEC <= this.radius && (this.pos.x <= largerX && this.pos.x >= smallerX) && (this.pos.y <= largerY && this.pos.y >= smallerY)) {
      this.collidedObject = otherObject;
      return true
    } else {

      if (this.collidedObject === otherObject) {
        this.collidedObject = undefined;
        this.isCollided = false;
        this.acceleration = { x: 0, y: this.main.gravity }
        return false;
      } else {
        this.acceleration = { x: 0, y: this.main.gravity }
        return false;
      }

    }
  } else {
    return false;
  }
};

Ball.prototype.collideWith = function (otherObject) {
  if (otherObject instanceof Track) {
    if (!this.isCollided) {
        this.isCollided = true;
        this.velocity.x = 0;
        this.velocity.y = 0;
        this.acceleration = {x: otherObject.xAccel, y: otherObject.yAccel};
      } else {
        this.acceleration = {x: otherObject.xAccel, y: otherObject.yAccel};
      }
  }
};

Ball.prototype.containPoint = function (pos) {

};

module.exports = Ball;
