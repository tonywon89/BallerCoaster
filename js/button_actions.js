var Ball = require("./components/ball.js");
var Track = require("./components/track.js");
var BallGenerator = require("./components/ball_generator.js");
var Portal = require("./components/portal.js");
var TextConstants = require("./constants/text_constants.js");
var HelperMethods = require("./util/helper_methods.js");

var placingFirstPortal = true;
var placingSecondPortal = false;
var portalId = 0;

var point1, point2, drawnTrack;
var trackDrawn = false;

var ButtonActions = {
  addBall: function (event, view) {
    var point = HelperMethods.getPoint(event, view);

    var ball = new Ball(point, 5, {x: 0, y: 0}, view.main);
    view.main.objects.push(ball);
    view.main.draw(view.context);
  },

  addBallGenerator: function (event, view) {
    var point = HelperMethods.getPoint(event, view);
    var angle = $('#ball-generator-angle').val();
    var radianAngle = angle * (Math.PI / 180);
    var velocity = parseInt($('#ball-generator-velocity').val());
    var frequency = parseInt($('#ball-generator-frequency').val());

    var ballGenerator = new BallGenerator(point, radianAngle, velocity, frequency, view.main);
    view.main.objects.push(ballGenerator);
    view.main.draw(view.context);
  },

  addPortal: function (event, view, portalType, id) {
    var isEntry = portalType === 'entry';
    var portalAngleId = isEntry ? '#first-portal-angle' : '#second-portal-angle';
    var portalWidthId = isEntry ? '#first-portal-width' : '#second-portal-width';
    var portalColor = isEntry ? "blue" : "orange";

    var point = HelperMethods.getPoint(event, view);
    var angle = $(portalAngleId).val();
    var radianAngle = angle * (Math.PI / 180);
    var width = parseInt($(portalWidthId).val());

    var portal = new Portal(id, isEntry, !isEntry, point, radianAngle, width, portalColor, view.main);
    view.main.objects.push(portal);
    portal.draw(view.context);
  },

  addBothPortals: function (event, view) {
    if (placingFirstPortal) {
      $("#portal-btn").prop("disabled", true);
      $("#place-portal-txt").text("Make Exit Portal");

      this.addPortal(event, view, 'entry', portalId);

      placingFirstPortal = false;
      placingSecondPortal = true;
    } else if (placingSecondPortal) {
      $("#portal-btn").prop("disabled", false);
      $("#place-portal-txt").text("Make Entry Portal");

      this.addPortal(event, view, 'exit', portalId);

      placingFirstPortal = true;
      placingSecondPortal = false;
      portalId += 1;
    }
  },

  removeObject: function (event, view) {
    var x = event.pageX - view.main.canvas.offsetLeft;
    var y = event.pageY - view.main.canvas.offsetTop;
    view.main.removeObject({x: x, y: y}, view.context);
  },

  play: function (view, activeBtn, activeText, inactiveText, active, callback) {
    if (!active) {
      HelperMethods.disableInactiveBtns(activeBtn);
      $(activeBtn).text(activeText);
      $(activeBtn).toggleClass("active");
      if (callback) {
        callback(view);
      }
      view.start();

      $('#main-canvas').on("click", function (e) {
        this.addBall(e, view);
      }.bind(this));
    } else {
      HelperMethods.enableBtns();
      $(activeBtn).text(inactiveText);
      $(activeBtn).toggleClass("active");
      view.stop();
    }
  },

  toggleCanvasClickListener: function (activeBtn, active, view, callback) {
    HelperMethods.disableInactiveBtns(activeBtn);
    if (!active) {
      $('#main-canvas').on("click", function (e) {
        callback(e, view, activeBtn);
      });
      $(activeBtn).text(TextConstants[activeBtn].active);
    } else {
      HelperMethods.enableBtns();
      $(activeBtn).text(TextConstants[activeBtn].inactive);
    }
  },

  toggleCanvasDragListener: function (activeBtn, active, view) {
    HelperMethods.disableInactiveBtns(activeBtn);
    if (!active) {
      var initial = true;
      $('#main-canvas').on("mousedown", function (e) {
        point1 = HelperMethods.getPoint(e, view);

      }).on("mousemove", function (e) {
        point2 = HelperMethods.getPoint(e, view);
        drawnTrack = HelperMethods.drawTrack(e, view, point1, point2, initial);
        if (drawnTrack) { initial = false; }

      }.bind(this)).on("mouseup", function (e) {
        trackDrawn = HelperMethods.addTrack(view, drawnTrack);
        point1 = 0;
        point2 = 0;
      });
      $(activeBtn).text(TextConstants[activeBtn].active);
    } else {
      if (trackDrawn) {
        view.main.objects.pop();
        trackDrawn = false;
      }
      HelperMethods.enableBtns();
      $(activeBtn).text(TextConstants[activeBtn].inactive);
    }
  }
};

module.exports = ButtonActions;
