var Main = require("./main.js");
var View = require("./view.js");
var ButtonListeners = require("./button_listeners.js");

$(function () {
  var canvasEl = document.getElementById("main-canvas");
  canvasEl.width = window.innerWidth * 0.65
  canvasEl.height = window.innerHeight * 0.85;
  var context = canvasEl.getContext('2d');

  var main = new Main(0.2, [], canvasEl.width, canvasEl.height);
  var view = new View(context, main);

  ButtonListeners.addBallListener(view, canvasEl);
  ButtonListeners.addPlayListener(view);
  ButtonListeners.addTrackListener(view, canvasEl);
  ButtonListeners.clearListener(main, context, canvasEl);
  ButtonListeners.addBallGeneratorListener(view, canvasEl, main);
  ButtonListeners.addMusicalLoopListener(view, canvasEl, main);
});
