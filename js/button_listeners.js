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
    var active = false;
    $('#draw-tracks-btn').click(function (event) {
      event.preventDefault();
      ButtonActions.toggleCanvasDragListener('#draw-tracks-btn', active, view, "Stop Drawing Tracks", "Draw Tracks");
      active = !active;
    });
  },

  addPlayListener: function (view) {
    var active = false;
    var canvas = view.main.canvas;
    $('#play-btn').click(function(event) {
      event.preventDefault();
      ButtonActions.play(view, '#play-btn', active);
      active = !active;
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
    var active = false;
    $("#portal-btn").click(function (event) {
      event.preventDefault();
      ButtonActions.toggleCanvasClickListener(
        "#portal-btn",
        active,
        view,
        "Stop Making Portals",
        "Make Portals",
        ButtonActions.addBothPortals.bind(ButtonActions)
      );
      active = !active;
    });
  },

  demoListener: function (view, canvas, main) {
    var active = false;

    $('#demo-btn').click(function (event) {
      event.preventDefault();

      if (!active) {
        ButtonActions.disableInactiveBtns('#demo-btn');
        active = true;
        
        main.objects = [];
        main.draw(view.context);

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

        $(this).text("Stop Demo");
        $(this).toggleClass("active");
        view.start();
      } else {
        $('.menu-btn').prop("disabled", false);
        $(this).text("Demo");
        $(this).toggleClass("active");
        active = false;
        view.stop();
      }
    });
  },

  addRemoveItemListener: function (view) {
    var active = false;
    $('#remove-item-btn').click(function (event) {
      event.preventDefault();
      ButtonActions.toggleCanvasClickListener("#remove-item-btn", active, view, "Stop Removing", "Remove item", ButtonActions.removeObject);
      active = !active;
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
