<?php

namespace Services;

/*

Servicio que carga los datos desde un fichero CSV o JSON

dataLoader.php
*/

//use Services\FileToArrayServiceProvider as FileToArrayServiceProvider;

/**
 * Servicio que nos permite tratar con ficheros devolviendo un array
 *
 * @version 1.0
 * @copyright 2014
 */
class sectionsLoader {


  public function __construct()
  {

  }

  public function getSections($app, $templatesFolder)
  {
    $dir = opendir($templatesFolder);

    if(!$dir) {
      $app->error(function (\Exception $e, $code) {
        exit('SectionsLoader error: Template folder not found');
      });
    }

    $files = array();

    $twigFilePattern = '.html.twig';

    while (false !== ($fileName = readdir($dir))) {
      if(strpos($fileName, $twigFilePattern) == strlen($fileName) - strlen($twigFilePattern)){
        array_push($files, substr($fileName, 0, strlen($fileName) - strlen($twigFilePattern)));
      }
    }
    
    sort($files);

    return $app['sections'] = $files;

  }

}

?>