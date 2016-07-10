'use strict';

window.onload = function() {
  var object_carousel = document.querySelector('.ch-carousel');
  var options_carousel = {
    'arrows': true,
    'limitPerPage': 3,
    'pagination': false
  };
  var carousel = new ch.Carousel(object_carousel, options_carousel);
};