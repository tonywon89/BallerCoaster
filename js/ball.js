var Ball = function (pos, radius) {
  this.pos = pos;
  this.radius = radius;
  this.velocity = {x: 0, y: 0};
};

Ball.prototype.draw = function (context) {
  context.beginPath();
  context.arc(this.pos.x, this.pos.y, this.radius, 0, Math.PI * 2);
  context.stroke();
};

Ball.prototype.step = function (gravity) {
  this.velocity.y += gravity;
  this.pos.y += this.velocity.y;
  this.pos.x += this.velocity.x;
};


module.exports = Ball;
