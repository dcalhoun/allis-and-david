var clearFlyovers, old;

window.CS || (window.CS = {});

CS.Flyover = (function() {
  function Flyover(element, options) {
    this.$element = $(element);
    this.$body = $('body');
    this.options = options;
  }

  var transitionEnd = 'webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend';

  Flyover.DEFAULTS = {
    show: true,
    panelInClass: 'in',
    transitionClass: 'is-transitioning',
    bodyClass: 'flyover-in'
  };

  Flyover.prototype.toggle = function(_relatedTarget) {
    if (this.$element.hasClass(this.options.panelInClass)) {
      return this.hide(_relatedTarget);
    } else {
      return this.show(_relatedTarget);
    }
  };

  Flyover.prototype.show = function(_relatedTarget) {
    var e;
    e = $.Event('shown.cs.flyover', {
      relatedTarget: _relatedTarget
    });

    $(_relatedTarget).addClass(this.options.panelInClass);
    this.$element.addClass(this.options.panelInClass);
    this.$element.addClass(this.options.transitionClass);
    this.$body.addClass(this.options.bodyClass);
    return this.$element.on('click.dismiss.cs.flyover', '[data-dismiss="flyover"]', $.proxy(this.hide, this)).trigger(e);
  };

  Flyover.prototype.hide = function(_relatedTarget) {
    var e;
    var that = this;

    e = $.Event('hidden.cs.flyover', {
      relatedTarget: _relatedTarget
    });

    $(_relatedTarget).removeClass(this.options.panelInClass);
    this.$element.on(transitionEnd, function() {
      that.$element.removeClass(that.options.panelInClass);
      that.$element.off(transitionEnd);
    });
    this.$element.removeClass(this.options.transitionClass);
    this.$body.removeClass(this.options.bodyClass);
    return this.$element.off('click.dismiss.cs.flyover').trigger(e);
  };

  return Flyover;

})();

clearFlyovers = function(e) {
  $('body').removeClass('flyover-in');
  return $('[data-toggle="flyover"]').each(function() {
    var $target, $this, href;
    $this = $(this);
    href = $this.attr('href');
    $target = $($this.data('target') || (href && href.replace(/.*(?=#[^\s]+$)/, '')));

    e = $.Event('hidden.cs.flyover', {
      relatedTarget: this
    });

    $this.removeClass("in");
    return $target.removeClass('in is-transitioning').off('click.dismiss.cs.flyover').trigger(e);
  });
};

old = $.fn.flyover;

$.fn.flyover = function(option, _relatedTarget) {
  return this.each(function() {
    var $this, data, options;
    $this = $(this);
    data = $this.data('cs.flyover');
    options = $.extend({}, CS.Flyover.DEFAULTS, $this.data(), typeof option === 'object' && option);
    if (!data) {
      $this.data('cs.flyover', (data = new CS.Flyover(this, options)));
    }
    if (typeof option === 'string') {
      return data[option](_relatedTarget);
    } else if (options.show) {
      return data.show(_relatedTarget);
    }
  });
};

$.fn.flyover.Constructor = CS.Flyover;

$.fn.flyover.noConflict = function() {
  $fn.flyover = old;
  return this;
};

$(document).on('click.cs.flyover.data-api', '[data-toggle="flyover"]', function(e) {
  var $target, $this, href, option;
  $this = $(e.currentTarget);
  href = $this.attr('href');
  $target = $($this.data('target') || (href && href.replace(/.*(?=#[^\s]+$)/, '')));
  option = $target.data('cs.flyover') ? 'toggle' : $.extend({}, $target.data(), $this.data());
  if ($this.is('a')) {
    e.preventDefault();
  }
  return $target.flyover(option, this);
});

$(document).on('keyup', function(e) {
  if (e.which === 27) {
    return clearFlyovers();
  }
});
