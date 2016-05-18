var Ball = require("./ball.js");
var Portal = require("./portal.js");

var Main = function (gravity, objects, canvas) {
  this.gravity = gravity;
  this.objects = objects;
  this.canvas = canvas;
};

Main.prototype.step = function () {
  this.checkCollisions();
  this.objects.forEach(function(object) {
    object.step();
  });
};

Main.prototype.draw = function (context) {
  context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  this.objects.forEach(function(object) {
    object.draw(context);
  });
};

Main.prototype.checkCollisions = function () {
  var main = this;
  this.objects.forEach(function(obj1) {
    if (!(obj1 instanceof Ball) && !(obj1 instanceof Portal)) return;
    main.objects.some(function(obj2) {
      if (obj1.isCollideWith(obj2)) {
        obj1.collideWith(obj2);
        return true;
      }
      return false;
    });
  });
};

Main.prototype.removeObject = function (pos, context) {
  for (var i = 0; i < this.objects.length; i++) {
    if (this.objects[i].containPoint(pos)) {
      if (this.objects[i] instanceof Portal) {
        var idx = this.objects.indexOf(this.objects[i].findPair());
        idx < i ? this.objects.splice(idx, 2) : this.objects.splice(i, 2);
        this.draw(context);
      } else {
        this.objects.splice(i, 1);
        this.draw(context);
        return;
      }
    }
  }
};

module.exports = Main;
