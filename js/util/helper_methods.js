var Track = require("../components/track.js");

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
