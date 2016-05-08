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
	var Ball = __webpack_require__(3);
	$(function () {
	  var main = new Main();
	
	  var canvasEl = document.getElementById("main-canvas");
	  canvasEl.width = window.innerWidth * 0.65
	  canvasEl.height = window.innerHeight * 0.85;
	  var context = canvasEl.getContext('2d');
	  var view = new View(context, [], canvasEl.width, canvasEl.height);
	
	  var isPlaying = false;
	  $('#place-ball-btn').click(function(event) {
	    event.preventDefault();
	    $('#main-canvas').on("click", function (event) {
	      var x = event.pageX - canvasEl.offsetLeft;
	      var y = event.pageY - canvasEl.offsetTop;
	
	      var ball = new Ball({x: x, y: y}, 5);
	      view.objects.push(ball);
	      view.draw();
	    });
	
	  });
	
	  var requestAnimationFrame =
	      window.requestAnimationFrame ||
	      window.webkitRequestAnimationFrame ||
	      window.mozRequestAnimationFrame ||
	      window.msRequestAnimationFrame ||
	      window.oRequestAnimationFrame ||
	      function(callback) {
	        return setTimeout(callback, 1);
	      };
	
	  var requestId;
	  $('#play-btn').click(function(event) {
	    event.preventDefault();
	    $('#main-canvas').off("click");
	    if (isPlaying) {
	      isPlaying = false;
	      $(this).text("Play");
	      view.stop();
	    } else {
	      isPlaying = true;
	      $(this).text("Stop");
	      view.start();
	    }
	
	
	  });
	
	  // var render = function() {
	  //   requestAnimationFrame(view.animate.bind(view));
	  // };
	  //
	  // render();
	});


/***/ },
/* 1 */
/***/ function(module, exports) {

	
	
	var Main = function () {
	
	};
	
	Main.DIM_X = 1000;
	Main.DIM_y = 1000;
	
	Main.prototype.test = function () {
	  alert("The main is here!");
	};
	
	module.exports = Main;


/***/ },
/* 2 */
/***/ function(module, exports) {

	var View = function (context, objects, canvasWidth, canvasHeight) {
	  this.context = context;
	  this.objects = objects;
	  this.canvasWidth = canvasWidth;
	  this.canvasHeight = canvasHeight;
	};
	
	View.prototype.draw = function () {
	  this.context.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
	  this.objects.forEach(function(object) {
	    object.draw(this.context, this);
	  }.bind(this));
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
	    this.step();
	    this.draw();
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
/***/ function(module, exports) {

	var Ball = function (pos, radius) {
	  this.pos = pos;
	  this.radius = radius;
	};
	
	Ball.prototype.draw = function (context) {
	  context.beginPath();
	  context.arc(this.pos.x, this.pos.y, this.radius, 0, Math.PI * 2);
	  context.stroke();
	};
	
	Ball.prototype.step = function () {
	  this.pos.y += 1;
	};
	
	
	module.exports = Ball;


/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map