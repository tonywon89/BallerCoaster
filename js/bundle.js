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
	
	});


/***/ },
/* 1 */
/***/ function(module, exports) {

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
	    main.objects.forEach(function(obj2) {
	      if (obj1 === obj2) return;
	
	      if (obj1.isCollideWith(obj2)) {
	        obj1.collideWith(obj2);
	      }
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
	
	
	
	    // var theta = otherObject.theta;
	    // var Cx = A.x - C.x;
	    // var Cy = A.y - C.y;
	    // var gamma = Math.atan(Cx, Cy);
	    // var beta = gamma - theta;
	    // var BC = Math.sin(beta) * Math.abs(otherObject.distance(C, A));
	
	    // console.log(BC);
	    var largerX = B.x > A.x ? B.x : A.x
	    var smallerX = B.x >= A.x ? A.x : B.x
	
	    if (LEC <= this.radius && (this.pos.x <= largerX && this.pos.x >= smallerX)) {
	      // this.collidedTrack = otherObject;
	      return true
	    } else {
	      this.isCollided = false
	      this.acceleration = { x: 0, y: this.main.gravity }
	      return false;
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
	
	var closeOtherButtons = function (element) {
	
	};
	
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


/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map