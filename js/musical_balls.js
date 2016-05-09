var Main = require("./main.js");
var View = require("./view.js");
var Ball = require("./ball.js");
var ButtonListeners = require("./button_listeners.js");

$(function () {
  var main = new Main(5);

  var canvasEl = document.getElementById("main-canvas");
  canvasEl.width = window.innerWidth * 0.65
  canvasEl.height = window.innerHeight * 0.85;
  var context = canvasEl.getContext('2d');
  var view = new View(context, [], canvasEl.width, canvasEl.height);

  ButtonListeners.addBallListener(view, canvasEl);
  ButtonListeners.addPlayListener(view);


});
