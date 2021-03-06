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
	
	$(function () {
	  var canvasEl = document.getElementById("main-canvas");
	  canvasEl.width = 850;
	  canvasEl.height = 555;
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
	  ButtonListeners.closeListener(view);
	
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
	var Bounds = __webpack_require__(4);
	
	var Ball = function (pos, radius, velocity, color, main) {
	  this.pos = pos;
	  this.radius = radius;
	  this.velocity = velocity;
	  this.acceleration = {x: 0, y: main.gravity};
	  this.main = main;
	  this.color = color;
	  this.isCollided = false;
	};
	
	Ball.prototype.draw = function (context) {
	  context.beginPath();
	  context.arc(this.pos.x, this.pos.y, this.radius, 0, Math.PI * 2);
	  context.fillStyle = this.color;
	  context.fill();
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
	    if (Ey < this.pos.y) {
	      var overlap = this.radius + LEC;
	    } else {
	      var overlap = this.radius - LEC;
	    }
	
	    var speed = Math.sqrt(Math.pow((this.velocity.x), 2) + Math.pow((this.velocity.y), 2));
	
	    var scale = -overlap / speed;
	    var x = scale * this.velocity.x;
	    var y = scale * this.velocity.y;
	    this.backupVector = {x: x, y: y};
	
	    var largerX = B.x > A.x ? B.x : A.x;
	    var smallerX = B.x >= A.x ? A.x : B.x;
	
	    if (LEC <= this.radius && (this.pos.x < largerX && this.pos.x > smallerX)) {
	      this.collidedObject = otherObject;
	      return true;
	    } else {
	      if (this.collidedObject === otherObject) {
	        this.collidedObject = undefined;
	        this.isCollided = false;
	        this.acceleration = { x: 0, y: this.main.gravity };
	        this.backupVector = null;
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
	        if (this.backupVector) {
	          this.pos.x += this.backupVector.x;
	          this.pos.y += this.backupVector.y;
	        }
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
	  var bounds = Bounds.circleBounds(this);
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
	
	Track.prototype.findY = function (x) {
	  return this.point1.y - (this.point1.x - x) * Math.tan(this.theta);
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

	var Bounds = {
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
	    var first = this.computeFirstCorner(object);
	
	    var secondX = first.x + object.width * Math.cos(object.angle);
	    var secondY = first.y + object.width * Math.sin(object.angle);
	
	    var thirdX = secondX + object.height * Math.cos(object.angle + Math.PI / 2);
	    var thirdY = secondY + object.height * Math.sin(object.angle + Math.PI / 2);
	
	    var fourthX = thirdX + object.width * Math.cos(object.angle + Math.PI);
	    var fourthY = thirdY + object.width * Math.sin(object.angle + Math.PI);
	
	    var xPositions = [first.x, secondX, thirdX, fourthX];
	    var yPositions = [first.y, secondY, thirdY, fourthY];
	    left = Math.min(...xPositions);
	    right = Math.max(...xPositions);
	    top = Math.min(...yPositions);
	    bottom = Math.max(...yPositions);
	
	    return {left: left, right: right, top: top, bottom: bottom };
	  },
	
	  rectCorners: function (object) {
	    var first = this.computeFirstCorner(object);
	
	    var secondX = first.x + object.width * Math.cos(object.angle);
	    var secondY = first.y + object.width * Math.sin(object.angle);
	
	    var thirdX = secondX + object.height * Math.cos(object.angle + Math.PI / 2);
	    var thirdY = secondY + object.height * Math.sin(object.angle + Math.PI / 2);
	
	    var fourthX = thirdX + object.width * Math.cos(object.angle + Math.PI);
	    var fourthY = thirdY + object.width * Math.sin(object.angle + Math.PI);
	
	    return {first: {x: first.x, y: first.y}, second: {x: secondX, y: secondY}, third: {x: thirdX, y: thirdY}, fourth: {x: fourthX, y: fourthY}};
	  },
	
	  containRect: function (object, pos) {
	    var bounds = this.rectBounds(object);
	    var corners = this.rectCorners(object);
	    if (Math.floor(reactangleArea(corners)) === Math.floor(
	      triangleArea(pos, corners.first, corners.second) + triangleArea(pos, corners.second, corners.third) +
	      triangleArea(pos, corners.third, corners.fourth) + triangleArea(pos, corners.fourth, corners.first)
	    )) {
	      return true;
	    } else {
	      return false;
	    }
	    // if (pos.x >= bounds.left && pos.x <= bounds.right && pos.y >= bounds.top && pos.y <= bounds.bottom) {
	    //   return true
	    // } else {
	    //   return false;
	    // }
	  },
	
	  computeFirstCorner: function (object) {
	    var center = {x: object.pos.x, y: object.pos.y};
	    var y = center.y - object.width/2 * Math.sin(object.angle) + object.height/2 * Math.sin(object.angle - Math.PI / 2);
	    var x = center.x - object.width/2 * Math.cos(object.angle) + object.height/2 * Math.cos(object.angle - Math.PI / 2 );
	    return {x: x, y: y};
	  }
	};
	
	var reactangleArea = function (corners) {
	  var width = Math.sqrt(Math.pow(corners.first.y - corners.second.y, 2) + Math.pow(corners.first.x - corners.second.x, 2));
	  var height = Math.sqrt(Math.pow(corners.second.y - corners.third.y, 2) + Math.pow(corners.second.x - corners.third.x, 2));
	  return width * height;
	};
	
	var triangleArea = function(pos1, pos2, pos3) {
	  var side1 = Math.sqrt(Math.pow(pos2.y - pos1.y, 2) + Math.pow(pos2.x - pos1.x, 2));
	  var side2 = Math.sqrt(Math.pow(pos3.y - pos2.y, 2) + Math.pow(pos3.x - pos2.x, 2));
	  var side3 = Math.sqrt(Math.pow(pos1.y - pos3.y, 2) + Math.pow(pos1.x - pos3.x, 2));
	  var perimeter = (side1 + side2 + side3)/2;
	  var area =  Math.sqrt(perimeter*((perimeter-side1)*(perimeter-side2)*(perimeter-side3)));
	  return area;
	};
	
	module.exports = Bounds;


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	var Ball = __webpack_require__(2);
	var Bounds = __webpack_require__(4);
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
	  this.pulseInterval = 0;
	};
	
	Portal.prototype.draw = function (context) {
	  var firstCorner = Bounds.computeFirstCorner(this);
	  context.beginPath();
	  context.ellipse(this.pos.x, this.pos.y, this.width/2, this.height/2, this.angle, 0, Math.PI * 2, false);
	  context.closePath();
	  context.fillStyle = this.color;
	  context.stroke();
	  context.fill();
	  context.fillStyle = "none";
	  context.beginPath();
	  context.ellipse(this.pos.x, this.pos.y, this.width/2 * this.pulseInterval , this.height/2 * this.pulseInterval, this.angle, 0, Math.PI * 2, false);
	  context.closePath();
	  context.strokeStyle = "white";
	  context.stroke();
	  context.strokeStyle = "black";
	  if (this.exit) {
	    context.beginPath();
	    context.moveTo(firstCorner.x, firstCorner.y);
	    var secondX = firstCorner.x + this.width * Math.cos(this.angle);
	    var secondY = firstCorner.y + this.width * Math.sin(this.angle);
	    context.lineTo(secondX, secondY);
	    context.closePath();
	    context.stroke();
	  }
	};
	
	Portal.prototype.step = function () {
	  this.pulseInterval += 0.05;
	  if (this.pulseInterval >= 1) {
	    this.pulseInterval = 0;
	  }
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
	      var ballBounds = Bounds.circleBounds(ball);
	      var topVertex = { x: ball.pos.x, y: ballBounds.top };
	      var bottomVertex = { x: ball.pos.x, y: ballBounds.bottom };
	      var leftVertex = { x: ballBounds.left, y: ball.pos.y };
	      var rightVertex = { x: ballBounds.right, y: ball.pos.y };
	
	      if (Bounds.containRect(this, bottomVertex)) {
	        return true;
	      } else if (Bounds.containRect(this, topVertex)) {
	        return true;
	      } else if (Bounds.containRect(this, leftVertex)) {
	        return true;
	      } else if (Bounds.containRect(this, rightVertex)) {
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
	  var portalBounds = Bounds.rectBounds(exitPortal);
	  var width = (portalBounds.right + portalBounds.left) / 2 ;
	  var height = (portalBounds.bottom + portalBounds.top) / 2;
	  
	  ball.pos.x = width;
	  ball.pos.y = height;
	
	  var speed = Math.sqrt(Math.pow(ball.velocity.x, 2) + Math.pow(ball.velocity.y, 2));
	
	  ball.velocity.x = speed * Math.cos(Math.PI / 2 + exitPortal.angle);
	  ball.velocity.y = speed * Math.sin(Math.PI / 2 + exitPortal.angle);
	};
	
	Portal.prototype.containPoint = function (pos) {
	  return Bounds.containRect(this, pos);
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
	};
	
	View.prototype.stop = function () {
	  if (requestId) {
	    cancelAnimationFrame(requestId);
	    requestId = undefined;
	  }
	};
	
	
	View.prototype.step = function () {
	  this.objects.forEach(function(object) {
	    object.step();
	  });
	};
	
	module.exports = View;


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	var ButtonActions = __webpack_require__(8);
	var createDemoObjects = __webpack_require__(13);
	var HelperMethods = __webpack_require__(11);
	var DetailConstants = __webpack_require__(12);
	
	var resetDemo = function (view) {
	  view.main.objects = [];
	  view.main.draw(view.context);
	  view.main.objects = createDemoObjects(view);
	};
	
	var ButtonListeners = {
	  addBallListener: function (view) {
	    $('#place-ball-btn').click(function (event) {
	      event.preventDefault();
	      ButtonActions.populateDetail('#place-ball-btn', view, false, ButtonActions.addBall, ButtonActions.ballPreview);
	    });
	  },
	
	  addTrackListener: function (view) {
	    var active = false;
	    $('#draw-tracks-btn').click(function (event) {
	      event.preventDefault();
	      ButtonActions.populateDetail('#draw-tracks-btn', view, true);
	    });
	  },
	
	  addPlayListener: function (view) {
	    var active = false;
	    var canvas = view.main.canvas;
	    $('#play-btn').click(function(event) {
	      event.preventDefault();
	      ButtonActions.play(view, '#play-btn', "Stop", "Play", active);
	      $('.menu-detail').fadeOut();
	      $('.menu').fadeIn();
	      ButtonActions.popLastTrack(view);
	      active = !active;
	    });
	  },
	
	  addBallGeneratorListener: function (view) {
	    $('#ball-generator-btn').click(function (event) {
	      event.preventDefault();
	      ButtonActions.populateDetail('#ball-generator-btn', view, false, ButtonActions.addBallGenerator, ButtonActions.ballGeneratorPreview);
	    });
	  },
	
	  addPortalListener: function (view) {
	    $("#portal-btn").click(function (event) {
	      event.preventDefault();
	      ButtonActions.populateDetail('#portal-btn', view, false, ButtonActions.addEntryPortal.bind(ButtonActions), ButtonActions.portalPreview, true);
	
	    });
	  },
	
	  demoListener: function (view) {
	    var active = false;
	    $('#demo-btn').click(function (event) {
	      event.preventDefault();
	      ButtonActions.play(view, '#demo-btn', "Stop Demo", "Demo", active, resetDemo);
	      $('.menu-detail').fadeOut();
	      $('.menu').fadeIn();
	      ButtonActions.popLastTrack(view);
	      active = !active;
	    });
	  },
	
	  addRemoveItemListener: function (view) {
	    var active = false;
	    $('#remove-item-btn').click(function (event) {
	      event.preventDefault();
	      $('#main-canvas').off();
	      $(this).toggleClass("active");
	      $('.menu-detail').fadeOut();
	      $('.menu').fadeIn();
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
	  },
	
	  closeListener: function (view) {
	    $('.close-detail').click(function (event) {
	      event.preventDefault();
	      $('.menu-detail').fadeOut();
	      $('.menu').fadeIn();
	      ButtonActions.popLastTrack(view);
	      HelperMethods.enableBtns();
	    });
	  }
	
	
	};
	
	module.exports = ButtonListeners;


/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	var Ball = __webpack_require__(2);
	var Track = __webpack_require__(3);
	var BallGenerator = __webpack_require__(9);
	var Portal = __webpack_require__(5);
	var TextConstants = __webpack_require__(10);
	var HelperMethods = __webpack_require__(11);
	var DetailConstants = __webpack_require__(12);
	
	var portalId = 0;
	
	var point1, point2, drawnTrack;
	var trackDrawn = false;
	
	var addBallPreview = function (ballPreview, view, context) {
	  var x = ballPreview.width/2;
	  var y = ballPreview.height/2;
	  var point = {x: x, y: y};
	  var size = parseInt($('#ball-size').val());
	  var color= '#' + $('#ball-color').val();
	  var ball = new Ball(point, size, {x: 0, y: 0}, color, view.main);
	  ball.draw(context);
	};
	
	var addGeneratorPreview = function (generatorPreview, view, context) {
	  var x = generatorPreview.width/2;
	  var y = generatorPreview.height/2;
	  var point = {x: x, y: y};
	  var angle = parseInt($('#ball-generator-angle').val());
	  var radianAngle = angle * (Math.PI / 180);
	  var velocity = parseInt($('#ball-generator-velocity').val());
	  var frequency = parseInt($('#ball-generator-frequency').val());
	  var color = $('#hidden-ball-generator-color').val();
	  var size = parseInt($('#ball-generator-size').val());
	  var ballGenerator = new BallGenerator(point, radianAngle, velocity, frequency, color, size, view.main);
	  ballGenerator.draw(context);
	};
	
	var addPortalPreview = function (portalPreview, view, context, isEntry) {
	  var x = portalPreview.width/2;
	  var y = portalPreview.height/2;
	  var point = {x: x, y: y};
	  var portalAngleId = isEntry ? '#first-portal-angle' : '#second-portal-angle';
	  var portalWidthId = isEntry ? '#first-portal-width' : '#second-portal-width';
	  var portalColor = isEntry ? "blue" : "orange";
	
	  var angle = parseInt($(portalAngleId).val());
	  var radianAngle = angle * (Math.PI / 180);
	  var width = parseInt($(portalWidthId).val());
	
	  var portal = new Portal(2000, isEntry, !isEntry, point, radianAngle, width, portalColor, view.main);
	  portal.draw(context);
	};
	
	var ButtonActions = {
	  populateDetail: function (actionBtn, view, trackDraw, callback, detailCallback, isEntry) {
	    $(DetailConstants[actionBtn]).fadeIn();
	    $('.menu').fadeOut();
	    this.closeListener(view);
	    if (!trackDraw) {
	      if (detailCallback) {
	
	        detailCallback(view, isEntry);
	      }
	      this.addCanvasClickListener(actionBtn, view, callback);
	    } else {
	      this.toggleCanvasDragListener(actionBtn, view);
	    }
	  },
	
	  closeListener: function (view) {
	    $('.close-detail').click(function (event) {
	      event.preventDefault();
	      $('.menu-detail').fadeOut();
	      $('.menu').fadeIn();
	      ButtonActions.popLastTrack(view);
	      HelperMethods.enableBtns();
	    });
	  },
	
	  addBall: function (event, view) {
	    var point = HelperMethods.getPoint(event, view.main.canvas);
	    var size = parseInt($('#ball-size').val());
	    var color= '#' + $('#ball-color').val();
	    var ball = new Ball(point, size, {x: 0, y: 0}, color, view.main);
	    view.main.objects.push(ball);
	    view.main.draw(view.context);
	  },
	
	  ballPreview: function (view) {
	    var ballPreview = document.getElementById("ball-preview");
	    ballPreview.width = 150;
	    ballPreview.height = 150;
	    var context = ballPreview.getContext('2d');
	    addBallPreview(ballPreview, view, context);
	    $('#ball-size').on('propertychange input', function (e) {
	      context.clearRect(0, 0, ballPreview.width, ballPreview.height);
	      addBallPreview(ballPreview, view, context);
	    });
	    $('#hidden-ball-color').change(function (e) {
	      context.clearRect(0, 0, ballPreview.width, ballPreview.height);
	      addBallPreview(ballPreview, view, context);
	    });
	  },
	
	  ballGeneratorPreview: function (view) {
	    var generatorPreview = document.getElementById("ball-generator-preview");
	    generatorPreview.width = 100;
	    generatorPreview.height = 100;
	    var context = generatorPreview.getContext('2d');
	    addGeneratorPreview(generatorPreview, view, context);
	    $('#ball-generator-angle').change(function(e) {
	      context.clearRect(0, 0, generatorPreview.width, generatorPreview.height);
	      addGeneratorPreview(generatorPreview, view, context);
	    });
	    $('#hidden-ball-generator-color').change(function(e) {
	      context.clearRect(0, 0, generatorPreview.width, generatorPreview.height);
	      addGeneratorPreview(generatorPreview, view, context);
	    });
	    $('#ball-generator-size').change(function(e) {
	      context.clearRect(0, 0, generatorPreview.width, generatorPreview.height);
	      addGeneratorPreview(generatorPreview, view, context);
	    });
	  },
	
	  portalPreview: function (view, isEntry) {
	    var portalPreview = isEntry ? document.getElementById("entry-portal-preview") : document.getElementById("exit-portal-preview");
	    var portalAngle = isEntry ? "#first-portal-angle" : '#second-portal-angle';
	    var portalWidth = isEntry ? "#first-portal-width" : '#second-portal-width';
	    portalPreview.width = 150;
	    portalPreview.height = 150;
	    var context = portalPreview.getContext('2d');
	    addPortalPreview(portalPreview, view, context, isEntry);
	    $(portalAngle).change(function (e) {
	      context.clearRect(0, 0, portalPreview.width, portalPreview.height);
	      addPortalPreview(portalPreview, view, context, isEntry);
	    });
	    $(portalWidth).change(function (e) {
	      context.clearRect(0, 0, portalPreview.width, portalPreview.height);
	      addPortalPreview(portalPreview, view, context, isEntry);
	    });
	  },
	
	  addBallGenerator: function (event, view) {
	    var point = HelperMethods.getPoint(event, view.main.canvas);
	    var angle = parseInt($('#ball-generator-angle').val());
	    var radianAngle = angle * (Math.PI / 180);
	    var velocity = parseInt($('#ball-generator-velocity').val());
	    var frequency = parseInt($('#ball-generator-frequency').val());
	    var color = $('#ball-generator-color').val();
	    var size = parseInt($('#ball-generator-size').val());
	    var ballGenerator = new BallGenerator(point, radianAngle, velocity, frequency, color, size, view.main);
	    view.main.objects.push(ballGenerator);
	    view.main.draw(view.context);
	  },
	
	  addPortal: function (event, view, portalType, id) {
	    var isEntry = portalType === 'entry';
	    var portalAngleId = isEntry ? '#first-portal-angle' : '#second-portal-angle';
	    var portalWidthId = isEntry ? '#first-portal-width' : '#second-portal-width';
	    var portalColor = isEntry ? "blue" : "orange";
	
	    var point = HelperMethods.getPoint(event, view.main.canvas);
	    var angle = parseInt($(portalAngleId).val());
	    var radianAngle = angle * (Math.PI / 180);
	    var width = parseInt($(portalWidthId).val());
	
	    var portal = new Portal(id, isEntry, !isEntry, point, radianAngle, width, portalColor, view.main);
	    view.main.objects.push(portal);
	    portal.draw(view.context);
	  },
	
	  addEntryPortal: function (event, view) {
	    this.addPortal(event, view, 'entry', portalId);
	    $('#entry-portal-detail').fadeOut();
	    $('#main-canvas').off();
	    this.populateDetail('#exit-portal-btn', view, false, this.addExitPortal.bind(this), this.portalPreview, false);
	    $('button').prop("disabled", true);
	  },
	
	  addExitPortal: function (event, view) {
	    this.addPortal(event, view, 'exit', portalId);
	    portalId += 1;
	    $('#main-canvas').off();
	    $('#exit-portal-detail').fadeOut();
	    this.populateDetail('#portal-btn', view, false, this.addEntryPortal.bind(this), this.portalPreview, true);
	  },
	
	  removeObject: function (event, view) {
	    var x = event.offsetX;
	    var y = event.offsetY;
	    view.main.removeObject({x: x, y: y}, view.context);
	  },
	
	  play: function (view, activeBtn, activeText, inactiveText, active, callback) {
	    if (!active) {
	      HelperMethods.disableInactiveBtns(activeBtn);
	      $('#remove-item-btn').prop("disabled", true);
	      $('#clear-btn').prop("disabled", true);
	      $('#main-canvas').off();
	      $(activeBtn).text(activeText);
	      $(activeBtn).toggleClass("active");
	      if (callback) {
	        $('#play-btn').prop("disabled", true);
	        callback(view);
	      } else {
	        $('#demo-btn').prop("disabled", true);
	      }
	      view.start();
	      $('#play-text').text("Click around to create falling circles!");
	      $('#main-canvas').on("click", function (e) {
	        this.addBall(e, view);
	      }.bind(this));
	    } else {
	      HelperMethods.enableBtns();
	      $(activeBtn).text(inactiveText);
	      $(activeBtn).toggleClass("active");
	      $('#play-text').text("");
	      view.stop();
	    }
	  },
	
	  toggleCanvasClickListener: function (activeBtn, active, view, callback) {
	    HelperMethods.disableInactiveBtns(activeBtn);
	    if (!active) {
	      $('#main-canvas').on("click", function (e) {
	        callback(e, view, activeBtn);
	      });
	      $(".play").prop("disabled", true);
	      $(activeBtn).text(TextConstants[activeBtn].active);
	    } else {
	      HelperMethods.enableBtns();
	      $(activeBtn).text(TextConstants[activeBtn].inactive);
	    }
	  },
	
	  addCanvasClickListener: function (activeBtn, view, callback) {
	    HelperMethods.disableInactiveBtns(activeBtn);
	    $('#main-canvas').on("click", function (e) {
	      callback(e, view, activeBtn);
	    });
	  },
	
	  toggleCanvasDragListener: function (activeBtn, view) {
	    HelperMethods.disableInactiveBtns(activeBtn);
	
	    var initial = true;
	    $('#main-canvas').on("mousedown", function (event) {
	      point1 = HelperMethods.getPoint(event, view.main.canvas);
	
	    }).on("mousemove", function (e) {
	      point2 = HelperMethods.getPoint(e, view.main.canvas);
	      drawnTrack = HelperMethods.drawTrack(e, view, point1, point2, initial);
	      if (drawnTrack) { initial = false; }
	
	    }).on("mouseup", function () {
	      trackDrawn = HelperMethods.addTrack(view, drawnTrack);
	      point1 = 0;
	      point2 = 0;
	    });
	  },
	
	  popLastTrack: function (view) {
	    if (trackDrawn) {
	      view.main.objects.pop();
	      trackDrawn = false;
	    }
	  }
	};
	
	module.exports = ButtonActions;


/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	var Ball = __webpack_require__(2);
	var Bounds = __webpack_require__(4);
	
	var BallGenerator = function (pos, angle, ballVelocity, frequency, color, size, main) {
	  this.pos = pos;
	  this.angle = -angle;
	  this.ballVelocity = ballVelocity;
	  this.frequency = frequency;
	  this.width = 20;
	  this.height = 15;
	  this.radius = size;
	  this.color = "#" + color;
	  this.main = main;
	  this.time = Math.pow(10, 3);
	  this.firstCorner = Bounds.computeFirstCorner(this);
	
	  var ball = this.generateBall();
	  this.ball = ball;
	};
	
	BallGenerator.prototype.draw = function (context) {
	  context.beginPath();
	  context.moveTo(this.firstCorner.x, this.firstCorner.y);
	  var secondX = this.firstCorner.x + this.width * Math.cos(this.angle);
	  var secondY = this.firstCorner.y + this.width * Math.sin(this.angle);
	  context.lineTo(secondX, secondY);
	  var thirdX = secondX + this.height * Math.cos(this.angle + Math.PI / 2);
	  var thirdY = secondY + this.height * Math.sin(this.angle + Math.PI / 2);
	  context.lineTo(thirdX, thirdY);
	  var fourthX = thirdX + this.width * Math.cos(this.angle + Math.PI);
	  var fourthY = thirdY + this.width * Math.sin(this.angle + Math.PI);
	  context.lineTo(fourthX, fourthY);
	  context.closePath();
	  context.fillStyle = this.color;
	  context.fill();
	  context.stroke();
	
	  this.ball.draw(context);
	};
	
	BallGenerator.prototype.generateBall = function () {
	  var firstCorner = Bounds.computeFirstCorner(this);
	  var secondX = this.firstCorner.x + this.width * Math.cos(this.angle);
	  var secondY = this.firstCorner.y + this.width * Math.sin(this.angle);
	
	  var angle = (this.angle + Math.PI / 2) - Math.atan(this.radius/(this.height / 2));
	  var z = Math.sqrt(Math.pow(this.radius, 2) + Math.pow((this.height / 2), 2));
	  var posX = secondX + z * Math.cos(angle);
	  var posY = secondY + z * Math.sin(angle);
	
	  var velX = this.ballVelocity * Math.cos(this.angle);
	  var velY = this.ballVelocity * Math.sin(this.angle);
	  return new Ball({x: posX, y: posY}, this.radius, {x: velX, y: velY}, this.color, this.main);
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
	  return Bounds.containRect(this, pos);
	};
	
	module.exports = BallGenerator;


/***/ },
/* 10 */
/***/ function(module, exports) {

	var TextConstants = {
	  '#place-ball-btn': {active: "Stop Placing Balls", inactive: "Place Balls"},
	  '#draw-tracks-btn': {active: "Stop Drawing Tracks", inactive: "Draw Tracks"},
	  '#ball-generator-btn': {active: "Stop Making Ball Generators", inactive: "Construct Ball Generators"},
	  '#portal-btn': {active: "Stop Making Portals", inactive: "Make Portals"},
	  '#remove-item-btn': {active: "Stop Removing", inactive: "Remove item"}
	};
	
	module.exports = TextConstants;


/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	var Track = __webpack_require__(3);
	
	var HelperMethods = {
	  getPoint: function (event, canvas) {
	    var x = event.offsetX;
	    var y = event.offsetY;
	    return {x: x, y: y};
	  },
	
	  disableInactiveBtns: function (activeBtn) {
	    $('.menu-btn').prop("disabled", true);
	    $('.header-btn').prop("disabled", false);
	    $('.play').prop("disabled", false);
	    $('#remove-item-btn').prop("disabled", false);
	    $('.close-detail').prop("disabled", false);
	    $(activeBtn).prop("disabled", false);
	  },
	
	  enableBtns: function () {
	    $('.menu-btn').prop("disabled", false);
	    $('.header-btn').prop("disabled", false);
	    $('#main-canvas').off();
	  },
	
	  drawTrack: function (event, view, startPoint, endPoint, initial) {
	    if (startPoint) {
	      var track = new Track(startPoint, endPoint, view.main.gravity);
	      if (!initial) { view.main.objects.pop(); }
	      view.main.objects.push(track);
	      view.main.draw(view.context);
	      return track;
	    }
	    return false;
	  },
	
	  addTrack: function (view, track) {
	    if (track) {
	      view.main.objects.push(track);
	      return true;
	    }
	    return false;
	  }
	};
	
	module.exports = HelperMethods;


/***/ },
/* 12 */
/***/ function(module, exports) {

	var DetailConstants = {
	  '#place-ball-btn': '#ball-detail',
	  '#draw-tracks-btn': '#track-detail',
	  '#ball-generator-btn': '#ball-generator-detail',
	  '#portal-btn': '#entry-portal-detail',
	  '#exit-portal-btn': '#exit-portal-detail'
	};
	
	module.exports = DetailConstants;


/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	var Track = __webpack_require__(3);
	var BallGenerator = __webpack_require__(9);
	var Portal = __webpack_require__(5);
	
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


/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map