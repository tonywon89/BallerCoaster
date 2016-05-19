var Ball = require("./ball.js");
var Track = require("./track.js");
var BallGenerator = require("./ball_generator.js");
var Portal = require("./portal.js");

var ButtonActions = require("./button_actions.js");

var ButtonListeners = {
  addBallListener: function (view) {
    var active = false;
    $('#place-ball-btn').click(function (event) {
      event.preventDefault();
      ButtonActions.toggleCanvasClickListener('#place-ball-btn', active, view, "Stop Placing Balls", "Place Balls", ButtonActions.addBall);
      active = !active;
    });
  },

  addTrackListener: function (view) {
    var isDrawingTracks = false;
    var point1, point2, track;
    var trackDrawn = false;
    var canvas = view.main.canvas;

    $('#draw-tracks-btn').click(function (event) {
      event.preventDefault();
      ButtonActions.disableInactiveBtns('#draw-tracks-btn');
      if (!isDrawingTracks) {
        $('#main-canvas').on("mousedown", function (e) {
          var x = e.pageX - canvas.offsetLeft;
          var y = e.pageY - canvas.offsetTop;

          point1 = {x: x, y: y};

        }).on("mousemove", function (e) {
          var x = e.pageX - canvas.offsetLeft;
          var y = e.pageY - canvas.offsetTop;
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
        }).on("mouseup", function (e) {
          // Will make sure the next drawing will pop the copy of it
          if (track) {
            view.main.objects.push(track);
            trackDrawn = true;
          }

          point1 = 0;
          point2 = 0;
        });
        $(this).text("Stop Drawing Tracks");
        isDrawingTracks = true;
      } else {
        isDrawingTracks = false;
        if (trackDrawn) {
          view.main.objects.pop();
          trackDrawn = false;
        }
        ButtonActions.enableBtns();

        $(this).text("Draw Tracks");
      }
    });
  },

  addPlayListener: function (view) {
    var isPlaying = false;
    var canvas = view.main.canvas;
    $('#play-btn').click(function(event) {
      event.preventDefault();
      if (!isPlaying) {
        ButtonActions.disableInactiveBtns('#play-btn');
        isPlaying = true;
        $(this).text("Stop");
        $(this).toggleClass("active");
        view.start();

        $('#main-canvas').on("click", function (e) {
          ButtonActions.addBall(e, view);
        });
      } else {
        ButtonActions.enableBtns();
        isPlaying = false;
        $(this).text("Play");
        $(this).toggleClass("active");
        view.stop();
      }
    });
  },

  addBallGeneratorListener: function (view) {
    var active = false;
    $('#ball-generator-btn').click(function (event) {
      event.preventDefault();
      ButtonActions.toggleCanvasClickListener(
        "#ball-generator-btn",
        active,
        view,
        "Stop Making Ball Generators",
        "Construct Ball Generators",
        ButtonActions.addBallGenerator
      );
      active = !active;
    });
  },

  addPortalListener: function (view) {
    var isActive = false;
    var placingFirstPortal = true;
    var placingSecondPortal = false;
    var portalId = 0;
    $("#portal-btn").click(function (event) {
      event.preventDefault();

      if (!isActive) {
        ButtonActions.disableInactiveBtns('#portal-btn');
        isActive = true;
        $(this).text("Stop making portals");
        $('#main-canvas').on("click", function (e) {
          if (placingFirstPortal) {
            $("#place-portal-txt").text("Make Exit Portal");
            $("#portal-btn").prop("disabled", true);

            placingFirstPortal = false;
            placingSecondPortal = true;

            ButtonActions.addPortal(e, view, 'entry', portalId);

          } else if (placingSecondPortal) {
            $("#portal-btn").prop("disabled", false);
            $("#place-portal-txt").text("Make Entry Portal");
            placingFirstPortal = true;
            placingSecondPortal = false;

            ButtonActions.addPortal(e, view, 'exit', portalId);
            portalId += 1;
          }
        });

      } else {
        ButtonActions.enableBtns();
        $("#place-portal-txt").text("Make Entry Portal");
        isActive = false;
        placingFirstPortal = true;
        placingSecondPortal = false;
        $(this).text("Make Portals");
      }

    });
  },

  demoListener: function (view, canvas, main) {
    var isDemoing = false;

    $('#demo-btn').click(function (event) {
      event.preventDefault();

      if (!isDemoing) {
        $('.menu-btn').prop("disabled", true);
        $(this).prop("disabled", false);
        $(this).text("Stop Demo");
        $(this).toggleClass("active");
        isDemoing = true;
        main.objects = [];
        main.draw(view.context);
        var ballGenerator;

        var angle = 60;
        var radianAngle = angle * (Math.PI / 180);
        var velocity = 5;
        var frequency = 60;

        var ballGenerator = new BallGenerator({x: 100, y: 200}, radianAngle, velocity, frequency, main);
        view.main.objects.push(ballGenerator);

        var entryPortal = new Portal(1000, true, false, {x: 250, y: 300}, 0, 50, "blue", main);
        view.main.objects.push(entryPortal);
        var exitPortal = new Portal(1000, false, true, {x: 500, y: 100}, radianAngle, 50, "orange", main);
        view.main.objects.push(exitPortal);

        var track = new Track({x: 800, y: 300}, {x: 500, y: 400}, view.main.gravity);
        view.main.objects.push(track);
        track = new Track({x: 400, y: 400}, {x: 600, y: 500}, view.main.gravity);
        view.main.objects.push(track);

        entryPortal = new Portal(1001, true, false, {x: 600, y: 550}, 0, 100, "blue", main);
        view.main.objects.push(entryPortal);
        exitPortal = new Portal(1001, false, true, {x: 100, y: 500}, 120 * Math.PI / 180, 50, "orange", main);
        view.main.objects.push(exitPortal);
        view.start();
      } else {
        $('.menu-btn').prop("disabled", false);
        $(this).text("Demo");
        $(this).toggleClass("active");
        isDemoing = false;
        view.stop();
      }
    });
  },

  addRemoveItemListener: function (view, canvas) {
    var isRemoving = false;

    $('#remove-item-btn').click(function (event) {
      event.preventDefault();

      if (!isRemoving) {
        ButtonActions.disableInactiveBtns('#remove-item-btn');
        $(this).text("Stop Removing");
        isRemoving = true;
        $('#main-canvas').on("click", function (e) {
          var x = e.pageX - canvas.offsetLeft;
          var y = e.pageY - canvas.offsetTop;
          view.main.removeObject({x: x, y: y}, view.context);
        });
      } else {
        ButtonActions.enableBtns();
        isRemoving = false;
        $(this).text("Remove item");
      }
    });
  },

  clearListener: function (view) {
    $('#clear-btn').click(function (event) {
      event.preventDefault();
      view.main.objects = [];
      view.main.draw(view.context);
    });
  }
};

module.exports = ButtonListeners;
