var View = function (context, main) {
  this.context = context;
  this.main = main;
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
    this.main.draw(this.context);
    this.main.step();
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
