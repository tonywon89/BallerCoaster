/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/js/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var Main = __webpack_require__(1);
	var View = __webpack_require__(2);
	var ButtonListeners = __webpack_require__(5);
	
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


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var Ball = __webpack_require__(3);
	var MusicalHoop = __webpack_require__(10);
	
	var Main = function (gravity, objects, canvasWidth, canvasHeight) {
	  this.gravity = gravity;
	  this.objects = objects;
	  this.canvasWidth = canvasWidth;
	  this.canvasHeight = canvasHeight;
	};
	
	Main.prototype.step = function () {
	  this.checkCollisions();
	  this.objects.forEach(function(object) {
	    object.step();
	  }.bind(this));
	};
	
	Main.prototype.draw = function (context) {
	  context.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
	  this.objects.forEach(function(object) {
	    object.draw(context);
	  }.bind(this));
	};
	
	Main.prototype.checkCollisions = function () {
	  var main = this;
	  this.objects.forEach(function(obj1) {
	    // debugger;
	    if (!(obj1 instanceof Ball) && !(obj1 instanceof MusicalHoop)) return
	    main.objects.some(function(obj2) {
	
	      if (obj1.isCollideWith(obj2)) {
	        obj1.collideWith(obj2);
	        return true;
	      }
	      return false;
	    });
	  })
	};
	
	module.exports = Main;


/***/ },
/* 2 */
/***/ function(module, exports) {

	var View = function (context, main) {
	  this.context = context;
	  this.main = main;
	};
	
	// View.prototype.draw = function () {
	//   this.context.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
	//   this.objects.forEach(function(object) {
	//     object.draw(this.context, this);
	//   }.bind(this));
	// };
	
	var requestAnimationFrame =
	    window.requestAnimationFrame ||
	    window.webkitRequestAnimationFrame ||
	    window.mozRequestAnimationFrame ||
	    window.msRequestAnimationFrame ||
	    window.oRequestAnimationFrame ||
	    function(callback) {
	      return setTimeout(callback, 1);
	    };
	var cancelAnimationFrame =
	    window.cancelAnimationFrame ||
	    window.webkitCancelAnimationFrame ||
	    window.mozCancelAnimationFrame ||
	    window.msCancelAnimationFrame ||
	    window.oCancelAnimationFrame ||
	    function(callback) {
	      return setTimeout(callback, 1);
	    };
	
	var requestId;
	View.prototype.animate = function () {
	    this.main.step();
	    this.main.draw(this.context);
	    requestId = requestAnimationFrame(this.animate.bind(this));
	};
	
	View.prototype.start = function () {
	  if (!requestId) {
	    this.animate();
	  }
	}
	
	View.prototype.stop = function () {
	  if (requestId) {
	    cancelAnimationFrame(requestId);
	    requestId = undefined;
	  }
	}
	
	
	View.prototype.step = function () {
	  this.objects.forEach(function(object) {
	    object.step();
	  });
	};
	
	module.exports = View;


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	var Track = __webpack_require__(6);
	
	var Ball = function (pos, radius, velocity, main) {
	  this.pos = pos;
	  this.radius = radius;
	  this.velocity = velocity
	  this.acceleration = {x: 0, y: main.gravity};
	  this.main = main;
	  this.isCollided = false;
	};
	
	Ball.prototype.draw = function (context) {
	  context.beginPath();
	  context.arc(this.pos.x, this.pos.y, this.radius, 0, Math.PI * 2);
	  context.stroke();
	};
	
	Ball.prototype.step = function () {
	  this.velocity.y += this.acceleration.y;
	  this.velocity.x += this.acceleration.x;
	  this.pos.y += this.velocity.y;
	  this.pos.x += this.velocity.x;
	  if (this.pos.y > this.main.canvasHeight || this.pos.x > this.main.canvasWidth) {
	    var idx = this.main.objects.indexOf(this);
	    this.main.objects.splice(idx, 1);
	  }
	};
	
	Ball.prototype.isCollideWith = function (otherObject) {
	  if (otherObject instanceof Track) {
	    var A = { x: otherObject.point1.x, y: otherObject.point1.y };
	    var B = { x: otherObject.point2.x, y: otherObject.point2.y };
	    var C = { x: this.pos.x, y: this.pos.y }
	    var LAB = Math.sqrt(Math.pow((B.x - A.x), 2) + Math.pow((B.y - A.y), 2));
	
	    var Dx = (B.x - A.x) / LAB;
	    var Dy = (B.y - A.y) / LAB;
	
	    var t = Dx * (C.x - A.x) + Dy * (C.y - A.y);
	
	    var Ex = t * Dx + A.x;
	    var Ey = t * Dy + A.y;
	
	    var LEC = Math.sqrt(Math.pow((Ex - C.x), 2) + Math.pow((Ey - C.y), 2))
	
	    var largerX = B.x > A.x ? B.x : A.x
	    var smallerX = B.x >= A.x ? A.x : B.x
	
	    var largerY = B.y > A.y ? B.y : A.y
	    var smallerY = B.y >= A.y ? A.y : B.y
	
	    if (LEC <= this.radius && (this.pos.x <= largerX && this.pos.x >= smallerX) && (this.pos.y <= largerY && this.pos.y >= smallerY)) {
	      this.collidedObject = otherObject;
	      return true
	    } else {
	
	      if (this.collidedObject === otherObject) {
	        this.collidedObject = undefined;
	        this.isCollided = false;
	        this.acceleration = { x: 0, y: this.main.gravity }
	        return false;
	      } else {
	        this.acceleration = { x: 0, y: this.main.gravity }
	        return false;
	      }
	
	    }
	  } else {
	    return false;
	  }
	};
	
	Ball.prototype.collideWith = function (otherObject) {
	  if (otherObject instanceof Track) {
	    if (!this.isCollided) {
	        this.isCollided = true;
	        this.velocity.x = 0;
	        this.velocity.y = 0;
	        this.acceleration = {x: otherObject.xAccel, y: otherObject.yAccel};
	      } else {
	        this.acceleration = {x: otherObject.xAccel, y: otherObject.yAccel};
	      }
	  }
	};
	
	
	
	module.exports = Ball;


/***/ },
/* 4 */,
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	var Ball = __webpack_require__(3);
	var Track = __webpack_require__(6);
	var BallGenerator = __webpack_require__(7);
	var Note = __webpack_require__(8);
	var TONES = __webpack_require__(9);
	var MusicalHoop = __webpack_require__(10);
	
	var ButtonListeners = {
	  addBallListener: function (view, canvas) {
	    var isPlacingBall = false;
	    $('#place-ball-btn').click(function (event) {
	      event.preventDefault();
	      $('.menu-btn').prop("disabled", true);
	      $(this).prop("disabled", false);
	      if (!isPlacingBall) {
	        $('#main-canvas').on("click", function (event) {
	          var x = event.pageX - canvas.offsetLeft;
	          var y = event.pageY - canvas.offsetTop;
	
	          var ball = new Ball({x: x, y: y}, 5, {x: 0, y: 0}, view.main);
	          view.main.objects.push(ball);
	          view.main.draw(view.context);
	        });
	
	        $(this).text("Stop Placing Balls");
	        isPlacingBall = true;
	      } else {
	        $('.menu-btn').prop("disabled", false);
	        $('#main-canvas').off("click");
	        isPlacingBall = false;
	        $(this).text("Place Balls");
	      }
	    });
	  },
	
	  addTrackListener: function (view, canvas) {
	    var isDrawingTracks = false;
	    var point1, point2, track;
	
	    $('#draw-tracks-btn').click(function (event) {
	      event.preventDefault();
	      $('.menu-btn').prop("disabled", true);
	      $('#draw-tracks-btn').prop("disabled", false);
	      if (!isDrawingTracks) {
	        $('#main-canvas').on("mousedown", function (event) {
	          var x = event.pageX - canvas.offsetLeft;
	          var y = event.pageY - canvas.offsetTop;
	
	          point1 = {x: x, y: y};
	
	        }).on("mousemove", function (event) {
	          var x = event.pageX - canvas.offsetLeft;
	          var y = event.pageY - canvas.offsetTop;
	          point2 = {x: x, y: y};
	
	          if (point1) {
	            track = new Track(point1, point2, view.main.gravity);
	
	            if (view.main.objects[view.main.objects.length - 1] instanceof Track) {
	              view.main.objects.pop();
	              view.main.objects.push(track);
	              view.main.draw(view.context);
	            } else {
	              view.main.objects.push(track);
	              view.main.draw(view.context);
	            }
	          }
	        }).on("mouseup", function (event) {
	          // Will make sure the next drawing will pop the copy of it
	          if (track) {
	            view.main.objects.push(track);
	          }
	
	          point1 = 0;
	          point2 = 0;
	        });
	        $(this).text("Stop Drawing Tracks");
	        isDrawingTracks = true;
	      } else {
	        $('.menu-btn').prop("disabled", false);
	        $('#main-canvas').off();
	        isDrawingTracks = false;
	        $(this).text("Draw Tracks")
	      }
	    });
	  },
	
	  addPlayListener: function (view) {
	    var isPlaying = false;
	    $('#play-btn').click(function(event) {
	      event.preventDefault();
	      if (!isPlaying) {
	        $('.menu-btn').prop("disabled", true);
	        $(this).prop("disabled", false);
	        isPlaying = true;
	        $(this).text("Stop");
	        view.start();
	      } else {
	        $('.menu-btn').prop("disabled", false);
	        isPlaying = false;
	        $(this).text("Play");
	        view.stop();
	      }
	    });
	  },
	
	  addBallGeneratorListener: function (view, canvas, main) {
	    var isBallGenerating = false;
	    $('#ball-generator-btn').click(function (event) {
	      event.preventDefault();
	      if (!isBallGenerating) {
	        $('.menu-btn').prop("disabled", true);
	        $(this).prop("disabled", false);
	        isBallGenerating = true;
	        $(this).text("Stop Making Ball Generators");
	        $('#main-canvas').on("click", function (event) {
	          var x = event.pageX - canvas.offsetLeft;
	          var y = event.pageY - canvas.offsetTop;
	
	          var angle = $('#ball-generator-angle').val();
	          var radianAngle = angle * (Math.PI / 180);
	
	          var velocity = $('#ball-generator-velocity').val();
	
	          var frequency = $('#ball-generator-frequency').val();
	
	          var ballGenerator = new BallGenerator({x: x, y: y}, radianAngle, velocity, frequency, main);
	          view.main.objects.push(ballGenerator);
	          view.main.draw(view.context);
	        });
	
	      } else {
	        $('#main-canvas').off();
	        $('.menu-btn').prop("disabled", false);
	        isBallGenerating = false;
	
	        $(this).text("Construct Ball Generators");
	      }
	    })
	  },
	
	  addMusicalLoopListener: function (view, canvas, main) {
	    var isAddingMusicalHoop = false;
	
	    $('#add-musical-hoop-btn').click(function (event) {
	      if (!isAddingMusicalHoop) {
	        isAddingMusicalHoop = true;
	        $('.menu-btn').prop("disabled", true);
	        $(this).prop("disabled", false);
	        $(this).text("Stop Adding Musical Hoops");
	        $('#main-canvas').on("click", function (event) {
	          var noteLetter = $('#note-selected').val();
	          var noteFreq = TONES[noteLetter];
	          var note = new Note(noteFreq);
	
	          var x = event.pageX - canvas.offsetLeft;
	          var y = event.pageY - canvas.offsetTop;
	
	          var musicalHoop = new MusicalHoop({x: x, y: y}, note, main);
	          main.objects.push(musicalHoop);
	          musicalHoop.draw(view.context);
	        });
	      } else {
	        $('#main-canvas').off();
	        $('.menu-btn').prop("disabled", false);
	        isAddingMusicalHoop = false;
	
	        $(this).text("Add Musical Hoops");
	      }
	    });
	
	  },
	
	  clearListener: function (main, context, canvas) {
	    $('#clear-btn').click(function (event) {
	      event.preventDefault();
	      main.objects = [];
	      main.draw(context);
	    })
	  }
	}
	
	module.exports = ButtonListeners;


/***/ },
/* 6 */
/***/ function(module, exports) {

	var Track = function (point1, point2, gravity) {
	    this.point1 = point1;
	    this.point2 = point2;
	    this.theta = Math.atan2(point2.y - point1.y, point2.x - point1.x);
	    this.slopeGravity = gravity * Math.sin(this.theta);
	    this.xAccel = this.slopeGravity * Math.cos(this.theta);
	    this.yAccel = this.slopeGravity * Math.sin(this.theta);
	
	};
	
	Track.prototype.draw = function (context) {
	  context.beginPath();
	  context.moveTo(this.point1.x, this.point1.y);
	  context.lineTo(this.point2.x, this.point2.y);
	  context.stroke();
	};
	
	Track.prototype.step = function () {
	
	};
	
	Track.prototype.containPoint =  function (point) {
	  return Math.round(this.distance(this.point1, point) + this.distance(this.point2, point)) === Math.round(this.distance(this.point1, this.point2));
	};
	
	Track.prototype.distance = function (point1, point2) {
	  return Math.sqrt(Math.pow(point1.x - point2.x, 2) + Math.pow(point1.y - point2.y, 2));
	};
	
	Track.prototype.isCollideWith = function (otherObject) {
	
	};
	
	Track.prototype.collideWith = function (otherObject) {
	
	};
	
	module.exports = Track;


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	var Ball = __webpack_require__(3);
	
	var BallGenerator = function (pos, angle, ballVelocity, frequency, main) {
	  this.pos = pos;
	  this.angle = -angle;
	  this.ballVelocity = ballVelocity;
	  this.frequency = frequency;
	  this.width = 40;
	  this.height = 15;
	  this.radius = 5;
	  this.main = main;
	  this.time = 100000000000000000000000;
	
	  var secondX = this.pos.x + this.width * Math.cos(this.angle);
	  var secondY = this.pos.y + this.width * Math.sin(this.angle);
	
	  var angle = (this.angle + Math.PI / 2) - Math.atan(this.radius/(this.height / 2));
	  var z = Math.sqrt(Math.pow(this.radius, 2) + Math.pow((this.height / 2), 2));
	  var posX = secondX + z * Math.cos(angle);
	  var posY = secondY + z * Math.sin(angle);
	
	  var velX = this.ballVelocity * Math.cos(this.angle);
	  var velY = this.ballVelocity * Math.sin(this.angle);
	
	  var ball = this.generateBall();
	
	  this.ball = ball;
	};
	
	BallGenerator.prototype.draw = function (context) {
	
	  context.beginPath();
	  context.moveTo(this.pos.x, this.pos.y);
	  var secondX = this.pos.x + this.width * Math.cos(this.angle);
	  var secondY = this.pos.y + this.width * Math.sin(this.angle);
	  context.lineTo(secondX, secondY);
	  var thirdX = secondX + this.height * Math.cos(this.angle + Math.PI / 2);
	  var thirdY = secondY + this.height * Math.sin(this.angle + Math.PI / 2);
	  context.lineTo(thirdX, thirdY);
	  var fourthX = thirdX + this.width * Math.cos(this.angle + Math.PI);
	  var fourthY = thirdY + this.width * Math.sin(this.angle + Math.PI);
	  context.lineTo(fourthX, fourthY);
	  context.closePath();
	  context.stroke();
	
	  this.ball.draw(context);
	}
	
	BallGenerator.prototype.generateBall = function () {
	  var secondX = this.pos.x + this.width * Math.cos(this.angle);
	  var secondY = this.pos.y + this.width * Math.sin(this.angle);
	
	  var angle = (this.angle + Math.PI / 2) - Math.atan(this.radius/(this.height / 2));
	  var z = Math.sqrt(Math.pow(this.radius, 2) + Math.pow((this.height / 2), 2));
	  var posX = secondX + z * Math.cos(angle);
	  var posY = secondY + z * Math.sin(angle);
	
	  var velX = this.ballVelocity * Math.cos(this.angle);
	  var velY = this.ballVelocity * Math.sin(this.angle);
	
	  return new Ball({x: posX, y: posY}, this.radius, {x: velX, y: velY}, this.main);
	};
	
	BallGenerator.prototype.fire = function () {
	  this.main.objects.push(this.ball);
	};
	
	BallGenerator.prototype.step = function () {
	  this.time += this.frequency;
	  if (this.time >= 100000000000000000000000) {
	    this.fire();
	    this.ball = this.generateBall();
	    this.time = 0;
	  }
	
	},
	
	module.exports = BallGenerator;


/***/ },
/* 8 */
/***/ function(module, exports) {

	var ctx = new (window.AudioContext || window.webkitAudioContext)();
	
	var createOscillator = function (freq) {
	  var osc = ctx.createOscillator();
	  osc.type = "sine";
	  osc.frequency.value = freq;
	  osc.detune.value = 0;
	  osc.start(ctx.currentTime);
	  return osc;
	};
	
	var createGainNode = function () {
	  var gainNode = ctx.createGain();
	  gainNode.gain.value = 0;
	  gainNode.connect(ctx.destination);
	  return gainNode;
	};
	
	var Note = function (freq) {
	  this.oscillatorNode = createOscillator(freq);
	  this.gainNode = createGainNode();
	  this.oscillatorNode.connect(this.gainNode);
	};
	
	Note.prototype = {
	  start: function () {
	    // can't explain 0.3, it is a reasonable value
	    this.gainNode.gain.value = 0.3;
	  },
	
	  stop: function () {
	    this.gainNode.gain.value = 0;
	  }
	};
	
	module.exports = Note;


/***/ },
/* 9 */
/***/ function(module, exports) {

	var TONES = {
	  C: 523.25,
	  D: 587.33,
	  E: 659.25,
	  F: 698.46,
	  G: 783.99,
	  A: 880.00,
	  B: 987.77
	};
	
	module.exports = TONES;


/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	var Note = __webpack_require__(8);
	var Ball = __webpack_require__(3);
	
	var MusicalHoop = function (point1, note, main) {
	  this.point1 = point1;
	  this.point2 = {x: point1.x + 100, y: point1.y};
	  // this.angle = angle;
	  // this.width = width;
	  this.width = 100;
	  this.note = note;
	  this.main = main;
	  this.isCollided = false;
	};
	
	MusicalHoop.prototype.draw = function (context) {
	  context.beginPath();
	  context.moveTo(this.point1.x, this.point1.y);
	  context.lineTo(this.point2.x, this.point2.y);
	  context.strokeStyle = "red";
	  context.stroke();
	  context.strokeStyle = "black";
	};
	
	MusicalHoop.prototype.step = function () {
	  if (this.isCollided) {
	    this.note.start();
	  }
	};
	
	MusicalHoop.prototype.isCollideWith = function (otherObject) {
	  if (otherObject instanceof Ball) {
	    var A = { x: this.point1.x, y: this.point1.y };
	    var B = { x: this.point2.x, y: this.point2.y };
	    var C = { x: otherObject.pos.x, y: otherObject.pos.y }
	    var LAB = Math.sqrt(Math.pow((B.x - A.x), 2) + Math.pow((B.y - A.y), 2));
	
	    var Dx = (B.x - A.x) / LAB;
	    var Dy = (B.y - A.y) / LAB;
	
	    var t = Dx * (C.x - A.x) + Dy * (C.y - A.y);
	
	    var Ex = t * Dx + A.x;
	    var Ey = t * Dy + A.y;
	
	    var LEC = Math.sqrt(Math.pow((Ex - C.x), 2) + Math.pow((Ey - C.y), 2))
	
	    var largerX = B.x > A.x ? B.x : A.x
	    var smallerX = B.x >= A.x ? A.x : B.x
	
	    var largerY = B.y > A.y ? B.y : A.y
	    var smallerY = B.y >= A.y ? A.y : B.y
	    // var LEC = this.point1.y - otherObject.pos.y;
	
	    if (LEC <= otherObject.radius){
	      this.ball = otherObject;
	      this.isCollided = true;
	      return true
	
	    } else {
	      if (this.ball === otherObject) {
	        this.note.stop();
	        this.ball === undefined;
	        this.isCollided = false
	      }
	      return false;
	    }
	  } else {
	    return false;
	  }
	};
	
	MusicalHoop.prototype.collideWith = function (otherObject) {
	  this.isCollided = true;
	};
	
	MusicalHoop.collideWith
	
	module.exports = MusicalHoop;


/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map