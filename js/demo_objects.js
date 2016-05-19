var Track = require("./track.js");
var BallGenerator = require("./ball_generator.js");
var Portal = require("./portal.js");

var demoObjects = [];
var createDemoObjects = function (view) {
  var angle = 60;
  var radianAngle = angle * (Math.PI / 180);
  var velocity = 5;
  var frequency = 60;

  var ballGenerator = new BallGenerator({x: 100, y: 200}, radianAngle, velocity, frequency, view.main);
  demoObjects.push(ballGenerator);

  var entryPortal = new Portal(1000, true, false, {x: 250, y: 300}, 0, 50, "blue", view.main);
  demoObjects.push(entryPortal);
  var exitPortal = new Portal(1000, false, true, {x: 500, y: 100}, radianAngle, 50, "orange", view.main);
  demoObjects.push(exitPortal);

  var track = new Track({x: 800, y: 300}, {x: 500, y: 400}, view.main.gravity);
  demoObjects.push(track);
  track = new Track({x: 400, y: 400}, {x: 600, y: 500}, view.main.gravity);
  demoObjects.push(track);

  entryPortal = new Portal(1001, true, false, {x: 600, y: 550}, 0, 100, "blue", view.main);
  demoObjects.push(entryPortal);
  exitPortal = new Portal(1001, false, true, {x: 100, y: 500}, 120 * Math.PI / 180, 50, "orange", view.main);
  demoObjects.push(exitPortal);
  return demoObjects;
};

module.exports = createDemoObjects;
