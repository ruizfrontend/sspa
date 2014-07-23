
/*    ________________________________________________
     _____/\/\____________/\/\______/\/\/\/\/\_______
    _____/\/\__________/\/\/\/\____/\/\____/\/\_____
   _____/\/\________/\/\____/\/\__/\/\/\/\/\_______
  _____/\/\________/\/\/\/\/\/\__/\/\____/\/\_____
 _____/\/\/\/\/\__/\/\____/\/\__/\/\/\/\/\_______
________________________________________________
          ________________________________________________________________ 
         _____/\/\/\/\/\____/\/\/\/\/\/\__/\/\____/\/\__/\/\/\/\/\/\_____ 
        _____/\/\____/\/\______/\/\______/\/\____/\/\__/\_______________ 
       _____/\/\/\/\/\________/\/\______/\/\____/\/\__/\/\/\/\/\_______ 
      _____/\/\__/\/\________/\/\________/\/\/\/\____/\/\_____________ 
     _____/\/\____/\/\______/\/\__________/\/\______/\/\/\/\/\/\_____ 
    ________________________________________________________________ 
____________ Diseño: Ismael Recio, Redacción: Alberto Fernández / Miriam Hernanz, Realización: César Vallejo / Miguel Campos 
Desarrollo: David Ruiz / Francisco Quintero / Carlos Jiménez Delgado @2013__________________________ */

'use strict';
/*global labTools */
/*global Modernizr */
/*global $ */

// Objeto principal 
// -----------------------------------------------------------------------------------

var app = {
  init: function() {
    // gestión de urls____________________________________________________________________
    if(labTools.url) {
      labTools.url.initiate(<%= jsNamespace %>.handleUrlOnReady, <%= jsNamespace %>.handleUrlOnChange);
    }

      // inicializando video____________________________________________________________
    //labTools.media.init();

      // redimensionados____________________________________________________________
    $(window).bind('orientationchange resize', <%= jsNamespace %>.handleResize).trigger('resize');

      // eventos scroll ____________________________________________________________
    $('body, html').add(document).add(window).bind('scroll', <%= jsNamespace %>.scrollHandler);//.trigger('scroll');

  },
          // función control de redimensionados______________________________________________________
  handleResize: function() {
    <%= jsNamespace %>.cache.winWidth = <%= jsNamespace %>.cache.$window.width();
    <%= jsNamespace %>.cache.winHeigth = <%= jsNamespace %>.cache.$window.height();

    // mi_modulo.handleResize()
  },
          // control de scroll______________________________________________________
  scrollHandler: function(e) {
    // mi_modulo.scrollHandler()
  },
          // función control de las urls______________________________________________________
  handleUrlOnChange: function(url) {

  },
  handleUrlOnReady: function(url) {

  },
};

// Almacenamiento en general
// -----------------------------------------------------------------------------------
<%= jsNamespace %>.cache = {
  $window: $('window'),

  winWidth: 0,                            // tamaños de cosas
  winHeigth: 0,
};


// DOCUMENT READY
// ----------------------------------------------------------------------------------------------------------------
// ----------------------------------------------------------------------------------------------------------------

$( document ).ready(function() {

  <%= jsNamespace %>.init();

});

// http://www.paulirish.com/2011/requestanimationframe-for-smart-animating/
// shim layer with setTimeout fallback
window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          function( callback ){
            window.setTimeout(callback, 1000 / 60);
          };
})();

