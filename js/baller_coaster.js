var Main = require("./main.js");
var View = require("./view.js");
var ButtonListeners = require("./button_listeners.js");

$(function () {
  var canvasEl = document.getElementById("main-canvas");
  canvasEl.width = 850;
  canvasEl.height = 570;
  var context = canvasEl.getContext('2d');

  var main = new Main(0.2, [], canvasEl);
  var view = new View(context, main);

  ButtonListeners.addBallListener(view);
  ButtonListeners.addTrackListener(view);
  ButtonListeners.addBallGeneratorListener(view);
  ButtonListeners.addPortalListener(view);
  ButtonListeners.addPlayListener(view);
  ButtonListeners.demoListener(view);
  ButtonListeners.addRemoveItemListener(view);
  ButtonListeners.clearListener(view);
  ButtonListeners.closeListener();

});
