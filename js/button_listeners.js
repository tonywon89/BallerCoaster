var ButtonActions = require("./button_actions.js");
var createDemoObjects = require("./demo_objects.js");

var resetDemo = function (view) {
  view.main.objects = [];
  view.main.draw(view.context);

  view.main.objects = createDemoObjects(view);
};

var ButtonListeners = {
  addBallListener: function (view) {
    var active = false;
    $('#place-ball-btn').click(function (event) {
      event.preventDefault();
      ButtonActions.toggleCanvasClickListener('#place-ball-btn', active, view, ButtonActions.addBall);
      active = !active;
    });
  },

  addTrackListener: function (view) {
    var active = false;
    $('#draw-tracks-btn').click(function (event) {
      event.preventDefault();
      ButtonActions.toggleCanvasDragListener('#draw-tracks-btn', active, view);
      active = !active;
    });
  },

  addPlayListener: function (view) {
    var active = false;
    var canvas = view.main.canvas;
    $('#play-btn').click(function(event) {
      event.preventDefault();
      ButtonActions.play(view, '#play-btn', "Stop", "Play", active);
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
      active = !active;
    });
  },

  addRemoveItemListener: function (view) {
    var active = false;
    $('#remove-item-btn').click(function (event) {
      event.preventDefault();
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
  }
};

module.exports = ButtonListeners;
