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
	var View = __webpack_require__(6);
	var ButtonListeners = __webpack_require__(7);
	var Ball = __webpack_require__(2);
	var Track = __webpack_require__(3);
	var BallGenerator = __webpack_require__(8);
	var Portal = __webpack_require__(5);
	
	$(function () {
	  var canvasEl = document.getElementById("main-canvas");
	  canvasEl.width = 850;
	  canvasEl.height = 570;
	  var context = canvasEl.getContext('2d');
	
	  var main = new Main(0.2, [], canvasEl);
	  var view = new View(context, main);
	
	  ButtonListeners.addBallListener(view);
	  ButtonListeners.addTrackListener(view);
	  ButtonListeners.addBallGeneratorListener(view, canvasEl, main);
	  ButtonListeners.addPortalListener(view, canvasEl, main);
	  ButtonListeners.addPlayListener(view);
	  ButtonListeners.demoListener(view, canvasEl, main);
	  ButtonListeners.addRemoveItemListener(view, canvasEl);
	  ButtonListeners.clearListener(view);
	});


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var Ball = __webpack_require__(2);
	var Portal = __webpack_require__(5);
	
	var Main = function (gravity, objects, canvas) {
	  this.gravity = gravity;
	  this.objects = objects;
	  this.canvas = canvas;
	};
	
	Main.prototype.step = function () {
	  this.checkCollisions();
	  this.objects.forEach(function(object) {
	    object.step();
	  });
	};
	
	Main.prototype.draw = function (context) {
	  context.clearRect(0, 0, this.canvas.width, this.canvas.height);
	  this.objects.forEach(function(object) {
	    object.draw(context);
	  });
	};
	
	Main.prototype.checkCollisions = function () {
	  var main = this;
	  this.objects.forEach(function(obj1) {
	    if (!(obj1 instanceof Ball) && !(obj1 instanceof Portal)) return;
	    main.objects.some(function(obj2) {
	      if (obj1.isCollideWith(obj2)) {
	        obj1.collideWith(obj2);
	        return true;
	      }
	      return false;
	    });
	  });
	};
	
	Main.prototype.removeObject = function (pos, context) {
	  for (var i = 0; i < this.objects.length; i++) {
	    if (this.objects[i].containPoint(pos)) {
	      if (this.objects[i] instanceof Portal) {
	        var idx = this.objects.indexOf(this.objects[i].findPair());
	        idx < i ? this.objects.splice(idx, 2) : this.objects.splice(i, 2);
	        this.draw(context);
	      } else {
	        this.objects.splice(i, 1);
	        this.draw(context);
	        return;
	      }
	    }
	  }
	};
	
	module.exports = Main;


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var Track = __webpack_require__(3);
	var Utils = __webpack_require__(4);
	
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
	  if (this.pos.y > this.main.canvas.height || this.pos.x > this.main.canvas.width) {
	    var idx = this.main.objects.indexOf(this);
	    this.main.objects.splice(idx, 1);
	  }
	};
	
	Ball.prototype.isCollideWith = function (otherObject) {
	  if (otherObject instanceof Track) {
	    var A = { x: otherObject.point1.x, y: otherObject.point1.y };
	    var B = { x: otherObject.point2.x, y: otherObject.point2.y };
	    var C = { x: this.pos.x, y: this.pos.y };
	    var LAB = Math.sqrt(Math.pow((B.x - A.x), 2) + Math.pow((B.y - A.y), 2));
	
	    var Dx = (B.x - A.x) / LAB;
	    var Dy = (B.y - A.y) / LAB;
	
	    var t = Dx * (C.x - A.x) + Dy * (C.y - A.y);
	
	    var Ex = t * Dx + A.x;
	    var Ey = t * Dy + A.y;
	
	    var LEC = Math.sqrt(Math.pow((Ex - C.x), 2) + Math.pow((Ey - C.y), 2));
	
	    var largerX = B.x > A.x ? B.x : A.x;
	    var smallerX = B.x >= A.x ? A.x : B.x;
	
	    var largerY = B.y > A.y ? B.y : A.y;
	    var smallerY = B.y >= A.y ? A.y : B.y;
	
	    if (LEC <= 1.3 * this.radius && (this.pos.x <= largerX && this.pos.x >= smallerX) && (this.pos.y <= largerY && this.pos.y >= smallerY)) {
	      this.collidedObject = otherObject;
	      return true;
	    } else {
	
	      if (this.collidedObject === otherObject) {
	        this.collidedObject = undefined;
	        this.isCollided = false;
	        this.acceleration = { x: 0, y: this.main.gravity };
	        return false;
	      } else {
	        this.acceleration = { x: 0, y: this.main.gravity };
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
	
	Ball.prototype.containPoint = function (pos) {
	  var bounds = Utils.circleBounds(this);
	  if (pos.x >= bounds.left && pos.x <= bounds.right && pos.y >= bounds.top && pos.y <= bounds.bottom) {
	    return true;
	  } else {
	    return false;
	  }
	};
	
	module.exports = Ball;


/***/ },
/* 3 */
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
	  return Math.floor(this.distance(this.point1, point) + this.distance(this.point2, point)) === Math.floor(this.distance(this.point1, this.point2));
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
/* 4 */
/***/ function(module, exports) {

	var Utils = {
	  circleBounds: function (object) {
	    var left, right, top, bottom;
	
	    left = object.pos.x - object.radius;
	    right = object.pos.x + object.radius;
	    top = object.pos.y - object.radius;
	    bottom = object.pos.y + object.radius;
	
	    return {left: left, right: right, top: top, bottom: bottom };
	  },
	
	  rectBounds: function (object) {
	    var left, right, top, bottom;
	
	    var firstX = object.pos.x;
	    var firstY = object.pos.y;
	
	    var secondX = object.pos.x + object.width * Math.cos(object.angle);
	    var secondY = object.pos.y + object.width * Math.sin(object.angle);
	
	    var thirdX = secondX + object.height * Math.cos(object.angle + Math.PI / 2);
	    var thirdY = secondY + object.height * Math.sin(object.angle + Math.PI / 2);
	
	    var fourthX = thirdX + object.width * Math.cos(object.angle + Math.PI);
	    var fourthY = thirdY + object.width * Math.sin(object.angle + Math.PI);
	
	    var xPositions = [firstX, secondX, thirdX, fourthX];
	    var yPositions = [firstY, secondY, thirdY, fourthY];
	    left = Math.min(...xPositions);
	    right = Math.max(...xPositions);
	    top = Math.min(...yPositions);
	    bottom = Math.max(...yPositions);
	
	    return {left: left, right: right, top: top, bottom: bottom };
	  },
	
	  containRect: function (object, pos) {
	    var bounds = this.rectBounds(object);
	    if (pos.x >= bounds.left && pos.x <= bounds.right && pos.y >= bounds.top && pos.y <= bounds.bottom) {
	      return true
	    } else {
	      return false;
	    }
	  },
	};
	
	module.exports = Utils;


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	var Ball = __webpack_require__(2);
	var Utils = __webpack_require__(4);
	
	var Portal = function (portalId, entry, exit, pos, angle, width, color, main) {
	  this.portalId = portalId;
	  this.entry = entry;
	  this.exit = exit;
	  this.pos = pos;
	  this.angle = -angle;
	  this.width = width;
	  this.height = 10;
	  this.color = color;
	  this.main = main;
	};
	
	Portal.prototype.draw = function (context) {
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
	  context.fillStyle = this.color;
	  context.stroke();
	  context.fill();
	  context.fillStyle = "none";
	  if (this.exit) {
	    context.strokeStyle = "yellow";
	    context.beginPath();
	    context.moveTo(thirdX, thirdY);
	    context.lineTo(fourthX, fourthY);
	    context.stroke();
	    context.strokeStyle = "black";
	  }
	};
	
	Portal.prototype.step = function () {
	
	};
	
	Portal.prototype.findPair = function () {
	  var pair;
	  this.main.objects.forEach(function (object) {
	    if (object === this) return;
	    if (object instanceof Portal) {
	      if (object.portalId === this.portalId) {
	        pair = object;
	      }
	    } else {
	      return;
	    }
	  }.bind(this));
	  return pair;
	};
	
	Portal.prototype.isCollideWith = function (otherObject) {
	  if (this.entry) {
	    if (otherObject instanceof Ball) {
	      var ball = otherObject;
	      var ballBounds = Utils.circleBounds(ball);
	      var topVertex = { x: ball.pos.x, y: ballBounds.top };
	      var bottomVertex = { x: ball.pos.x, y: ballBounds.bottom };
	      var leftVertex = { x: ballBounds.left, y: ball.pos.y };
	      var rightVertex = { x: ballBounds.right, y: ball.pos.y };
	
	      var portalBounds = Utils.rectBounds(this);
	
	      if (bottomVertex.x >= portalBounds.left && bottomVertex.x <= portalBounds.right && bottomVertex.y >= portalBounds.top && bottomVertex.y <= portalBounds.bottom) {
	        return true;
	      } else if (topVertex.x >= portalBounds.left && topVertex.x <= portalBounds.right && topVertex.y >= portalBounds.top && topVertex.y <= portalBounds.bottom) {
	        return true;
	      } else if (leftVertex.x >= portalBounds.left && leftVertex.x <= portalBounds.right && leftVertex.y >= portalBounds.top && leftVertex.y <= portalBounds.bottom) {
	        return true;
	      } else if (rightVertex.x >= portalBounds.left && rightVertex.x <= portalBounds.right && rightVertex.y >= portalBounds.top && rightVertex.y <= portalBounds.bottom) {
	        return true;
	      } else {
	        return false;
	      }
	    }
	  } else {
	    return false;
	  }
	};
	
	Portal.prototype.collideWith = function (otherObject) {
	  var exitPortal = this.findPair();
	  var ball = otherObject;
	  var portalBounds = Utils.rectBounds(exitPortal);
	  var width = (portalBounds.right + portalBounds.left) / 2 ;
	  var height = (portalBounds.bottom + portalBounds.top) / 2;
	
	  ball.pos.x = width;
	  ball.pos.y = height;
	
	  var speed = Math.sqrt(Math.pow(ball.velocity.x, 2) + Math.pow(ball.velocity.y, 2));
	
	  ball.velocity.x = speed * Math.cos(Math.PI / 2 + exitPortal.angle);
	  ball.velocity.y = speed * Math.sin(Math.PI / 2 + exitPortal.angle);
	};
	
	Portal.prototype.containPoint = function (pos) {
	  return Utils.containRect(this, pos);
	};
	
	module.exports = Portal;


/***/ },
/* 6 */
/***/ function(module, exports) {

	var View = function (context, main) {
	  this.context = context;
	  this.main = main;
	}; 
	
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
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	var Ball = __webpack_require__(2);
	var Track = __webpack_require__(3);
	var BallGenerator = __webpack_require__(8);
	var Portal = __webpack_require__(5);
	
	var ButtonActions = __webpack_require__(9);
	
	var ButtonListeners = {
	  addBallListener: function (view) {
	    var active = false;
	    $('#place-ball-btn').click(function (event) {
	      event.preventDefault();
	      ButtonActions.toggleCanvasClickListener('#place-ball-btn', active, view, "Stop Placing Balls", "Place Balls", ButtonActions.addBall);
	      active = !active;
	    });
	  },
	
	  addTrackListener: function (view) {
	    var isDrawingTracks = false;
	    var point1, point2, track;
	    var trackDrawn = false;
	    var canvas = view.main.canvas;
	
	    $('#draw-tracks-btn').click(function (event) {
	      event.preventDefault();
	      ButtonActions.disableInactiveBtns('#draw-tracks-btn');
	      if (!isDrawingTracks) {
	        $('#main-canvas').on("mousedown", function (e) {
	          var x = e.pageX - canvas.offsetLeft;
	          var y = e.pageY - canvas.offsetTop;
	
	          point1 = {x: x, y: y};
	
	        }).on("mousemove", function (e) {
	          var x = e.pageX - canvas.offsetLeft;
	          var y = e.pageY - canvas.offsetTop;
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
	        }).on("mouseup", function (e) {
	          // Will make sure the next drawing will pop the copy of it
	          if (track) {
	            view.main.objects.push(track);
	            trackDrawn = true;
	          }
	
	          point1 = 0;
	          point2 = 0;
	        });
	        $(this).text("Stop Drawing Tracks");
	        isDrawingTracks = true;
	      } else {
	        isDrawingTracks = false;
	        if (trackDrawn) {
	          view.main.objects.pop();
	          trackDrawn = false;
	        }
	        ButtonActions.enableBtns();
	
	        $(this).text("Draw Tracks");
	      }
	    });
	  },
	
	  addPlayListener: function (view) {
	    var isPlaying = false;
	    var canvas = view.main.canvas;
	    $('#play-btn').click(function(event) {
	      event.preventDefault();
	      if (!isPlaying) {
	        ButtonActions.disableInactiveBtns('#play-btn');
	        isPlaying = true;
	        $(this).text("Stop");
	        $(this).toggleClass("active");
	        view.start();
	
	        $('#main-canvas').on("click", function (e) {
	          ButtonActions.addBall(e, view);
	        });
	      } else {
	        ButtonActions.enableBtns();
	        isPlaying = false;
	        $(this).text("Play");
	        $(this).toggleClass("active");
	        view.stop();
	      }
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
	        "Stop Making Ball Generators",
	        "Construct Ball Generators",
	        ButtonActions.addBallGenerator
	      );
	      active = !active;
	    });
	  },
	
	  addPortalListener: function (view) {
	    var isActive = false;
	    var placingFirstPortal = true;
	    var placingSecondPortal = false;
	    var portalId = 0;
	    $("#portal-btn").click(function (event) {
	      event.preventDefault();
	
	      if (!isActive) {
	        ButtonActions.disableInactiveBtns('#portal-btn');
	        isActive = true;
	        $(this).text("Stop making portals");
	        $('#main-canvas').on("click", function (e) {
	          if (placingFirstPortal) {
	            $("#place-portal-txt").text("Make Exit Portal");
	            $("#portal-btn").prop("disabled", true);
	
	            placingFirstPortal = false;
	            placingSecondPortal = true;
	
	            ButtonActions.addPortal(e, view, 'entry', portalId);
	
	          } else if (placingSecondPortal) {
	            $("#portal-btn").prop("disabled", false);
	            $("#place-portal-txt").text("Make Entry Portal");
	            placingFirstPortal = true;
	            placingSecondPortal = false;
	
	            ButtonActions.addPortal(e, view, 'exit', portalId);
	            portalId += 1;
	          }
	        });
	
	      } else {
	        ButtonActions.enableBtns();
	        $("#place-portal-txt").text("Make Entry Portal");
	        isActive = false;
	        placingFirstPortal = true;
	        placingSecondPortal = false;
	        $(this).text("Make Portals");
	      }
	
	    });
	  },
	
	  demoListener: function (view, canvas, main) {
	    var isDemoing = false;
	
	    $('#demo-btn').click(function (event) {
	      event.preventDefault();
	
	      if (!isDemoing) {
	        $('.menu-btn').prop("disabled", true);
	        $(this).prop("disabled", false);
	        $(this).text("Stop Demo");
	        $(this).toggleClass("active");
	        isDemoing = true;
	        main.objects = [];
	        main.draw(view.context);
	        var ballGenerator;
	
	        var angle = 60;
	        var radianAngle = angle * (Math.PI / 180);
	        var velocity = 5;
	        var frequency = 60;
	
	        var ballGenerator = new BallGenerator({x: 100, y: 200}, radianAngle, velocity, frequency, main);
	        view.main.objects.push(ballGenerator);
	
	        var entryPortal = new Portal(1000, true, false, {x: 250, y: 300}, 0, 50, "blue", main);
	        view.main.objects.push(entryPortal);
	        var exitPortal = new Portal(1000, false, true, {x: 500, y: 100}, radianAngle, 50, "orange", main);
	        view.main.objects.push(exitPortal);
	
	        var track = new Track({x: 800, y: 300}, {x: 500, y: 400}, view.main.gravity);
	        view.main.objects.push(track);
	        track = new Track({x: 400, y: 400}, {x: 600, y: 500}, view.main.gravity);
	        view.main.objects.push(track);
	
	        entryPortal = new Portal(1001, true, false, {x: 600, y: 550}, 0, 100, "blue", main);
	        view.main.objects.push(entryPortal);
	        exitPortal = new Portal(1001, false, true, {x: 100, y: 500}, 120 * Math.PI / 180, 50, "orange", main);
	        view.main.objects.push(exitPortal);
	        view.start();
	      } else {
	        $('.menu-btn').prop("disabled", false);
	        $(this).text("Demo");
	        $(this).toggleClass("active");
	        isDemoing = false;
	        view.stop();
	      }
	    });
	  },
	
	  addRemoveItemListener: function (view, canvas) {
	    var isRemoving = false;
	
	    $('#remove-item-btn').click(function (event) {
	      event.preventDefault();
	
	      if (!isRemoving) {
	        ButtonActions.disableInactiveBtns('#remove-item-btn');
	        $(this).text("Stop Removing");
	        isRemoving = true;
	        $('#main-canvas').on("click", function (e) {
	          var x = e.pageX - canvas.offsetLeft;
	          var y = e.pageY - canvas.offsetTop;
	          view.main.removeObject({x: x, y: y}, view.context);
	        });
	      } else {
	        ButtonActions.enableBtns();
	        isRemoving = false;
	        $(this).text("Remove item");
	      }
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


/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	var Ball = __webpack_require__(2);
	var Utils = __webpack_require__(4);
	
	var BallGenerator = function (pos, angle, ballVelocity, frequency, main) {
	  this.pos = pos;
	  this.angle = -angle;
	  this.ballVelocity = ballVelocity;
	  this.frequency = frequency;
	  this.width = 40;
	  this.height = 15;
	  this.radius = 5;
	  this.main = main;
	  this.time = Math.pow(10, 3);
	
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
	  if (this.time >= Math.pow(10, 3)) {
	    this.fire();
	    this.ball = this.generateBall();
	    this.time = 0;
	  }
	
	},
	
	BallGenerator.prototype.containPoint = function (pos) {
	  return Utils.containRect(this, pos);
	};
	
	module.exports = BallGenerator;


/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	var Ball = __webpack_require__(2);
	var Track = __webpack_require__(3);
	var BallGenerator = __webpack_require__(8);
	var Portal = __webpack_require__(5);
	
	var ButtonActions = {
	  disableInactiveBtns: function (activeBtn) {
	    $('.menu-btn').prop("disabled", true);
	    $(activeBtn).prop("disabled", false);
	  },
	
	  enableBtns: function () {
	    $('.menu-btn').prop("disabled", false);
	    $('#main-canvas').off();
	  },
	
	  addBall: function (event, view) {
	    var x = event.pageX - view.main.canvas.offsetLeft;
	    var y = event.pageY - view.main.canvas.offsetTop;
	
	    var ball = new Ball({x: x, y: y}, 5, {x: 0, y: 0}, view.main);
	    view.main.objects.push(ball);
	    view.main.draw(view.context);
	  },
	
	  addBallGenerator: function (event, view) {
	    var x = event.pageX - view.main.canvas.offsetLeft;
	    var y = event.pageY - view.main.canvas.offsetTop;
	
	    var angle = $('#ball-generator-angle').val();
	    var radianAngle = angle * (Math.PI / 180);
	
	    var velocity = parseInt($('#ball-generator-velocity').val());
	
	    var frequency = parseInt($('#ball-generator-frequency').val());
	
	    var ballGenerator = new BallGenerator({x: x, y: y}, radianAngle, velocity, frequency, view.main);
	    view.main.objects.push(ballGenerator);
	    view.main.draw(view.context);
	  },
	
	  addPortal: function (event, view, portalType, portalId) {
	    var isEntry = portalType === 'entry';
	    var portalAngleId = isEntry ? '#first-portal-angle' : '#second-portal-angle';
	    var portalWidthId = isEntry ? '#first-portal-width' : '#second-portal-width';
	    var portalColor = isEntry ? "blue" : "orange";
	
	    var x = event.pageX - view.main.canvas.offsetLeft;
	    var y = event.pageY - view.main.canvas.offsetTop;
	
	    var angle = $(portalAngleId).val();
	    var radianAngle = angle * (Math.PI / 180);
	
	    var width = parseInt($(portalWidthId).val());
	
	    var portal = new Portal(portalId, isEntry, !isEntry, {x: x, y: y}, radianAngle, width, portalColor, view.main);
	    view.main.objects.push(portal);
	    portal.draw(view.context);
	  },
	
	  toggleCanvasClickListener: function (activeBtn, active, view, activeText, inactiveText, callback) {
	    this.disableInactiveBtns(activeBtn);
	    if (!active) {
	      $('#main-canvas').on("click", function (e) {
	        callback(e, view);
	      });
	      $(activeBtn).text(activeText);
	      active = true;
	    } else {
	      this.enableBtns();
	      active = false;
	      $(activeBtn).text(inactiveText);
	    }
	  }
	};
	
	module.exports = ButtonActions;


/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map