var Main = function (gravity, objects) {
  this.gravity = gravity
  this.objects = objects;
};


Main.prototype.step = function () {
  this.objects.forEach(function(object) {
    object.step();
  });
};

module.exports = Main;
