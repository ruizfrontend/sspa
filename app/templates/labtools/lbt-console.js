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

/**
*
* labTools - Console tools
* ----------------------------------------------
* Funciones básicas de logeado
*
* Métodos:
*   -log -> pues eso
*   -error -> pues parecido
*/

/*global $ */
/*global Modernizr */
/*global _gaq */
/*global console */

'use strict';

if(!labTools) { var labTools = {}; }

labTools.console = {
  // Funcion que muestra por la consola el log de errores/traza
  log: function(texto){
    if (console && console.log && labTools.console.data.log) console.log.apply(console, arguments);
  },
  error: function(text){
    if (console && console.error && labTools.console.data.log) console.error.apply(console, arguments);
  },
  data: {
    log: false
  }
};
