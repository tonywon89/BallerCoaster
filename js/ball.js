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
    if (otherObject.containPoint({x: this.pos.x, y: this.pos.y + this.radius})) {
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
