
/**
 * Copyright © 2016 Magento. All rights reserved.
 * See COPYING.txt for license details.
 */
define([
    'jquery',
    'mage/smart-keyboard-handler',
    'mage/mage',
    'mage/ie-class-fixer',
    'domReady!'
], function ($, keyboardHandler) {
    'use strict';

    if ($('body').hasClass('checkout-cart-index')) {
        if ($('#co-shipping-method-form .fieldset.rates').length > 0 && $('#co-shipping-method-form .fieldset.rates :checked').length === 0) {
            $('#block-shipping').on('collapsiblecreate', function () {
                $('#block-shipping').collapsible('forceActivate');
            });
        }
    }

    $('.cart-summary').mage('sticky', {
        container: '#maincontent'
    });

    $('.panel.header > .header.links').clone().appendTo('#store\\.links'); 
	$(document).ready(function(){
		$('#switcher-language').clone().appendTo('.language');
		$('#switcher-currency').clone().appendTo('.currency');
		$('header .search-form').clone().appendTo('.top-search');
		$('#main-Menucontent').clone().appendTo('.megamenu-click');
		$('#main-Menucontent').clone().appendTo('.megamenu-hover');
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
	
    keyboardHandler.apply();
});
