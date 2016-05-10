var Ball = require("./ball.js");

var Main = function (gravity, objects, canvasWidth, canvasHeight) {
  this.gravity = gravity;
  this.objects = objects;
  this.canvasWidth = canvasWidth;
  this.canvasHeight = canvasHeight;
};


Main.prototype.step = function () {
  this.checkCollisions();
  this.objects.forEach(function(object) {
    object.step();
  }.bind(this));
};

Main.prototype.draw = function (context) {
  context.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
  this.objects.forEach(function(object) {
    object.draw(context);
  }.bind(this));
};

Main.prototype.checkCollisions = function () {
  var main = this;
  this.objects.forEach(function(obj1) {
    if (!(obj1 instanceof Ball)) return
    main.objects.some(function(obj2) {
      if (obj1 === obj2) return true;

      if (obj1.isCollideWith(obj2)) {
        obj1.collideWith(obj2);
        return true;
      }
      return false;
    });
  })
};

module.exports = Main;
