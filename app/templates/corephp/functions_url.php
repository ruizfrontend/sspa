<?php

/*

getUrl(()
------------------------------------------------------------------------------------------------------------------------------ 

Método que limpia una cadena de caracteres no normalizados

Parametros de entrada:

$s                  -> String con la cadena de la url
*/
function getUrl($s) {

  $s = str_replace(",","",$s);
  $s = str_replace("Ñ","n",$s);
  $s = str_replace("Á","a",$s);
  $s = str_replace("É","e",$s);
  $s = str_replace("Í","i",$s);
  $s = str_replace("Ó","o",$s);
  $s = str_replace("Ú","u",$s);
  $s = str_replace("ñ","n",$s);
  $s = str_replace("á","a",$s);
  $s = str_replace("é","e",$s);
  $s = str_replace("í","i",$s);
  $s = str_replace("ó","o",$s);
  $s = str_replace("ú","u",$s);
  $s = str_replace(" ","-",$s);
  $s = strtolower($s);

  return $s;
};


/*

getCharFromUrl(()
------------------------------------------------------------------------------------------------------------------------------ 

Método que 

Parametros de entrada:

$url                  ->
$charfinal            ->
*/
function getCharFromUrl($url, $charfinal) {

  for ($i=0; $i < count($charfinal); $i++) { 

    if ( $url == getUrl($charfinal[$i]['url']) ) {
      return($charfinal[$i]);
    }
  }
};

function getSect($url, $extras){
  for ($i=0; $i < count($extras); $i++) { 
    if($url == $extras[$i]['url']) {
      return($extras[$i]);
    }
  }
};

/*

generateArrayURL(()
------------------------------------------------------------------------------------------------------------------------------ 

Método que genera un array a partir del contenido de otro array que contiene un campo 'url'

Parametros de entrada:

$array                  -> Array que vamos a recorrer
*/
function generateArrayURL($array) {

  $url = array();

  for ($i=0; $i < count($array); $i++) { 
    
    array_push($url, $array[$i]['url']);
  }

  return $url;
};

?>