var Ball = require("./ball.js");
var Track = require("./track.js");
var BallGenerator = require("./ball_generator.js");
var Portal = require("./portal.js");

var ButtonListeners = {
  addBallListener: function (view, canvas) {
    var isPlacingBall = false;
    $('#place-ball-btn').click(function (event) {
      event.preventDefault();
      $('.menu-btn').prop("disabled", true);
      $(this).prop("disabled", false);
      if (!isPlacingBall) {
        $('#main-canvas').on("click", function (event) {
          var x = event.pageX - canvas.offsetLeft;
          var y = event.pageY - canvas.offsetTop;

          var ball = new Ball({x: x, y: y}, 5, {x: 0, y: 0}, view.main);
          view.main.objects.push(ball);
          view.main.draw(view.context);
        });

        $(this).text("Stop Placing Balls");
        isPlacingBall = true;
      } else {
        $('.menu-btn').prop("disabled", false);
        $('#main-canvas').off("click");
        isPlacingBall = false;
        $(this).text("Place Balls");
      }
    });
  },

  addTrackListener: function (view, canvas) {
    var isDrawingTracks = false;
    var point1, point2, track;

    $('#draw-tracks-btn').click(function (event) {
      event.preventDefault();
      $('.menu-btn').prop("disabled", true);
      $('#draw-tracks-btn').prop("disabled", false);
      if (!isDrawingTracks) {
        $('#main-canvas').on("mousedown", function (event) {
          var x = event.pageX - canvas.offsetLeft;
          var y = event.pageY - canvas.offsetTop;

          point1 = {x: x, y: y};

        }).on("mousemove", function (event) {
          var x = event.pageX - canvas.offsetLeft;
          var y = event.pageY - canvas.offsetTop;
          point2 = {x: x, y: y};

          if (point1) {
            track = new Track(point1, point2, view.main.gravity);

            if (view.main.objects[view.main.objects.length - 1] instanceof Track) {
              view.main.objects.pop();
              view.main.objects.push(track);
              view.main.draw(view.context);
            } else {
              view.main.objects.push(track);
              view.main.draw(view.context);
            }
          }
        }).on("mouseup", function (event) {
          // Will make sure the next drawing will pop the copy of it
          if (track) {
            view.main.objects.push(track);
          }

          point1 = 0;
          point2 = 0;
        });
        $(this).text("Stop Drawing Tracks");
        isDrawingTracks = true;
      } else {
        $('.menu-btn').prop("disabled", false);
        $('#main-canvas').off();
        view.main.objects.pop();
        isDrawingTracks = false;
        $(this).text("Draw Tracks")
      }
    });
  },

  addPlayListener: function (view) {
    var isPlaying = false;
    $('#play-btn').click(function(event) {
      event.preventDefault();
      if (!isPlaying) {
        $('.menu-btn').prop("disabled", true);
        $(this).prop("disabled", false);
        isPlaying = true;
        $(this).text("Stop");
        view.start();
      } else {
        $('.menu-btn').prop("disabled", false);
        isPlaying = false;
        $(this).text("Play");
        view.stop();
      }
    });
  },

  addBallGeneratorListener: function (view, canvas, main) {
    var isBallGenerating = false;
    $('#ball-generator-btn').click(function (event) {
      event.preventDefault();
      if (!isBallGenerating) {
        $('.menu-btn').prop("disabled", true);
        $(this).prop("disabled", false);
        isBallGenerating = true;
        $(this).text("Stop Making Ball Generators");
        $('#main-canvas').on("click", function (event) {
          var x = event.pageX - canvas.offsetLeft;
          var y = event.pageY - canvas.offsetTop;

          var angle = $('#ball-generator-angle').val();
          var radianAngle = angle * (Math.PI / 180);

          var velocity = $('#ball-generator-velocity').val();

          var frequency = $('#ball-generator-frequency').val();

          var ballGenerator = new BallGenerator({x: x, y: y}, radianAngle, velocity, frequency, main);
          view.main.objects.push(ballGenerator);
          view.main.draw(view.context);
        });

      } else {
        $('#main-canvas').off();
        $('.menu-btn').prop("disabled", false);
        isBallGenerating = false;

        $(this).text("Construct Ball Generators");
      }
    })
  },

  addPortalGenerator: function (view, canvas, main) {
    var isActive = false;
    var placingFirstPortal = true;
    var placingSecondPortal = false;
    var portalId = 0;
    $("#portal-btn").click(function (event) {
      event.preventDefault();

      if (!isActive) {
        $('.menu-btn').prop("disabled", true);
        $(this).prop("disabled", false);
        isActive = true;
        $(this).text("Stop placing portals");
        $('#main-canvas').on("click", function (event) {
          if (placingFirstPortal) {
            $("#place-portal-txt").text("Place Exit Portal");
            $("#portal-btn").prop("disabled", true);

            placingFirstPortal = false;
            placingSecondPortal = true;

            var x = event.pageX - canvas.offsetLeft;
            var y = event.pageY - canvas.offsetTop;

            var angle = $('#first-portal-angle').val();
            var radianAngle = angle * (Math.PI / 180);

            var color = "blue";

            var width = parseInt($('#first-portal-width').val());


            var entryPortal = new Portal(portalId, true, false, {x: x, y: y}, radianAngle, width, color, main)
            main.objects.push(entryPortal);
            entryPortal.draw(view.context);

          } else if (placingSecondPortal) {
            $("#portal-btn").prop("disabled", false);
            $("#place-portal-txt").text("Place Entry Portal");
            placingFirstPortal = true;
            placingSecondPortal = false;

            var x = event.pageX - canvas.offsetLeft;
            var y = event.pageY - canvas.offsetTop;

            var angle = $('#second-portal-angle').val();
            var radianAngle = angle * (Math.PI / 180);

            var width = parseInt($('#second-portal-width').val())

            var color = "orange";

            var exitPortal = new Portal(portalId, false, true, {x: x, y: y}, radianAngle, width, color, main);
            main.objects.push(exitPortal);
            exitPortal.draw(view.context);
            portalId += 1;
          }
        });

      } else {
        $('#main-canvas').off();
        $('.menu-btn').prop("disabled", false);
        $("#place-portal-txt").text("Place Entry Portal");
        isActive = false;
        placingFirstPortal = true;
        placingSecondPortal = false;
        $(this).text("Place Portals");
      }

    });
  },

  addRemoveItemListener: function (view, canvas, main) {
    var isRemoving = false;

    $('#remove-item-btn').click(function (event) {
      event.preventDefault();

      if (!isRemoving) {
        $('.menu-btn').prop("disabled", true);
        $(this).prop("disabled", false);
        $(this).text("Stop Removing");
        isRemoving = true;
        $('#main-canvas').on("click", function (event) {
          var x = event.pageX - canvas.offsetLeft;
          var y = event.pageY - canvas.offsetTop;

          main.removeObject({x: x, y: y}, view);
        });
      } else {
        $('.menu-btn').prop("disabled", false);
        $('#main-canvas').off();
        isRemoving = false;
        $(this).text("Remove item");
      }
    });
  },

  clearListener: function (main, context, canvas) {
    $('#clear-btn').click(function (event) {
      event.preventDefault();
      main.objects = [];
      main.draw(context);
    })
  }
}

module.exports = ButtonListeners;
