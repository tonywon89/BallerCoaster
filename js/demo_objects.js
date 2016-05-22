var Track = require("./components/track.js");
var BallGenerator = require("./components/ball_generator.js");
var Portal = require("./components/portal.js");

var createDemoObjects = function (view) {
  var demoObjects = [];
  var angle = 60;
  var radianAngle = angle * (Math.PI / 180);
  var velocity = 5;
  var frequency = 60;
  var color = "AB1D0D";

  var ballGenerator = new BallGenerator({x: 100, y: 200}, radianAngle, velocity, frequency, color, 15, view.main);
  demoObjects.push(ballGenerator);

  angle = 120;
  radianAngle = angle * (Math.PI / 180);
  velocity = 8.7;
  frequency = 40;
  color = "5BAB6D";
  ballGenerator = new BallGenerator({x: 700, y: 200}, radianAngle, velocity, frequency, color, 10, view.main);
  demoObjects.push(ballGenerator);
  ballGenerator = new BallGenerator({x: 700, y: 250}, radianAngle, velocity, frequency, "534782",5, view.main);
  demoObjects.push(ballGenerator);

  var entryPortal = new Portal(1002, true, false, {x: 50, y: 350}, 0, 50, "blue", view.main);
  demoObjects.push(entryPortal);

  angle = 120;
  radianAngle = angle * (Math.PI / 180);
  var exitPortal = new Portal(1002, false, true, {x: 400, y: 300}, radianAngle, 50, "orange", view.main);
  demoObjects.push(exitPortal);

  var track = new Track({x: 300, y: 100}, {x: 100, y: 300}, view.main.gravity);
  demoObjects.push(track);
  //
  // entryPortal = new Portal(1000, true, false, {x: 300, y: 300}, 0, 50, "blue", view.main);
  // demoObjects.push(entryPortal);
  //
  // angle = 60;
  // radianAngle = angle * (Math.PI / 180);
  // exitPortal = new Portal(1000, false, true, {x: 500, y: 300}, radianAngle, 50, "orange", view.main);
  // demoObjects.push(exitPortal);

  var track = new Track({x: 800, y: 300}, {x: 500, y: 400}, view.main.gravity);
  demoObjects.push(track);
  track = new Track({x: 400, y: 400}, {x: 600, y: 500}, view.main.gravity);
  demoObjects.push(track);

  entryPortal = new Portal(1001, true, false, {x: 700, y: 550}, 0, 100, "blue", view.main);
  demoObjects.push(entryPortal);
  exitPortal = new Portal(1001, false, true, {x: 100, y: 500}, 120 * Math.PI / 180, 50, "orange", view.main);
  demoObjects.push(exitPortal);
  return demoObjects;
};

module.exports = createDemoObjects;
