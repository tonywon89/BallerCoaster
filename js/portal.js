var Portal = function (portalId, entry, exit, pos, angle, width, color, main) {
  this.portalId = portalId;
  this.entry = entry
  this.exit = exit;
  this.pos = pos;
  this.angle = -angle;
  this.width = width;
  this.height = 10;
  this.color = color;
  this.main = main;
};

Portal.prototype.draw = function (context) {
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
  context.fillStyle = this.color;
  context.stroke();
  context.fill()
  context.fillStyle = "none";
};

Portal.prototype.step = function () {

};

Portal.prototype.findPair = function () {
  this.main.objects.forEach(function (object) {
    if (object === this) return;
    if (object instanceof Portal) {
      if (object.portalId === this.portalId) {
        return object;
      }
    } else {
      return
    }
  }.bind(this));
};

Portal.prototype.isCollideWith = function (otherObject) {

};

Portal.prototype.collideWith = function (otherObeject) {

};
module.exports = Portal;