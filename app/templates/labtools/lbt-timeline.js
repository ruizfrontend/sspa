/*  Timeline.js
/* --------------------------------
@ruizfrontend @2013__________________________ */

/**
*
* labTools - Media tools
* ----------------------------------------------
* Requiere:
*   - jquery
*   - moment.js
*
* Métodos:
*   -generate -> inicializacion
*   -generaVideo -> genera dinámicamente un video
*   -videosWipeOut -> elimina todos los videos del documentos
*/

/*global $ */
/*global Modernizr */
/*global _gaq */
/*global console */
/*global moment */

'use strict';
moment.lang('es');

(function( $ ) {
 
  $.fn.tmline = function( settings ) {
      // si se devuelve un objecto, es
    if(typeof settings === 'object') {
      
    } else {
      switch(settings){
        case 'destroy':
          console.log('destroy')
        break;
      }
    }
  }

})

if(!labTools) { var labTools = {}; }

  // comprueba dependencias
try { $(); } catch(e) { console.error('labTools error: Error inicializando "FullScreen". jQuery no definido. '); }
try { Modernizr && Modernizr.audio && Modernizr.video; } catch(e) { console.error('labTools error: Error inicializando "FullScreen". Se requiere Modernizr y sus módulos video y audio. '); }

labTools.Timeline = {

/** 
* labTools.Timeline.data
* --------------------------------
* datos del módulo
*/
  data: {

      // ----- no tocar -> pasar objecto de preferencias -------------------
      // valores por defecto a extender al inicializar el modulo -> labTools.Timeline.generate(data, {'width': 300})
    initialSettings: {
          // the dimensions of the containe
      width: 1198,
      height: 540,
          // the width of the canvas
      totalWidth: 10000,
          // the initial position, related to the full width
      initialPos: 0.5,
          // the width of each element related to the container width
      elmWidth: 0.9,
          //shoul we draw the pager
      pager: true,
          //shoul we draw the years ruler
      timer: true,
          //shoul we draw the years ruler
      bg: false,
          //shoul we draw the timeline
      initialCard: 0,
          //format
      format: 'year'
    },
      // el timeline
    $timl: null,
      // la maximas fechas del conjunto de datos
    dateMin: null,
    dateMax: null,
      // the real data
    csv: null,
      //datos calculados de ayuda
    yearIni: null,  // año de inicio a dibujar
    yearEnd: null,  // año de final a dibujar
    yearDiff: null,  // numero de años dibujados
    initialDate: null, // fecha de inicio
    activeCard: null
  },

/** 
* labTools.Timeline.generate()
* --------------------------------
*   Inicio general, preparando las extensiones admitidas por el navegador
* 
* @method init
*/
  generate: function ($wrapper, data, settings){

    if($wrapper.length != 1) { labTools.console.error('El wraper del Timeline no está correctamente definido.'); return false; }

      // extiendo las preferencias iniciales y guardo un shortcut
    if(settings) $.extend(labTools.Timeline.data.initialSettings, settings);

    labTools.Timeline.data.$timl = $wrapper;
    labTools.Timeline.data.csv = data;

      // procesa el array
      // --------------------------------
    labTools.Timeline.data.csv = labTools.Timeline.fns.processData(data);

      // pinta y colorea
      // --------------------------------
    labTools.Timeline.fns.pintaYcolorea();

    labTools.Timeline.fns.gotoCard(labTools.Timeline.data.initialSettings.initialCard);

  },
  fns: {
      // procesando el array de datos
    processData: function() {
          // para no escribit tanto
      var data = labTools.Timeline.data;

      for (var i = 0; i < data.csv.length; i++) {

          // error si encuentra datos sin fecha inicial
        if(!data.csv[i]['Start Date']) labTools.console.error('Hay datos sin fecha inicial: ', data.csv[i]['Start Date']);

            // si no hay fecha final -> ponemos la incial
        if(!data.csv[i]['End Date']) { data.csv[i]['End Date'] = data.csv[i]['Start Date']; }

        data.csv[i].END = moment(data.csv[i]['End Date']);
        data.csv[i].INI = moment(data.csv[i]['Start Date']);

          // lanza errores para fechas invalidas
        if(!data.csv[i].END.isValid()) labTools.console.error('Fecha erronea: ', data.csv[i]['End Date']);
        if(!data.csv[i].INI.isValid()) labTools.console.error('Fecha erronea: ', data.csv[i]['Start Date']);

          // fecha media, osea, donde estara el marcador
        data.csv[i].MID = data.csv[i].INI.add('ms', (data.csv[i].END.diff(data.csv[i].INI)/2));

        if(!data.dateMin) data.dateMin = data.csv[i].INI;
        if(!data.dateMax) data.dateMax = data.csv[i].INI;

        data.dateMin = data.dateMin.isAfter(data.csv[i].MID) ? data.csv[i].MID : data.dateMin;
        data.dateMax = data.dateMax.isBefore(data.csv[i].MID) ? data.csv[i].MID : data.dateMax;

      }

        // ordenamos array
      var csvSort = data.csv.sort(function(a, b){ return a.MID.isAfter(b.MID) ? true : false; });

        // datos utiles
      labTools.Timeline.data.yearDiff = data.dateMin.year() - data.dateMax.year();
      labTools.Timeline.data.yearIni = data.dateMin.year() + parseInt(labTools.Timeline.data.yearDiff / 6,10);
      labTools.Timeline.data.yearEnd = data.dateMax.year() - parseInt(labTools.Timeline.data.yearDiff / 6,10);

      labTools.Timeline.data.initialDate = moment({'year': labTools.Timeline.data.yearIni});

        // calculo tamaños para años 
      labTools.Timeline.data.pixelsPerMilisecond = labTools.Timeline.data.initialSettings.totalWidth /
        (moment({'year': labTools.Timeline.data.yearEnd}).diff(moment({'year': labTools.Timeline.data.yearIni})));

      labTools.Timeline.data.pixelsPerMilisecond2 = labTools.Timeline.data.initialSettings.width /
        (moment({'year': labTools.Timeline.data.yearEnd}).diff(moment({'year': labTools.Timeline.data.yearIni})));

      labTools.Timeline.data.pixelsPerYear = labTools.Timeline.data.pixelsPerMilisecond * 31536000730;

      labTools.Timeline.data.pixelsPerYear2 = labTools.Timeline.data.pixelsPerMilisecond2 * 31536000730;

        // cache the positions of the elements for faster scrolling
      for (var i = 0; i < data.csv.length; i++) {
        data.csv[i].posLeft = labTools.Timeline.fns.getLeftDateScroll(data.csv[i]);
      }

      return csvSort;
    },
      // dibuja todos los componentes
    pintaYcolorea: function() {
          // para no escribit tanto
      var settings = labTools.Timeline.data.initialSettings;
      var data = labTools.Timeline.data.csv;

          // primeros estilos, y genero wrapper
      var $inn = labTools.Timeline.data.$timl
        .addClass('timl-main')
        .css({width: settings.width, height: settings.height})
        .append('<div class="timl-wrap"><div class="timl-inn"></div></div>')
        .find('.timl-inn')
          .css({
            width: settings.totalWidth,
          });

          // draw the pager
      if(settings.pager) {

        var $pager = labTools.Timeline.data.$timl
          .append('<div class="timl-pager">')
          .find('.timl-pager');

        $pager.append('<div class="timl-pager-left"><</div><div class="timl-pager-right">></div>');

        $pager.find('.timl-pager-left').bind('click', labTools.Timeline.fns.tlGoPrev);

        $pager.find('.timl-pager-right').bind('click', labTools.Timeline.fns.tlGoNext);

      }

          // draw the other ruler
      if(settings.timer) {
        var $ruler = labTools.Timeline.data.$timl
          .append('<div class="timl-ruler">')
          .find('.timl-ruler');

        for (var i = labTools.Timeline.data.yearIni; i < labTools.Timeline.data.yearEnd; i++) {
          if(i%10 === 0) {
            $ruler.append('<div class="timl-timer-yr timl-timer-10"><span>'+i+'</span></div>');
          } else {
            $ruler.append('<div class="timl-timer-yr"></div>');
          }
        }

        $ruler.find('.timl-timer-yr').each(function(){
          var $this = $(this);
          if($this.index()%2) $this.addClass('timl-timer-yr-par');
        });

        labTools.Timeline.data.$timl.find('.timl-timer-yr').css('width', labTools.Timeline.data.pixelsPerYear2);

        for (var j = 0; j < data.length; j++) {
          var $Relm = $('<div class="timl-timer-elm"><span>'+data[j].Headline+'</span></div>');
          if(data[j]['Start Date'] && data[j]['Start Date']!= data[j]['End Date']) {
            var rWidth = labTools.Timeline.fns.getDateinPixels2(data[j]['End Date']) - labTools.Timeline.fns.getDateinPixels2(data[j]['Start Date']);
              if(rWidth<10) rWidth = 10;
          } else {
            var rWidth = 10;
          }
          $Relm.css({'left': labTools.Timeline.fns.getDateinPixels2(data[j]['Start Date']), width: rWidth});
          $ruler.append($Relm);
        }

        $ruler.find('.timl-timer-elm').click(function(){
          $ruler.find('.timl-timer-elm-act').removeClass('timl-timer-elm-act');
          var $this = $(this);
          $this.addClass('timl-timer-elm-act');
          var elmNum = $this.index('.timl-timer-elm');
          labTools.Timeline.fns.gotoCard(elmNum);
          return false;
        });

        /*$ruler.click(function(e){
          var ofset = e.pageX - $(e.delegateTarget).offset().left;
          var posX = settings.totalWidth * ofset / settings.width;
          labTools.Timeline.data.$timl.find('.timl-wrap').animate({scrollLeft: posX},400);
        });*/
      }
          // draw the background
      if(settings.bg) {

        var $timer = labTools.Timeline.data.$timl.find('.timl-inn')
          .append('<div class="timl-timer">')
          .find('.timl-timer');

        for (var k = labTools.Timeline.data.yearIni; k < labTools.Timeline.data.yearEnd; k++) {
          if(k%5 == 0) {
            $timer.append('<div class="timl-timer-yr timl-timer-10"></div>');
          } else {
            $timer.append('<div class="timl-timer-yr"></div>');
          }
        };

        $timer.find('.timl-timer-yr').each(function(){
          var $this = $(this);
          if($this.index()%2) $this.addClass('timl-timer-yr-par');
        })

        $timer.find('.timl-timer-yr').css('width', labTools.Timeline.data.pixelsPerYear);
      }

      $('.timl-main').find('.timl-wrap').scroll( labTools.Timeline.fns.onScroll );

        // dibuja las fichas
      for (var i = 0; i < data.length; i++) {
          // el Elemento
        var $elm = $('<div class="timl-elm"></div>')
          .css({
            width: settings.width * settings.elmWidth, 
            'margin-left': -1 * settings.width * settings.elmWidth / 2,
            left: labTools.Timeline.fns.getLeftDateCenter(data[i])
          })
          .data('slide', i) //identify the slide
          .addClass('timl-elm-'+(i%3)); 

          // en $main ponemos las cosas
        var $main = $elm;

          // pintamos MEDIA
        if(data[i]['Media']) {
          var $main = $elm.append('<div class="wrap-media tml-elm-wrap clearfix"></div>').find('.wrap-media');
          var $media = $main.append('<div class="wrap-media-left"></div>').find('.wrap-media-left'); // pongo left aunque no tiene que estar a la izquierda

            // pintamos youtube
          if(data[i]['Media'].indexOf('youtube.com')!= -1){

              // get video id
            var utbUrl = labTools.Timeline.fns.getYoutubeVideoId(data[i]['Media']);
              // y si no falla, insertamos el iframe
            if(utbUrl) {
              $media.append('<iframe src="http://www.youtube.com/embed/'+utbUrl+'?enablejsapi=1&amp;color=white&amp;showinfo=0&amp;theme=light&amp;start=0&amp;rel=0&amp;" frameborder="0" allowfullscreen></iframe>')
            };

            // pintamos foto
          } else if(data[i]['Media'].indexOf('.jpg')!= -1 || data[i]['Media'].indexOf('.png')!= -1 || data[i]['Media'].indexOf('.gif')!= -1) {
            $media.append('<img src="'+data[i]['Media']+'">');

            // video del lab
          } else if(data[i]['Media'].indexOf('TE_NGVA')!= -1) {
            $media.append('<div class="video-wrap" data-vid="'+data[i]['Media']+'">');

            labTools.media.generaVideo($media.find('.video-wrap'), data[i]['Media'], {controls: 'auto' });

            // no sepo que es
          } else {

            labTools.console.error('Este media no es ni youtube ni imagen: ', data[i]['Media']);
          }

        } else {
          var $main = $elm.append('<div class="tml-elm-wrap clearfix"></div>').find('.tml-elm-wrap');
        }

          // pintamos TEXTOS
        var $textos = $main.append('<div class="wrap-textos"></div>').find('.wrap-textos')

        if(data[i].INI.year() == data[i].END.year()) {
          $textos.append('<p class="tml-date">'+data[i].INI.year()+'</p>');
        } else {
          $textos.append('<p class="tml-date">'+data[i].INI.year()+'-'+data[i].END.year()+'</p>');
        }
        if(data[i].Headline) $textos.append('<h2>'+data[i].Headline+'</h2>');
        if(data[i]['Text']) $textos.append('<p>'+data[i]['Text']+'</p>');

          // lo añadimos finalmente
        $inn.append($elm);
      };

      // events
      $('.timl-elm').click(function(){
        $('.timl-elm.timl-elm-act').removeClass('timl-elm-act');
        $(this).addClass('timl-elm-act');
        labTools.Timeline.data.activeCard = $(this).index('.timl-elm');
        var idx = $(this).index('.timl-elm');
        labTools.Timeline.fns.gotoCard(idx);
      })

    },
    onScroll: function(evt){
      // esto no hace na, pero podría
      // console.log('scroll: ', evt.target.scrollLeft)
    },
    gotoCard: function(card) {
      $('.timl-timer-elm:eq('+card+')').addClass('timl-elm-act');
      labTools.Timeline.data.$timl.find('.timl-wrap').animate({scrollLeft: labTools.Timeline.data.csv[card].posLeft},400);
      labTools.Timeline.data.activeCard = card;
      labTools.Timeline.data.$timl.find('.timl-elm-act').removeClass('timl-elm-act');
      labTools.Timeline.data.$timl.find('.timl-elm:eq('+card+')').addClass('timl-elm-act');
      labTools.Timeline.data.$timl.find('.timl-timer-elm-act').removeClass('timl-timer-elm-act');
      labTools.Timeline.data.$timl.find('.timl-timer-elm:eq('+card+')').addClass('timl-timer-elm-act');
    },
    tlGoPrev: function(){
      if (labTools.Timeline.data.activeCard <= 0 ) {
        labTools.Timeline.data.activeCard = labTools.Timeline.data.csv.length;
      }
      labTools.Timeline.fns.gotoCard(labTools.Timeline.data.activeCard - 1);
    },
    tlGoNext: function(){
      if (labTools.Timeline.data.activeCard >= labTools.Timeline.data.csv.length - 1) {
        labTools.Timeline.data.activeCard = -1;
      }
      labTools.Timeline.fns.gotoCard(labTools.Timeline.data.activeCard + 1);
    },
      // le das url de video de youtube y nos saca el id
    getYoutubeVideoId: function (fullUrl) {
      var video_id = fullUrl.split('v=')[1];
      var ampersandPosition = video_id.indexOf('&');
      if(ampersandPosition != -1) {
        return video_id.substring(0, ampersandPosition);
      }
      return false;
    },
      // le pasas un elemento, y te devuelve la posicion left de su centro
    getLeftDateCenter: function(elmData) {
      return moment(elmData.MID).diff(labTools.Timeline.data.initialDate) * labTools.Timeline.data.pixelsPerMilisecond;
    },
      // le pasas un elemento, y te devuelve la posicion left de su lado izquierdo
    getLeftDateScroll: function(elmData) {
      var posCenter = moment(elmData.MID).diff(labTools.Timeline.data.initialDate) * labTools.Timeline.data.pixelsPerMilisecond;
      return posCenter - (labTools.Timeline.data.initialSettings.width / 2);
    },
      // le pasas una fecha (normal), y devuelve la posicion en pixels
    getDateinPixels2: function(data) {
      return moment(data).diff(labTools.Timeline.data.initialDate) * labTools.Timeline.data.pixelsPerMilisecond2;
    },
  }
};


