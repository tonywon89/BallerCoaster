var ButtonActions = require("./button_actions.js");
var createDemoObjects = require("./demo_objects.js");
var HelperMethods = require("./util/helper_methods.js");
var DetailConstants = require("./constants/detail_constants.js");

var resetDemo = function (view) {
  view.main.objects = [];
  view.main.draw(view.context);
  view.main.objects = createDemoObjects(view);
};

var populateDetail = function (actionBtn, view, trackDraw, callback) {
  $(DetailConstants[actionBtn]).fadeToggle();
  $('.menu').fadeToggle();
  ButtonListeners.closeListener(view);
  if (!trackDraw) {
    ButtonActions.ballPreview(view);
    ButtonActions.addCanvasClickListener(actionBtn, view, callback);
  } else {
    ButtonActions.toggleCanvasDragListener(actionBtn, view);
  }
};

var ButtonListeners = {
  addBallListener: function (view) {
    $('#place-ball-btn').click(function (event) {
      event.preventDefault();
      populateDetail('#place-ball-btn', view, false, ButtonActions.addBall);
    });
  },

  addTrackListener: function (view) {
    var active = false;
    $('#draw-tracks-btn').click(function (event) {
      event.preventDefault();
      populateDetail('#draw-tracks-btn', view, true);
    });
  },

  addPlayListener: function (view) {
    var active = false;
    var canvas = view.main.canvas;
    $('#play-btn').click(function(event) {
      event.preventDefault();
      ButtonActions.play(view, '#play-btn', "Stop", "Play", active);
      $('.menu-detail').fadeOut();
      $('.menu').fadeIn();
      ButtonActions.popLastTrack(view);
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
        ButtonActions.addBothPortals.bind(ButtonActions)
      );
      active = !active;
    });
  },

  demoListener: function (view) {
    var active = false;
    $('#demo-btn').click(function (event) {
      event.preventDefault();
      ButtonActions.play(view, '#demo-btn', "Stop Demo", "Demo", active, resetDemo);
      $('.menu-detail').fadeOut();
      $('.menu').fadeIn();
      ButtonActions.popLastTrack(view);
      active = !active;
    });
  },

  addRemoveItemListener: function (view) {
    var active = false;
    $('#remove-item-btn').click(function (event) {
      event.preventDefault();
      $('#main-canvas').off();
      $(this).toggleClass("active");
      $('.menu-detail').fadeOut();
      $('.menu').fadeIn();
      ButtonActions.toggleCanvasClickListener("#remove-item-btn", active, view, ButtonActions.removeObject);
      active = !active;
    });
  },

  clearListener: function (view) {
    $('#clear-btn').click(function (event) {
      event.preventDefault();
      view.main.objects = [];
      view.main.draw(view.context);
    });
  },

  closeListener: function (view) {
    $('.close-detail').click(function (event) {
      event.preventDefault();
      $('.menu-detail').fadeOut();
      $('.menu').fadeIn();
      ButtonActions.popLastTrack(view);
      HelperMethods.enableBtns();
    });
  }


};

module.exports = ButtonListeners;
