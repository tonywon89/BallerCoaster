var BallGenerator = function (pos, angle, ballVelocity, frequency) {
  this.pos = pos;
  this.angle = -angle;
  this.ballVelocity = ballVelocity;
  this.frequency = frequency;
  this.width = 40;
  this.height = 15;
};

BallGenerator.prototype.draw = function (context) {

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
  context.stroke();
}

module.exports = BallGenerator;
