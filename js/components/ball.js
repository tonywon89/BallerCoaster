var Track = require("./track.js");
var Bounds = require("../util/bounds.js");

var Ball = function (pos, radius, velocity, color, main) {
  this.pos = pos;
  this.radius = radius;
  this.velocity = velocity;
  this.acceleration = {x: 0, y: main.gravity};
  this.main = main;
  this.color = color;
  this.isCollided = false;
};

Ball.prototype.draw = function (context) {
  context.beginPath();
  context.arc(this.pos.x, this.pos.y, this.radius, 0, Math.PI * 2);
  context.fillStyle = this.color;
  context.fill();
  context.stroke();
};

Ball.prototype.step = function () {
  this.velocity.y += this.acceleration.y;
  this.velocity.x += this.acceleration.x;
  this.pos.y += this.velocity.y;
  this.pos.x += this.velocity.x;
  if (this.pos.y > this.main.canvas.height || this.pos.x > this.main.canvas.width) {
    var idx = this.main.objects.indexOf(this);
    this.main.objects.splice(idx, 1);
  }
};

Ball.prototype.isCollideWith = function (otherObject) {
  if (otherObject instanceof Track) {
    var A = { x: otherObject.point1.x, y: otherObject.point1.y };
    var B = { x: otherObject.point2.x, y: otherObject.point2.y };
    var C = { x: this.pos.x, y: this.pos.y };
    var LAB = Math.sqrt(Math.pow((B.x - A.x), 2) + Math.pow((B.y - A.y), 2));

    var Dx = (B.x - A.x) / LAB;
    var Dy = (B.y - A.y) / LAB;

    var t = Dx * (C.x - A.x) + Dy * (C.y - A.y);

    var Ex = t * Dx + A.x;
    var Ey = t * Dy + A.y;

    var LEC = Math.sqrt(Math.pow((Ex - C.x), 2) + Math.pow((Ey - C.y), 2));
    if (Ey < this.pos.y) {
      var overlap = this.radius + LEC;
    } else {
      var overlap = this.radius - LEC;
    }

    var speed = Math.sqrt(Math.pow((this.velocity.x), 2) + Math.pow((this.velocity.y), 2));

    var scale = -overlap / speed;
    var x = scale * this.velocity.x;
    var y = scale * this.velocity.y;
    this.backupVector = {x: x, y: y};

    var largerX = B.x > A.x ? B.x : A.x;
    var smallerX = B.x >= A.x ? A.x : B.x;

    if (LEC <= this.radius && (this.pos.x < largerX && this.pos.x > smallerX)) {
      this.collidedObject = otherObject;
      return true;
    } else {
      if (this.collidedObject === otherObject) {
        this.collidedObject = undefined;
        this.isCollided = false;
        this.acceleration = { x: 0, y: this.main.gravity };
        this.backupVector = null;
        return false;
      } else {
        this.acceleration = { x: 0, y: this.main.gravity };
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
        if (this.backupVector) {
          this.pos.x += this.backupVector.x;
          this.pos.y += this.backupVector.y;
        }
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
  var bounds = Bounds.circleBounds(this);
  if (pos.x >= bounds.left && pos.x <= bounds.right && pos.y >= bounds.top && pos.y <= bounds.bottom) {
    return true;
  } else {
    return false;
  }
};

module.exports = Ball;
