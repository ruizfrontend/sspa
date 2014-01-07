<?php
setlocale(LC_ALL,"es_ES");
define('SITE_ROOT', dirname(__FILE__));

// Ruta de los ficheros de funciones PHP que cargamos
$functions_properties   = SITE_ROOT . '/corephp/functions_properties.php';
$functions_error        = SITE_ROOT . '/corephp/functions_error.php';
$functions_log          = SITE_ROOT . '/corephp/functions_log.php';
$functions_utils        = SITE_ROOT . '/corephp/functions_utils.php';
$functions_url          = SITE_ROOT . '/corephp/functions_url.php';
$functions_csv          = SITE_ROOT . '/corephp/functions_csv.php';

$pathProperties         = SITE_ROOT . '/entorno.properties';

// Realizamos los includes de los ficheros de funciones y 'entorno.properties' de configuracion general

require_once $functions_properties;
$properties   = filePropertiesToArray($pathProperties);

require_once $functions_error;
require_once $functions_log;
require_once $functions_utils;
require_once $functions_url;
require_once $functions_csv;

// Ruta de los ficheros de datos (CSV) que cargamos 
//$pathSEOCSV         = './seo.csv';

// Carga los CSVs
//$arraySEO         = fileCSVToArray($pathSEOCSV, 'url');

// elementos iniciales del seo
$baseTitle    = $properties['TITLE'];
$baseDesc     = $properties['DESCRIPTION'];
$baseImg      = $properties['SHAREIMG'];
$basekeyWords = $properties['KEYWORDS'];
$baseUrl      = $properties['FINALPATH'];

//procesa la reta
$urlArray = explode('/',$_SERVER['REQUEST_URI']);

$isCharacter = false;
switch (count($urlArray)) {
  case '5': /*
    if( $urlArray[2] == 'extra') {
      $realUrl = $urlArray[3].'/'.$urlArray[4];
          // buscamos los datos del extra y si no hay ponemos los genericos
      $activeSect = getSect($realUrl, $extras);

      if(isset($activeSect)) {
        $sect = null;
        $subsect = $activeSect;
        $seoimg = $activeSect['img'];
        $titulo = 'Generación 12-1: '.$activeSect['titulo'].' | LAB RTVE.ES';
        $description = $activeSect['description'];
        $keywords = $activeSect['keywords'];
      } else {
        $sect = null;
        $subsect = null;
        $seoimg = $baseImg;
        $titulo = $baseTitle;
        $description = $baseDesc;
        $keywords = $basekeyWords;
      }
    } else {  // si el segundo parámetro no es ninguno, hay un error y vamos a la home
      $sect = null;
      $subsect = null;
      $seoimg = $baseImg;
      $titulo = $baseTitle;
      $description = $baseDesc;
      $keywords = $basekeyWords;
    }*/
  break;
  default:
    $sect = null;
    $subsect = null;
    $seoimg = $baseImg;
    $titulo = $baseTitle;
    $description = $baseDesc;
    $keywords = $basekeyWords;
  break;
}

include('./templates/base.html');