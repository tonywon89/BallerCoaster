var Ball = require("./ball.js");

var ButtonListeners = {
  addBallListener: function (view, canvas) {
    var isPlacingBall = false;
    $('#place-ball-btn').click(function(event) {
      event.preventDefault();

      if (!isPlacingBall) {
        $('#main-canvas').on("click", function (event) {
          var x = event.pageX - canvas.offsetLeft;
          var y = event.pageY - canvas.offsetTop;

          var ball = new Ball({x: x, y: y}, 5);
          view.main.objects.push(ball);
          view.main.draw(view.context);
        });

        $(this).text("Stop Placing Balls");
        isPlacingBall = true;
      } else {
        $('#main-canvas').off("click");
        isPlacingBall = false;
        $(this).text("Place Balls");
      }
    });
  },

  addPlayListener: function (view) {
    var isPlaying = false;
    $('#play-btn').click(function(event) {
      event.preventDefault();
      if (isPlaying) {
        isPlaying = false;
        $(this).text("Play");
        view.stop();
      } else {
        isPlaying = true;
        $(this).text("Stop");
        view.start();
      }
    });
  }
}

module.exports = ButtonListeners;
