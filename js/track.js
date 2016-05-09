var Track = function (point1, point2, gravity) {
    this.point1 = point1;
    this.point2 = point2;
    this.theta = Math.atan2(point2.y - point1.y, point2.x - point1.x);
    this.slopeGravity = gravity * Math.sin(this.theta);
    this.xAccel = this.slopeGravity * Math.cos(this.theta);
    this.yAccel = this.slopeGravity * Math.sin(this.theta);

};

Track.prototype.draw = function (context) {
  context.beginPath();
  context.moveTo(this.point1.x, this.point1.y);
  context.lineTo(this.point2.x, this.point2.y);
  context.stroke();
};

Track.prototype.step = function () {

};

Track.prototype.containPoint =  function (point) {
  return Math.round(this.distance(this.point1, point) + this.distance(this.point2, point)) === Math.round(this.distance(this.point1, this.point2));
};

Track.prototype.distance = function (point1, point2) {
  return Math.sqrt(Math.pow(point1.x - point2.x, 2) + Math.pow(point1.y - point2.y, 2));
};

Track.prototype.isCollideWith = function (otherObject) {

};

Track.prototype.collideWith = function (otherObject) {

};

module.exports = Track;
