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

var addBallPreview = function (ballPreview, view, context) {
  var x = ballPreview.width/2;
  var y = ballPreview.height/2;
  var point = {x: x, y: y};
  var size = parseInt($('#ball-size').val());
  var color= '#' + $('#ball-color').val();
  var ball = new Ball(point, size, {x: 0, y: 0}, color, view.main);
  ball.draw(context);
};

var addGeneratorPreview = function (generatorPreview, view, context) {
  var x = generatorPreview.width/2;
  var y = generatorPreview.height/2;
  var point = {x: x, y: y};
  var angle = parseInt($('#ball-generator-angle').val());
  var radianAngle = angle * (Math.PI / 180);
  var velocity = parseInt($('#ball-generator-velocity').val());
  var frequency = parseInt($('#ball-generator-frequency').val());
  var color = $('#hidden-ball-generator-color').val();
  var size = parseInt($('#ball-generator-size').val());
  var ballGenerator = new BallGenerator(point, radianAngle, velocity, frequency, color, view.main);
  ballGenerator.draw(context);
};

var ButtonActions = {
  addBall: function (event, view) {
    var point = HelperMethods.getPoint(event, view.main.canvas);
    var size = parseInt($('#ball-size').val());
    var color= '#' + $('#ball-color').val();
    var ball = new Ball(point, size, {x: 0, y: 0}, color, view.main);
    view.main.objects.push(ball);
    view.main.draw(view.context);
  },

  ballPreview: function (view) {
    var ballPreview = document.getElementById("ball-preview");
    ballPreview.width = 150;
    ballPreview.height = 150;
    var context = ballPreview.getContext('2d');
    addBallPreview(ballPreview, view, context);
    $('#ball-size').on('propertychange input', function (e) {
      context.clearRect(0, 0, ballPreview.width, ballPreview.height);
      addBallPreview(ballPreview, view, context);
    });
    $('#hidden-ball-color').change(function (e) {
      context.clearRect(0, 0, ballPreview.width, ballPreview.height);
      addBallPreview(ballPreview, view, context);
    });
  },

  ballGeneratorPreview: function (view) {
    var generatorPreview = document.getElementById("ball-generator-preview");
    generatorPreview.width = 150;
    generatorPreview.height = 150;
    var context = generatorPreview.getContext('2d');
    addGeneratorPreview(generatorPreview, view, context);
    $('#ball-generator-angle').change(function(e) {
      context.clearRect(0, 0, generatorPreview.width, generatorPreview.height);
      addGeneratorPreview(generatorPreview, view, context);
    });
    $('#hidden-ball-generator-color').change(function(e) {
      context.clearRect(0, 0, generatorPreview.width, generatorPreview.height);
      addGeneratorPreview(generatorPreview, view, context);
    });
  },

  addBallGenerator: function (event, view) {
    var point = HelperMethods.getPoint(event, view.main.canvas);
    var angle = parseInt($('#ball-generator-angle').val());
    var radianAngle = angle * (Math.PI / 180);
    var velocity = parseInt($('#ball-generator-velocity').val());
    var frequency = parseInt($('#ball-generator-frequency').val());
    var color = $('#ball-generator-color').val();
    var ballGenerator = new BallGenerator(point, radianAngle, velocity, frequency, color, view.main);
    view.main.objects.push(ballGenerator);
    view.main.draw(view.context);
  },

  addPortal: function (event, view, portalType, id) {
    var isEntry = portalType === 'entry';
    var portalAngleId = isEntry ? '#first-portal-angle' : '#second-portal-angle';
    var portalWidthId = isEntry ? '#first-portal-width' : '#second-portal-width';
    var portalColor = isEntry ? "blue" : "orange";

    var point = HelperMethods.getPoint(event, view.main.canvas);
    var angle = parseInt($(portalAngleId).val());
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
    var x = event.offsetX;
    var y = event.offsetY;
    view.main.removeObject({x: x, y: y}, view.context);
  },

  play: function (view, activeBtn, activeText, inactiveText, active, callback) {
    if (!active) {
      HelperMethods.disableInactiveBtns(activeBtn);
      $('#remove-item-btn').prop("disabled", true);
      $('#main-canvas').off();
      $(activeBtn).text(activeText);
      $(activeBtn).toggleClass("active");
      if (callback) {
        $('#play-btn').prop("disabled", true);
        callback(view);
      } else {
        $('#demo-btn').prop("disabled", true);
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
      $(".play").prop("disabled", true);
      $(activeBtn).text(TextConstants[activeBtn].active);
    } else {
      HelperMethods.enableBtns();
      $(activeBtn).text(TextConstants[activeBtn].inactive);
    }
  },

  addCanvasClickListener: function (activeBtn, view, callback) {
    HelperMethods.disableInactiveBtns(activeBtn);
    $('#main-canvas').on("click", function (e) {
      callback(e, view, activeBtn);
    });
  },

  toggleCanvasDragListener: function (activeBtn, view) {
    HelperMethods.disableInactiveBtns(activeBtn);

    var initial = true;
    $('#main-canvas').on("mousedown", function (event) {
      point1 = HelperMethods.getPoint(event, view.main.canvas);

    }).on("mousemove", function (e) {
      point2 = HelperMethods.getPoint(e, view.main.canvas);
      drawnTrack = HelperMethods.drawTrack(e, view, point1, point2, initial);
      if (drawnTrack) { initial = false; }

    }).on("mouseup", function () {
      trackDrawn = HelperMethods.addTrack(view, drawnTrack);
      point1 = 0;
      point2 = 0;
    });
  },

  popLastTrack: function (view) {
    if (trackDrawn) {
      view.main.objects.pop();
      trackDrawn = false;
    }
  }
};

module.exports = ButtonActions;
