var Note = require("./util/Note.js");
var Ball = require("./ball.js");

var MusicalHoop = function (point1, note, main) {
  this.point1 = point1;
  this.point2 = {x: point1.x + 100, y: point1.y};
  // this.angle = angle;
  // this.width = width;
  this.width = 100;
  this.note = note;
  this.main = main;
  this.isCollided = false;
};

MusicalHoop.prototype.draw = function (context) {
  context.beginPath();
  context.moveTo(this.point1.x, this.point1.y);
  context.lineTo(this.point2.x, this.point2.y);
  context.strokeStyle = "red";
  context.stroke();
  context.strokeStyle = "black";
};

MusicalHoop.prototype.step = function () {
  if (this.isCollided) {
    this.note.start();
  }
};

MusicalHoop.prototype.isCollideWith = function (otherObject) {
  if (otherObject instanceof Ball) {
    var A = { x: this.point1.x, y: this.point1.y };
    var B = { x: this.point2.x, y: this.point2.y };
    var C = { x: otherObject.pos.x, y: otherObject.pos.y }
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
    // var LEC = this.point1.y - otherObject.pos.y;

    if (LEC <= otherObject.radius){
      this.ball = otherObject;
      this.isCollided = true;
      return true

    } else {
      if (this.ball === otherObject) {
        this.note.stop();
        this.ball === undefined;
        this.isCollided = false
      }
      return false;
    }
  } else {
    return false;
  }
};

MusicalHoop.prototype.collideWith = function (otherObject) {
  this.isCollided = true;
};

MusicalHoop.collideWith

module.exports = MusicalHoop;
