(($) => {
  // Closes responsive menu on item click
  $('.navbar-collapse .navbar-nav a').on('click', () => {
    $('.navbar-toggler:visible').click();
  });

  // Fixed header
  $(window).on('scroll', () => {
    if ($(window).scrollTop() > 70) {
      $('.site-navigation,.trans-navigation').addClass('header-white');
    } else {
      $('.site-navigation,.trans-navigation').removeClass('header-white');
    }
  });

  // Smooth-scroll JS
  $('a.smoth-scroll').on('click', (e) => {
    const anchor = $(this);
    $('html, body').stop().animate({
      scrollTop: $(anchor.attr('href')).offset().top - 50,
    }, 1000);
    e.preventDefault();
  });
})(window.jQuery);
