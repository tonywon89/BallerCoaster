var ButtonActions = require("./button_actions.js");
var createDemoObjects = require("./demo_objects.js");
var HelperMethods = require("./util/helper_methods.js");
var DetailConstants = require("./constants/detail_constants.js");

var resetDemo = function (view) {
  view.main.objects = [];
  view.main.draw(view.context);
  view.main.objects = createDemoObjects(view);
};

var ButtonListeners = {
  addBallListener: function (view) {
    $('#place-ball-btn').click(function (event) {
      event.preventDefault();
      ButtonActions.populateDetail('#place-ball-btn', view, false, ButtonActions.addBall, ButtonActions.ballPreview);
    });
  },

  addTrackListener: function (view) {
    var active = false;
    $('#draw-tracks-btn').click(function (event) {
      event.preventDefault();
      ButtonActions.populateDetail('#draw-tracks-btn', view, true);
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
    $('#ball-generator-btn').click(function (event) {
      event.preventDefault();
      ButtonActions.populateDetail('#ball-generator-btn', view, false, ButtonActions.addBallGenerator, ButtonActions.ballGeneratorPreview);
    });
  },

  addPortalListener: function (view) {
    $("#portal-btn").click(function (event) {
      event.preventDefault();
      ButtonActions.populateDetail('#portal-btn', view, false, ButtonActions.addEntryPortal.bind(ButtonActions), ButtonActions.portalPreview, true);

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
