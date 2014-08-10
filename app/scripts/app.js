(function() {
  $(document).ready(function() {
    $('#js-nav-toggle').on('click', function() {
      $('body').toggleClass('nav-active');
      $(this).toggleClass('is-active');
      $('.nav-primary').toggleClass('is-active');
    });
  });
})(this);
