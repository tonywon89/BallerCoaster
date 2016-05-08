var Ball = function (pos, radius) {
  this.pos = pos;
  this.radius = radius;
};

Ball.prototype.draw = function (context) {
  context.beginPath();
  context.arc(this.pos.x, this.pos.y, this.radius, 0, Math.PI * 2);
  context.stroke();
};

Ball.prototype.step = function () {
  this.pos.y += 1;
};


module.exports = Ball;
