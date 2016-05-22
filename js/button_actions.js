var Ball = require("./components/ball.js");
var Track = require("./components/track.js");
var BallGenerator = require("./components/ball_generator.js");
var Portal = require("./components/portal.js");
var TextConstants = require("./constants/text_constants.js");
var HelperMethods = require("./util/helper_methods.js");
var DetailConstants = require("./constants/detail_constants.js");

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
  var ballGenerator = new BallGenerator(point, radianAngle, velocity, frequency, color, size, view.main);
  ballGenerator.draw(context);
};

var addPortalPreview = function (portalPreview, view, context, isEntry) {
  var x = portalPreview.width/2;
  var y = portalPreview.height/2;
  var point = {x: x, y: y};
  var portalAngleId = isEntry ? '#first-portal-angle' : '#second-portal-angle';
  var portalWidthId = isEntry ? '#first-portal-width' : '#second-portal-width';
  var portalColor = isEntry ? "blue" : "orange";

  var angle = parseInt($(portalAngleId).val());
  var radianAngle = angle * (Math.PI / 180);
  var width = parseInt($(portalWidthId).val());

  var portal = new Portal(2000, isEntry, !isEntry, point, radianAngle, width, portalColor, view.main);
  portal.draw(context);
};

var ButtonActions = {
  populateDetail: function (actionBtn, view, trackDraw, callback, detailCallback, isEntry) {
    $(DetailConstants[actionBtn]).fadeIn();
    $('.menu').fadeOut();
    this.closeListener(view);
    if (!trackDraw) {
      if (detailCallback) {

        detailCallback(view, isEntry);
      }
      this.addCanvasClickListener(actionBtn, view, callback);
    } else {
      this.toggleCanvasDragListener(actionBtn, view);
    }
  },

  closeListener: function (view) {
    $('.close-detail').click(function (event) {
      event.preventDefault();
      $('.menu-detail').fadeOut();
      $('.menu').fadeIn();
      ButtonActions.popLastTrack(view);
      HelperMethods.enableBtns();
    });
  },

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
    generatorPreview.width = 100;
    generatorPreview.height = 100;
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
    $('#ball-generator-size').change(function(e) {
      context.clearRect(0, 0, generatorPreview.width, generatorPreview.height);
      addGeneratorPreview(generatorPreview, view, context);
    });
  },

  portalPreview: function (view, isEntry) {
    var portalPreview = isEntry ? document.getElementById("entry-portal-preview") : document.getElementById("exit-portal-preview");
    var portalAngle = isEntry ? "#first-portal-angle" : '#second-portal-angle';
    var portalWidth = isEntry ? "#first-portal-width" : '#second-portal-width';
    portalPreview.width = 150;
    portalPreview.height = 150;
    var context = portalPreview.getContext('2d');
    addPortalPreview(portalPreview, view, context, isEntry);
    $(portalAngle).change(function (e) {
      context.clearRect(0, 0, portalPreview.width, portalPreview.height);
      addPortalPreview(portalPreview, view, context, isEntry);
    });
    $(portalWidth).change(function (e) {
      context.clearRect(0, 0, portalPreview.width, portalPreview.height);
      addPortalPreview(portalPreview, view, context, isEntry);
    });
  },

  addBallGenerator: function (event, view) {
    var point = HelperMethods.getPoint(event, view.main.canvas);
    var angle = parseInt($('#ball-generator-angle').val());
    var radianAngle = angle * (Math.PI / 180);
    var velocity = parseInt($('#ball-generator-velocity').val());
    var frequency = parseInt($('#ball-generator-frequency').val());
    var color = $('#ball-generator-color').val();
    var size = parseInt($('#ball-generator-size').val());
    var ballGenerator = new BallGenerator(point, radianAngle, velocity, frequency, color, size, view.main);
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

  addEntryPortal: function (event, view) {
    this.addPortal(event, view, 'entry', portalId);
    $('#entry-portal-detail').fadeOut();
    $('#main-canvas').off();
    this.populateDetail('#exit-portal-btn', view, false, this.addExitPortal.bind(this), this.portalPreview, false);
    $('button').prop("disabled", true);
  },

  addExitPortal: function (event, view) {
    this.addPortal(event, view, 'exit', portalId);
    portalId += 1;
    $('#main-canvas').off();
    $('#exit-portal-detail').fadeOut();
    this.populateDetail('#portal-btn', view, false, this.addEntryPortal.bind(this), this.portalPreview, true);
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
      $('#clear-btn').prop("disabled", true);
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
      $('#play-text').text("Click around to create falling circles!");
      $('#main-canvas').on("click", function (e) {
        this.addBall(e, view);
      }.bind(this));
    } else {
      HelperMethods.enableBtns();
      $(activeBtn).text(inactiveText);
      $(activeBtn).toggleClass("active");
      $('#play-text').text("");
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
