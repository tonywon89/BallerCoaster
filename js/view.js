var View = function (context, objects, canvasWidth, canvasHeight) {
  this.context = context;
  this.objects = objects;
  this.canvasWidth = canvasWidth;
  this.canvasHeight = canvasHeight;
};

View.prototype.draw = function () {
  this.context.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
  this.objects.forEach(function(object) {
    object.draw(this.context, this);
  }.bind(this));
};

var requestAnimationFrame =
    window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    function(callback) {
      return setTimeout(callback, 1);
    };
var cancelAnimationFrame =
    window.cancelAnimationFrame ||
    window.webkitCancelAnimationFrame ||
    window.mozCancelAnimationFrame ||
    window.msCancelAnimationFrame ||
    window.oCancelAnimationFrame ||
    function(callback) {
      return setTimeout(callback, 1);
    };

var requestId;
View.prototype.animate = function () {
    this.step();
    this.draw();
    requestId = requestAnimationFrame(this.animate.bind(this));
};

View.prototype.start = function () {
  if (!requestId) {
    this.animate();
  }
}

View.prototype.stop = function () {
  if (requestId) {
    cancelAnimationFrame(requestId);
    requestId = undefined;
  }
}


View.prototype.step = function () {
  this.objects.forEach(function(object) {
    object.step();
  });
};

module.exports = View;
