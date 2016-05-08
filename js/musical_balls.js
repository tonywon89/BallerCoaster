var Main = require("./main.js");
var View = require("./view.js");
var Ball = require("./ball.js");
$(function () {
  var main = new Main();

  var canvasEl = document.getElementById("main-canvas");
  canvasEl.width = window.innerWidth * 0.65
  canvasEl.height = window.innerHeight * 0.85;
  var context = canvasEl.getContext('2d');
  var view = new View(context, [], canvasEl.width, canvasEl.height);

  var isPlaying = false;
  $('#place-ball-btn').click(function(event) {
    event.preventDefault();
    $('#main-canvas').on("click", function (event) {
      var x = event.pageX - canvasEl.offsetLeft;
      var y = event.pageY - canvasEl.offsetTop;

      var ball = new Ball({x: x, y: y}, 5);
      view.objects.push(ball);
      view.draw();
    });

  });

  var requestAnimationFrame =
      window.requestAnimationFrame ||
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      window.msRequestAnimationFrame ||
      window.oRequestAnimationFrame ||
      function(callback) {
        return setTimeout(callback, 1);
      };

  var requestId;
  $('#play-btn').click(function(event) {
    event.preventDefault();
    $('#main-canvas').off("click");
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

  // var render = function() {
  //   requestAnimationFrame(view.animate.bind(view));
  // };
  //
  // render();
});
