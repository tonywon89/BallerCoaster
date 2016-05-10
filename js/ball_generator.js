var Ball = require("./ball.js");

var BallGenerator = function (pos, angle, ballVelocity, frequency, main) {
  this.pos = pos;
  this.angle = -angle;
  this.ballVelocity = ballVelocity;
  this.frequency = frequency;
  this.width = 40;
  this.height = 15;
  this.radius = 5;
  this.main = main;
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

  var angle = (this.angle + Math.PI / 2) - Math.atan(this.radius/(this.height / 2));
  var z = Math.sqrt(Math.pow(this.radius, 2) + Math.pow((this.height / 2), 2));
  var posX = secondX + z * Math.cos(angle);
  var posY = secondY + z * Math.sin(angle);

  var ball = new Ball({x: posX, y: posY}, this.radius, {x: 0, y: 0}, this.main);
  ball.draw(context);
}

BallGenerator.prototype.step = function () {

},

module.exports = BallGenerator;
