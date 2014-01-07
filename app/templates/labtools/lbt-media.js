 /*    _______________________________________________ 
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
* labTools - Media tools
* ----------------------------------------------
* Requiere:
*   -jquery
*   -Modernizr -> video
*   - lbt-media.css -> si se quieren los controles de video del lab
*
* Métodos:
*   -init -> determina formatos
*   -generaVideo -> genera dinámicamente un video
*   -videosWipeOut -> elimina todos los videos del documentos
*/

/*global $ */
/*global Modernizr */
/*global _gaq */
/*global console */

'use strict';

if(!labTools) { var labTools = {}; }

  // comprueba dependencias
try { $(); } catch(e) { console.error('labTools error: Error inicializando "FullScreen". jQuery no definido. '); }
try { Modernizr && Modernizr.audio && Modernizr.video; } catch(e) { console.error('labTools error: Error inicializando "FullScreen". Se requiere Modernizr y sus módulos video y audio. '); }

labTools.media = {

/** 
* labTools.media.data
* --------------------------------
* datos del módulo
*/
  data: {
      // extensiones detectadas para los medias (requiere )
    videoExtension: null,
    audioExtension: null,
      // valores por defecto a la hora de generar un video 
    initialSettings: {
          // enable controls: false -> no, 'auto' -> html5 controls, 'lab' -> our controls 
      controls: false,
          // preload: the html5 attributo
      preload: false,
          // autoplay: the html5 attributo
      autoplay: false,
          // loop: the html5 attributo
      loop: false,
          // force video size -> units in pixels
      width: null,
      height: null,
          // poster: the html5 poster image url
      poster: null
    }
  },

/** 
* labTools.media.init()
* --------------------------------
*   Inicio general, preparando las extensiones admitidas por el navegador
* 
* @method init
*/
  init: function() {
    labTools.media.data.videoExtension = Modernizr.video.h264 ? '.mp4' : Modernizr.video.webm ? '.webm' : Modernizr.video.ogg ? '.ogv' : null;
    labTools.media.data.audioExtension = Modernizr.audio.mp3 ? '.mp3' : Modernizr.audio.ogg ? '.ogg' : null;
    return false;
  },

/** 
* labTools.media.generaVideo()
* --------------------------------
*   Genera un reproductor de video en un wrapper al que se añade la clase video-ready
*
* Ejemplor: 
*
*     labTools.media.generaVideo($('.video-gen'), 'http://video.lab.rtve.es/resources/TE_NGVA/mp4/2013/jfk/video-zampruder-slow-b', {controls: true})
*
*   Y con el html
*
*     <div class="video-gen"></div>
*
*   nos carga el video dentro del div con las extensiones adecuadas, con o si controles
* 
* @method generaVideo
* @prop $wrapper -> el elemento que contendrá el video
* @prop videoFile -> archivo de video SIN EXTENSION a cargar (la extensión por defecto se obtiene en labTools.media.init() )
* @prop settings -> objeto de propiedades que extiende a labTools.media.data.initialSettings
*/

  generaVideo: function ($wrapper, videoFile, settings) {
      // si no se ha iniciado el tema, lo iniciamos
    if(!labTools.media.data.videoExtension) labTools.media.init();

    if(!$wrapper.length || !videoFile || $wrapper.hasClass('video-ready')) return;

        // aumenta las propiedades por defecto
    var defaults = jQuery.extend({}, labTools.media.data.initialSettings);
    defaults = jQuery.extend(labTools.media.data.initialSettings, settings);

      // genera el marcado del video
    var $newVideo = $('<video class="introVideo" webkit-playsinline=""/>');
    $newVideo.attr('src', videoFile + labTools.media.data.videoExtension);
    if(defaults.controls == 'auto') $newVideo.attr('controls', 'controls');
    if(defaults.autoplay) $newVideo.attr('autoplay', 'autoplay');
    if(defaults.loop) $newVideo.attr('loop', 'loop');
    if(defaults.preload) {
      $newVideo.attr('preload', 'preload');
      $newVideo.attr('autobuffer', 'autobuffer');
    };
    if(defaults.poster) $newVideo.attr('poster', defaults.poster);
    if(defaults.width) $newVideo.attr('width', defaults.width);
    if(defaults.height) $newVideo.attr('height', defaults.height);

      // inserta el video y lo carga
    $wrapper.append($newVideo);
    $wrapper.find('video')[0].load();

      // si controls esta definido y no es auto, asumimos que dibujamos los controles del lab 
    if(defaults.controls && defaults.controls != 'auto') {
          // generamos los controles
      var $controls = $('<div class="bl-controls"><div class="bl-time-bar"><div class="bl-time-bar-pos" style="width: 0%;"></div></div><a href="#" class="toggleVid">Pausa/Reanuda la reproducción</a><span class="bl-time">00:00/00:22</span></div>');

      if(labTools.fullScreen && Modernizr.fullscreen) {
        var $full = $controls.append('<a href="#" class="toggleFull wk-col-r" title="muestra en pantalla completa"></a>').find('.toggleFull');
        $full.click(function(){
          labTools.fullScreen.toggleFull($wrapper);
        });
      }

      $newVideo.bind('timeupdate', function(){
        //if(labTools.data.canvas) jfk.updateCanvas();
        var position = this.currentTime;
        var timeOk = labTools.media.tools.getTextSeconds(position);
        var total = this.duration;
        var totalOk = labTools.media.tools.getTextSeconds(total);
        if(position && total) {
          $controls.find('.bl-time').html(timeOk + '/' + totalOk);
          $controls.find('.bl-time-bar-pos').css('width', 100 * position / total + '%');
        } else {
          $controls.find('.bl-time').html('00:00/--:--');
          $controls.find('.bl-time-bar-pos').css('width', 0);
        }
      });

        // eventos del boton de play
      $controls.find('.toggleVid').click(function(){
        if($newVideo[0].paused) {
          $newVideo[0].play();
          $(this).addClass('playing');
        } else {
          $newVideo[0].pause();
          $(this).removeClass('playing');
        }
        return false;
      });

        // eventos al pulsar la barra de tiempo
      $controls.find('.bl-time-bar')
        .mousedown(function(e){
          if(!$newVideo[0].currentTime) return false;
          labTools.media.data.timerMouseDown = true;
          return false;
        })
        .mouseup(function(e){
          if(!$newVideo[0].currentTime) return false;
          labTools.media.data.timerMouseDown = false;
          return false;
        })
        .mousemove(function(e){
          if(!labTools.media.data.timerMouseDown) return false;
          $newVideo[0].currentTime = $newVideo[0].duration * (e.pageX - $(this).offset().left) / $(this).width();
          $newVideo.trigger('timeupdate');
          return false;
        })
        .click(function(e){
          $newVideo[0].currentTime = $newVideo[0].duration * (e.pageX - $(this).offset().left) / $(this).width();
          $newVideo.trigger('timeupdate');
          return false;
        });

      $wrapper.append($controls);
    }

      //  eventos relacionados con la carga
    if(defaults.readyCallback){
      if (labTools.data.video.readyState === 4){
        defaults.readyCallback();
      } else {
        $video.bind('canplaythrough loadeddata canplay', function(){
          defaults.readyCallback();
          $(this).unbind('canplaythrough loadeddata canplay');
        })
      }
    }

    $wrapper.addClass('video-ready');

    return $wrapper;
  },

/** 
* labTools.media.eliminaVideo()
* --------------------------------
*   Elimina un video, dejando su wrapper intacto
* 
* @method generaVideo
* @prop $videoWrap -> el wrapper del video con el que generado
*/
  eliminaVideo: function($videoWrap) {
    $videoWrap.removeClass('video-ready');
    $videoWrap.html('');
    return true;
  },
/** 
* labTools.media.videosWipeOut()
* --------------------------------
*   Elimina todos los videos del documento
* 
* @method videosWipeOut
*/
  videosWipeOut: function(){
    $('.video-ready').find('video').remove();
    $('.video-ready').find('.bl-controls').remove();
    $('.video-ready').removeClass('video-ready');
  },

/** 
* labTools.media.audiosWipeOut()
* --------------------------------
*   Elimina todos los audios del documento
* 
* @method audiosWipeOut
*/
  audiosWipeOut: function(){

    $('.audio-ready').find('audio').remove();
    $('.audio-ready').find('.bl-controls').remove();
    $('.audio-ready').removeClass('audio-ready');
  }, 

/** 
* labTools.media.stopMediaReproduction()
* --------------------------------
*   Para la reproducción de todos los audios/videos del documento y reinicia sus tiempo (!important)
* 
* @method audiosWipeOut
*/     
  stopMediaReproduction: function() {

    var $videos  = $('video');
    var $audios  = $('audio');

    // Paramos la reproduccion de videos
    if (typeof $videos != "undefined") {

      for (var index = 0; index < $videos.length; ++index) {
        
        var video = $videos[index];

        try  {

          if(video){

            $(video).unbind('canplaythrough canplay stalled error abort ended'); // <-  mirar esto!
            video.currentTime = 0;
            video.pause();

          }
        } catch(err) { }

      }
    }

    // Paramos la reproduccion de audios
    if (typeof $audios != "undefined") {

      for (var index = 0; index < $audios.length; ++index) {
        
        var audio = $audios[index];
        
        try  {

          if(audio){

            audio.currentTime = 0;
            audio.paused = true;
          }

        } catch(err) { }

      }
    }


  },

/** 
* labTools.media.tools
* --------------------------------
*   Métodos de ayuda
* 
*/
  
  tools: {

/** 
* labTools.media.tools.getTextSeconds()
* --------------------------------
*   Convierte un número de segundos al formato 00:00, o 00:00:000 si ms es true
* 
* @method generaVideo
* @prop seconds -> numero de segundos,
* @prop ms -> bool -> escribe tambien con milisegundos
*/
    getTextSeconds: function(seconds, mls) {
      var mins = Math.floor((seconds % 3600) / 60);
      var secs = Math.floor((seconds % 3600) % 60);
      var ms = parseInt(1000*(seconds-secs-(60*mins)));
      mins = mins.toString().length == 2 ? mins : '0' + mins;
      secs = secs.toString().length == 2 ? secs : '0' + secs;
      if( mls ){
        ms = ms.toString().length == 2 ? ms + '0' : ms;
        ms = ms.toString().length == 1 ? ms + '00' : ms;
        return mins + ':' + secs + ':' + ms;
      } else {
        return mins + ':' + secs;
      }
    }

  }
};
