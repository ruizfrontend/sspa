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

// Variables
// -----------------------------------------------------------------------------------
console.log(Modernizr.video);
// Funciones
labTools.fns = {
  // Funciones relacionadas con la pulsacion de una tecla
  keyboard: {
    // Funcion que captura el evento de pulsacion de una tecla y gestiona el comportamiento de la aplicacion
    
    // + Si se pulsan las teclas:
    //        33      Page Up
    //        37      Left arrow
    //        38      Up arrow    
    // Iremos al Slide previo

    // + Si se pulsan las teclas:
    //        32      Space
    //        34      Page Down
    //        39      Right arrow
    //        40      Down arrow    
    // Iremos al Slide siguiente

    // + Si se pulsa la tecla:
    //        35      End
    // Iremos al último Slide

    // + Si se pulsa la tecla:
    //        36      Home       
    // Iremos al primer Slide    
    keyboardEvent: function(tecla) {

      //labTools.console.log("tecla.keyCode: " + tecla.keyCode)

      // Space: 32    
      // Re Pag: 33
      // Av Pag: 34
      // Fin: 35
      // Inicio: 36    
      // Tecla <-: 37
      // Tecla |: 38    
      // Tecla ->: 39
      // Escape: 27

      if ( tecla.keyCode == 37 || tecla.keyCode == 33 || tecla.keyCode == 38 ) {

      } else if ( tecla.keyCode == 39 || tecla.keyCode == 34 || tecla.keyCode == 32 || tecla.keyCode == 40 ) {

      } else if ( tecla.keyCode == 35 ) {

      } else if ( tecla.keyCode == 36 ) {

      } else if ( tecla.keyCode == 27 ) {

      }

    }
  }
};

// DOCUMENT READY
// ----------------------------------------------------------------------------------------------------------------
// ----------------------------------------------------------------------------------------------------------------

/*$( document ).ready(function() {

  // Traza
  labTools.console.log('Ready.... go');

  // fullscreen
  // -----------------------------------------------------------------------------------
  if(Modernizr.fullscreen){
     $('.butt-fullsc, #toggle-full').show().bind('click', function(){});
   }

  // Control de la navegacion
  // -----------------------------------------------------------------------------------

    // eventos del teclado
  $('body').keydown(function(){});

    // ajustamos tamaños de extras al redimensionar
  $(window).bind('orientationchange resize', function(){

  }).trigger("resize");

  return false;
)}

document.addEventListener("DOMContentLoaded", function(event) {
  labTools.url.initiate(function(){ }, function(url){
    if(!url){

    } else {

    }
    
    return  false;
  });
});
*/