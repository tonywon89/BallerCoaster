var Track = require("./track.js");

var Ball = function (pos, radius, velocity, acceleration) {
  this.pos = pos;
  this.radius = radius;
  this.velocity = velocity
  this.acceleration = acceleration;
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
    return otherObject.containPoint({x: this.pos.x, y: this.pos.y + this.radius});
  } else {
    return false;
  }
};

Ball.prototype.collideWith = function (otherObject) {
  if (otherObject instanceof Track) {
    this.velocity.x = 0;
    this.velocity.y = 0;
    this.acceleration = {x: 0, y: 0};
  }
};



module.exports = Ball;
