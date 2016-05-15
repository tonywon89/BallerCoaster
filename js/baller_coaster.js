var Main = require("./main.js");
var View = require("./view.js");
var ButtonListeners = require("./button_listeners.js");
var Ball = require("./ball.js");
var Track = require("./track.js");
var BallGenerator = require("./ball_generator.js");
var Portal = require("./portal.js");

$(function () {
  var canvasEl = document.getElementById("main-canvas");
  canvasEl.width = 850;
  canvasEl.height = 570;
  var context = canvasEl.getContext('2d');

  var main = new Main(0.2, [], canvasEl.width, canvasEl.height);
  var view = new View(context, main);

  ButtonListeners.addBallListener(view, canvasEl);
  ButtonListeners.addPlayListener(view, canvasEl);
  ButtonListeners.addTrackListener(view, canvasEl);
  ButtonListeners.clearListener(main, context, canvasEl);
  ButtonListeners.addBallGeneratorListener(view, canvasEl, main);
  ButtonListeners.addPortalGenerator(view, canvasEl, main);
  ButtonListeners.addRemoveItemListener(view, canvasEl, main);
  ButtonListeners.demoListener(view, canvasEl, main);
});