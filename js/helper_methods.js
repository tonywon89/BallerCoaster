var HelperMethods = {
  getPoint: function (event, view) {
    var x = event.pageX - view.main.canvas.offsetLeft;
    var y = event.pageY - view.main.canvas.offsetTop;
    return {x: x, y: y};
  },

  disableInactiveBtns: function (activeBtn) {
    $('.menu-btn').prop("disabled", true);
    $(activeBtn).prop("disabled", false);
  },

  enableBtns: function () {
    $('.menu-btn').prop("disabled", false);
    $('#main-canvas').off();
  }
};

module.exports = HelperMethods;
