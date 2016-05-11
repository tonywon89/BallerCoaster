var Note = require("./util/Note.js");
var Ball = require("./ball.js");

var MusicalHoop = function (pos, angle, width, height, note, main) {
  this.pos = pos;
  this.angle = -angle;
  this.width = width;
  this.height = height;
  this.note = note;
  this.main = main;
  this.isCollided = false;
};
//
MusicalHoop.prototype.draw = function (context) {
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
  context.strokeStyle = "red";
  context.stroke();
  context.strokeStyle = "black";
};

MusicalHoop.prototype.step = function () {
  // if (this.isCollided) {
  //   this.note.start();
  // } else {
  //   this.note.stop();
  // }
};

MusicalHoop.prototype.bounds

MusicalHoop.prototype.isCollideWith = function (otherObject) {
  if (otherObject instanceof Ball) {
    var ball = otherObject;

    if ((ball.pos.x <= this.pos.x + this.width && ball.pos.x >= this.pos.x) && (ball.pos.y <= this.pos.y + this.height && ball.pos.y >= this.pos.y)){
      debugger;
      return true
    } else {
      this.note.stop();
      return false;
    }
  } else {
    this.note.stop();
    return false;
  }
};

MusicalHoop.prototype.collideWith = function (otherObject) {
  this.note.start()
};

MusicalHoop.collideWith

module.exports = MusicalHoop;
