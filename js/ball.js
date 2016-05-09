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



    // var theta = otherObject.theta;
    // var Cx = A.x - C.x;
    // var Cy = A.y - C.y;
    // var gamma = Math.atan(Cx, Cy);
    // var beta = gamma - theta;
    // var BC = Math.sin(beta) * Math.abs(otherObject.distance(C, A));

    // console.log(BC);
    var largerX = B.x > A.x ? B.x : A.x
    var smallerX = B.x >= A.x ? A.x : B.x

    if (LEC <= this.radius && (this.pos.x <= largerX && this.pos.x >= smallerX)) {
      // this.collidedTrack = otherObject;
      return true
    } else {
      this.isCollided = false
      this.acceleration = { x: 0, y: this.main.gravity }
      return false;
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



module.exports = Ball;
