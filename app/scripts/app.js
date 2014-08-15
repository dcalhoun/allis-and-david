(function() {
  $(document).ready(function() {
    var menuSealed = localStorage['menuSealed'];
    menuSealed = (menuSealed) ? JSON.parse(menuSealed) : true;

    if (menuSealed) {
      var tadaMenu = setInterval(wiggle, 8000);

      $('#js-nav-toggle').on('click', function() {
        localStorage['menuSealed'] = false;
        clearInterval(tadaMenu);
      });
    }
  });

  var wiggle = function() {
    $('#js-nav-toggle').removeClass('fadeInDown tada').delay(300).queue(function() {
      $(this).addClass('tada').dequeue();
    });
  }
})(this);
