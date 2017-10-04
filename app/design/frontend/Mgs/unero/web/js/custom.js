require([
	'jquery',
	'waypoints'
], function(jQuery){
	(function($) {
		$.fn.appear = function(fn, options) {

			var settings = $.extend({

				//arbitrary data to pass to fn
				data: undefined,

				//call fn only on the first appear?
				one: true,

				// X & Y accuracy
				accX: 0,
				accY: 0

			}, options);

			return this.each(function() {

				var t = $(this);

				//whether the element is currently visible
				t.appeared = false;

				if (!fn) {

					//trigger the custom event
					t.trigger('appear', settings.data);
					return;
				}

				var w = $(window);

				//fires the appear event when appropriate
				var check = function() {

					//is the element hidden?
					if (!t.is(':visible')) {

						//it became hidden
						t.appeared = false;
						return;
					}

					//is the element inside the visible window?
					var a = w.scrollLeft();
					var b = w.scrollTop();
					var o = t.offset();
					var x = o.left;
					var y = o.top;

					var ax = settings.accX;
					var ay = settings.accY;
					var th = t.height();
					var wh = w.height();
					var tw = t.width();
					var ww = w.width();

					if (y + th + ay >= b &&
						y <= b + wh + ay &&
						x + tw + ax >= a &&
						x <= a + ww + ax) {

						//trigger the custom event
						if (!t.appeared) t.trigger('appear', settings.data);

					} else {

						//it scrolled out of view
						t.appeared = false;
					}
				};

				//create a modified fn with some additional logic
				var modifiedFn = function() {

					//mark the element as visible
					t.appeared = true;

					//is this supposed to happen only once?
					if (settings.one) {

						//remove the check
						w.unbind('scroll', check);
						var i = $.inArray(check, $.fn.appear.checks);
						if (i >= 0) $.fn.appear.checks.splice(i, 1);
					}

					//trigger the original fn
					fn.apply(this, arguments);
				};

				//bind the modified fn to the element
				if (settings.one) t.one('appear', settings.data, modifiedFn);
				else t.bind('appear', settings.data, modifiedFn);

				//check whenever the window scrolls
				w.scroll(check);

				//check whenever the dom changes
				$.fn.appear.checks.push(check);

				//check now
				(check)();
			});
		};

		//keep a queue of appearance checks
		$.extend($.fn.appear, {

			checks: [],
			timeout: null,

			//process the queue
			checkAll: function() {
				var length = $.fn.appear.checks.length;
				if (length > 0) while (length--) ($.fn.appear.checks[length])();
			},

			//check the queue asynchronously
			run: function() {
				if ($.fn.appear.timeout) clearTimeout($.fn.appear.timeout);
				$.fn.appear.timeout = setTimeout($.fn.appear.checkAll, 20);
			}
		});

		//run checks when these methods are called
		$.each(['append', 'prepend', 'after', 'before', 'attr',
			'removeAttr', 'addClass', 'removeClass', 'toggleClass',
			'remove', 'css', 'show', 'hide'], function(i, n) {
			var old = $.fn[n];
			if (old) {
				$.fn[n] = function() {
					var r = old.apply(this, arguments);
					$.fn.appear.run();
					return r;
				}
			}
		});
		
		$(document).ready(function(){
			$("[data-appear-animation]").each(function() {
				$(this).addClass("appear-animation");
				if($(window).width() > 767) {
					$(this).appear(function() {

						var delay = ($(this).attr("data-appear-animation-delay") ? $(this).attr("data-appear-animation-delay") : 1);

						if(delay > 1) $(this).css("animation-delay", delay + "ms");
						$(this).addClass($(this).attr("data-appear-animation"));
						$(this).addClass("animated");

						setTimeout(function() {
							$(this).addClass("appear-animation-visible");
						}, delay);

					}, {accX: 0, accY: -150});
				} else {
					$(this).addClass("appear-animation-visible");
				}
			});
			// MEGAMENU JS
			$('.nav-main-menu li.mega-menu-fullwidth.menu-2columns').hover(function(){
				if($(window).width() > 1199){
					var position = $(this).position();
					var widthMenu = $("#mainMenu").width() - position.left;
					$(this).find('ul.dropdown-menu').width(widthMenu);
				}
			});
			
			// $('.nav-main-menu .static-menu li > .toggle-menu a').click(function(){
				 // $(this).toggleClass('active');
				 // $(this).parent().parent().find('> ul').slideToggle();	
			// });
			
			$('.nav-main-menu .dropdown li > a.dropdown-toggle').click(function(){
				if($(window).width() > 1199){
					$(this).attr('href','javascript:void(0)');
					$(this).parent().find('> ul').slideToggle();
				}
			});
						
			// END MEGAMENU
			
			
			// RESPONSIVE
			$('.action.nav-toggle').click(function(){
				if ($('html').hasClass('nav-before-open')) {
					$('html').removeClass('nav-open');
					setTimeout(function () {
						$('html').removeClass('nav-before-open');
					}, 300);
				} else {
					$('html').addClass('nav-before-open');
					setTimeout(function () {
						$('html').addClass('nav-open');
					}, 42);
				}
			});
			$('.close-nav-button').click(function(){
				$('html').removeClass('nav-open');
				setTimeout(function () {
					$('html').removeClass('nav-before-open');
				}, 300);
			});

			$('.minicart-sidebar .action.showcart').click(function(){
				$('html').toggleClass('cart-open');
			});
			$('#close-minicart').click(function(){
				$('.minicart-wrapper').removeClass('active');
				$('html').removeClass('cart-open');
			});
			
			/* Change Form Login or Register */
			$('#change-form .acitve-register').click(function(){
				$('.register-form-header').addClass('open');
				$('.login-form-header').removeClass('open');
				$('#change-form .acitve-login').removeClass('open');
				$(this).addClass('open');
			});
			$('#change-form .acitve-login').click(function(){
				$('.register-form-header').removeClass('open');
				$('.login-form-header').addClass('open');
				$(this).addClass('open');
				$('#change-form .acitve-register').removeClass('open');
			});
			
			$('.closed-login').click(function(){
				$('.register-header').removeClass('before-close');
				setTimeout(function () {
					$('.register-header').removeClass('open');
				}, 300);
			});
			
			$('.toogle-login').click(function(){
				if($('.register-header').hasClass('open')){
					$('.register-header').removeClass('before-close');
					setTimeout(function () {
						$('.register-header').removeClass('open');
					}, 300);
				}else{
					setTimeout(function () {
						$('.search-form').removeClass('active');
					}, 400);
					setTimeout(function () {
						$('.register-header').addClass('open');
					}, 200);
					$('.register-header').addClass('before-close');
				}
				if(!$('.search-form').hasClass('active')){
					$('html').toggleClass('form-open');
				}
			});
			$('.closed-login').click(function(){
				$('html').removeClass('form-open');
			});
			$('.action-search').click(function(){
				if(!$('.register-header').hasClass('open')){
					$('html').toggleClass('form-open');
				}
				setTimeout(function () {
					$('.register-header').removeClass('before-close');
					$('.register-header').removeClass('open');
				}, 400);
			});
			
			
			/* Custom dropdown */
			$('.custom-toggle').click(function(){
				if($(this).hasClass('open')){
					$(this).removeClass('open');
					if($(window).width() < 1200){
						$('.dropdown-custom').slideUp();
					}else{
						$(this).parent().find('> .dropdown-custom').removeClass('open');
					}
				}else{
					if($(window).width() < 1200){
						$('.custom-toggle').removeClass('open');
						$('.dropdown-custom').slideUp();
						$(this).addClass('open');
						$(this).parent().find('> .dropdown-custom').slideDown();
					}else{
						$(this).addClass('open');
						$(this).parent().find('> .dropdown-custom').addClass('open');
					}
				}
			});
            /* Slider Home */
            $( ".slider-background-wrapper .item-content" ).mouseover(function() {
                if(!$(this).hasClass('active')){
                    var elementIndex = $(this).index();
                    $( ".slider-background-wrapper .item-content.active" ).removeClass('active');
                    $(this).addClass('active');
                    $( ".slider-background-wrapper .item-image.active" ).removeClass('active');
                    $( ".slider-background-wrapper .item-image" ).eq(elementIndex).addClass('active');
                }
            });
            $( ".slider-tabs-wrapper .item-content" ).mouseover(function() {
                if(!$(this).hasClass('active')){
                    var elementIndex = $(this).index();
                    $( ".slider-tabs-wrapper .item-content.active" ).removeClass('active');
                    $(this).addClass('active');
                    $( ".slider-tabs-wrapper .item-image.active" ).removeClass('active');
                    $( ".slider-tabs-wrapper .item-image" ).eq(elementIndex).addClass('active');
                }
            });
            
            
            $(document).on("click",".products-grid .product-top > a",function(e){
                if($(window).width() < 992){
                    if(!$(this).hasClass('active')){
                        $('.products-grid .product-top > a.active').removeClass('active');
                        event.returnValue = false;
                        event.preventDefault();
                        $(this).addClass('active');
                    }
                }
            });
		});
	})(jQuery);
});
// Closed minicart 
	
function reInitQuickview($, prodUrl){
	if (!prodUrl.length) {
		return false;
	}
	var url = QUICKVIEW_BASE_URL + 'mgs_quickview/index/updatecart';
	var ratioImage = $('.page-wrapper').attr('data-ratioimage');
    
	$.magnificPopup.open({
		items: {
			src: prodUrl
		},
		type: 'iframe',
		removalDelay: 300,
		mainClass: 'mfp-fade mfp-mgs-quickview ' + ratioImage,
		closeOnBgClick: false,
		preloader: true,
		tLoading: '',
		callbacks: {
            beforeClose: function () {
                $('[data-block="minicart"]').trigger('contentLoading');
                $.ajax({
                    url: url,
                    method: "POST"
                });
            }
		}
	});
}

function setLocation(url) {
    require([
        'jquery'
    ], function (jQuery) {
        (function () {
            window.location.href = url;
        })(jQuery);
    });
}
