var Ball = require("./ball.js");
var Track = require("./track.js");
var BallGenerator = require("./ball_generator.js");
var Portal = require("./portal.js");

var placingFirstPortal = true;
var placingSecondPortal = false;
var portalId = 0;

var ButtonActions = {
  disableInactiveBtns: function (activeBtn) {
    $('.menu-btn').prop("disabled", true);
    $(activeBtn).prop("disabled", false);
  },

  enableBtns: function () {
    $('.menu-btn').prop("disabled", false);
    $('#main-canvas').off();
  },

  addBall: function (event, view) {
    var x = event.pageX - view.main.canvas.offsetLeft;
    var y = event.pageY - view.main.canvas.offsetTop;

    var ball = new Ball({x: x, y: y}, 5, {x: 0, y: 0}, view.main);
    view.main.objects.push(ball);
    view.main.draw(view.context);
  },

  addBallGenerator: function (event, view) {
    var x = event.pageX - view.main.canvas.offsetLeft;
    var y = event.pageY - view.main.canvas.offsetTop;

    var angle = $('#ball-generator-angle').val();
    var radianAngle = angle * (Math.PI / 180);

    var velocity = parseInt($('#ball-generator-velocity').val());

    var frequency = parseInt($('#ball-generator-frequency').val());

    var ballGenerator = new BallGenerator({x: x, y: y}, radianAngle, velocity, frequency, view.main);
    view.main.objects.push(ballGenerator);
    view.main.draw(view.context);
  },

  addPortal: function (event, view, portalType, id) {
    var isEntry = portalType === 'entry';
    var portalAngleId = isEntry ? '#first-portal-angle' : '#second-portal-angle';
    var portalWidthId = isEntry ? '#first-portal-width' : '#second-portal-width';
    var portalColor = isEntry ? "blue" : "orange";

    var x = event.pageX - view.main.canvas.offsetLeft;
    var y = event.pageY - view.main.canvas.offsetTop;
    var angle = $(portalAngleId).val();
    var radianAngle = angle * (Math.PI / 180);
    var width = parseInt($(portalWidthId).val());

    var portal = new Portal(id, isEntry, !isEntry, {x: x, y: y}, radianAngle, width, portalColor, view.main);
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

  toggleCanvasClickListener: function (activeBtn, active, view, activeText, inactiveText, callback) {
    this.disableInactiveBtns(activeBtn);
    if (!active) {
      $('#main-canvas').on("click", function (e) {
        callback(e, view);
      });
      $(activeBtn).text(activeText);
    } else {
      this.enableBtns();
      $(activeBtn).text(inactiveText);
    }
  }
};

module.exports = ButtonActions;
