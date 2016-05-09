var Main = function (gravity, objects, canvasWidth, canvasHeight) {
  this.gravity = gravity
  this.objects = objects;
  this.canvasWidth = canvasWidth;
  this.canvasHeight = canvasHeight;
};


Main.prototype.step = function () {
  this.objects.forEach(function(object) {
    object.step(this.gravity);
  });
};

Main.prototype.draw = function (context) {
  context.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
  this.objects.forEach(function(object) {
    object.draw(context);
  }.bind(this));
};

module.exports = Main;
