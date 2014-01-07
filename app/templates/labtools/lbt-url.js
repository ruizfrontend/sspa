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
* labTools - Url tools
* ----------------------------------------------
* Funciones relacionadas con el tratamiento de la URL que aparece en el navegador  
* Requiere:
*   -jquery
*   -Modernizr -> history
*
* Métodos:
*   -initiate
*   -setUrl  -> fuerza el cambio de url
*   -changePopstate (no usar) -> ejecutado si el navegador cambia de url
*/

/*global $ */
/*global Modernizr */
/*global _gaq */
/*global console */

'use strict';

if(!labTools) { var labTools = {}; }

labTools.url = {

/** 
* labTools.url.data
* --------------------------------
* datos del módulo
*/
  data: {
      // url base del proyecto !!!CAMBIAR EN EL PROYECTO -> data.baseUrl = 'miurl'
    baseUrl: '/aniversario-asesinato-kennedy',
      // está activado analitics o no
    ga: false,
        // ----- no tocar ------------------------------------------------------------------------------------------------
      // detectamos si se ha cambiado el popstate inicial, y si no se fuerza (xa firefox)
    initialPopstate: false,
      // calback que se ejecutaría cuando cambie un url (manual o automáticamente -> flechas de antes y despues)
        //@param {callbackOnChange} - callback, opcional -> función a ejecutar cada vez que una url cambie
    callbackOnChange: false
  },

/** 
* labTools.url.initiate
* --------------------------------
*   Inicio general, asociando el evento general para los cambios de url, 
* 
* Ejemplo: labTools.url.initiate(false, 
*    function(){ console.log('ready to change urls'); },
*    function(url){console.log('nueva url: ', url); }
* )
* 
* @method initiate 
* @param {ga} - booleano -> usamos google analitcos?
* @param {callbackOnChange} - callback, opcional -> función a ejecutar cada vez que una url cambie
*     @param {finalUrl} - parámetro para el callback con la url actual
*/
  initiate: function(callbackOnUrlReady, callbackOnChange) {

    if(!Modernizr.history) return; // navegador no compatible

    if(callbackOnChange) labTools.url.data.callbackOnChange = callbackOnChange;

      // el evento en si
    $(window).bind("popstate", labTools.url.changePopstate);

        // webkit lanza el evento al asociarse, firefox no, por lo que lo forzamos
    setTimeout(function(){
      if(!labTools.url.data.initialPopstate) labTools.url.changePopstate();
      if(callbackOnUrlReady) callbackOnUrlReady();
    } , 100);
  },

/** 
* labTools.url.setUrl
* --------------------------------
*   Forzamos un cambio de url manual
*
* Ejemplo: labTools.url.setUrl('/urlmoderna/paginaka')
*
* @method setUrl 
* @param {url} - url relativa a labTools.data.baseUrl a la que vamos a cambiar
* @param {callbackOnChange} - callback, opcional -> función a ejecutar cada vez que una url se cambie
*/
  setUrl: function(url) { // changes manually the url

        if(labTools.console) labTools.console.log('push ', url);

    if(!Modernizr.history) return;
    
    if(url != '/'){
      history.pushState(null, null, labTools.url.data.baseUrl + url); // the real thing
    }

    if(labTools.url.data.ga) _gaq.push(['_trackPageview', labTools.url.data.baseUrl + url]);

    //labTools.url.changePopstate(url);
  },

/** 
* labTools.url.changePopstate
* --------------------------------
*   función que llama el navegador al actualizar la url
* @method changePopstate
*/
  changePopstate: function() {

    labTools.url.data.initialPopstate = true;

      // url real
    var finalUrl = location.pathname.substr(labTools.url.data.baseUrl.length);
    if(finalUrl[finalUrl.length-1] == '/') finalUrl = finalUrl.substr(0,finalUrl.length-1);

    if(labTools.url.data.callbackOnChange) labTools.url.data.callbackOnChange(finalUrl);

        if(labTools.console) labTools.console.log('popstate: ', finalUrl);
  },

/** 
* labTools.url.getUrl
* --------------------------------
*   Limpia una cadena para hacerla una url válida
* @method getUrl
* @param {str} - la cadena a convertir
*/
  getUrl: function(str) {
    str = str.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
    str = str.replace(",", '');
    str = str.replace(new RegExp("[áÁ]", "g"),'a');
    str = str.replace(new RegExp("[éÉ]", "g"),'e');
    str = str.replace(new RegExp("[Íí]", "g"),'i');
    str = str.replace(new RegExp("[Óó]", "g"),'o');
    str = str.replace(new RegExp("[Úú]", "g"),'u');

    str = str.replace(new RegExp("[ñÑ]", "g"),'n');
    return encodeURIComponent(str.replace(new RegExp(" ", "g"),"-")).toLowerCase();
  },
};

  // comprueba dependencias
try { $(); } catch(e) { console.error('labTools error: Error inicializando "Url". jQuery no definido. '); }
try { Modernizr && Modernizr.history != 'undefined'; } catch(e) { console.error('labTools error: Error inicializando "Url". Se requiere Modernizr y el módulo history. '); }
