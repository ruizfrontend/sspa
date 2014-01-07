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


/**
*
* labTools - fullScreen tools
* ----------------------------------------------
* Requiere:
*   -jquery
*   -Modernizr -> fullscreen
*
* Métodos:
*   -toggleFull
*/

/*global $ */
/*global Modernizr */
/*global _gaq */
/*global console */



if(!labTools) { var labTools = {}; }

labTools.fullScreen = {

/** 
* @method toggleFull labTools.fullScreen.toggleFull
*
* Ejemplo: labTools.fullScreen.toggleFull($body,
*   function(){console.log('fullscreen ready') },
*   function(){console.log('fullscreen ended') },
* )
*
* @param {$element} requerido - Objeto único jquery sobre el que aplicar la pantalla completa
* @param {callbackIn} opcional - Callback a ejecutar una vez pasado a pantalla completa
* @param {callbackOut} opcional - Callback a ejecutar una vez pasado se sale de pantalla completa
*
*/
  toggleFull: function($element, callbackIn, callbackOut){
    var $elem = $element;
    if($element.length !== 1) return;

    var elem = $elem[0];
    if (!document.fullscreenElement && !document.mozFullScreenElement && !document.webkitFullscreenElement) {

      $(document).unbind("fullscreenchange webkitfullscreenchange mozfullscreenchange");
      $(document).bind("fullscreenchange webkitfullscreenchange mozfullscreenchange", function(){
        if(document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement) return;
        labTools.fullScreen.toggleFull($element, callbackIn, callbackOut);
      });

      if (elem.requestFullscreen) {
        elem.requestFullscreen();
      } else if (elem.mozRequestFullScreen) {
        elem.mozRequestFullScreen();
      } else if (elem.webkitRequestFullscreen) {
        elem.webkitRequestFullscreen();
      }
      if(callbackIn) callbackIn();
    } else {

      $(document).unbind("fullscreenchange webkitfullscreenchange mozfullscreenchange");
      
      if (document.cancelFullScreen) {
        document.cancelFullScreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitCancelFullScreen) {
        document.webkitCancelFullScreen();
      }
      if(callbackOut) callbackOut();
    }

    return false;
  },
/** 
* @method isFullScreenEnabled labTools.fullScreen.isFullScreenEnabled
*   devuelve true si estamos en modo fullscreen
*/
  isFullScreenEnabled: function(){
    if(!document.fullscreenElement &&    // alternative standard method
      !document.mozFullScreenElement && !document.webkitFullscreenElement){
      return false;
    } else {
      return true;
    }
  },
};

// comprueba dependencias
try { $(); } catch(e) { console.error('labTools error: Error inicializando "FullScreen". jQuery no definido. '); }
try { Modernizr && Modernizr.fullscreen; } catch(e) { console.error('labTools error: Error inicializando "FullScreen". Se requiere Modernizr y el módulo Fullscreen. '); }

