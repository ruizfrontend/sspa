<?php

namespace Services;

/*

Servicio que carga los datos desde un fichero CSV o JSON

dataLoader.php
*/

use Services\FileToArrayServiceProvider as FileToArrayServiceProvider;

/**
 * Servicio que nos permite tratar con ficheros devolviendo un array
 *
 * @version 1.0
 * @copyright 2014
 */
class dataLoader {


  public function __construct()
  {
  }

  public function getData($file, $name, $app, $format, $column = null)
  {
    if(strpos($file, 'http') != false && !file_exists($file)) {
      $app->abort(404, "Import file $file not found. Aborting");
    }

    if($format == 'csv') {
      return $app['dataLoader.'.$name] = FileToArrayServiceProvider::fileCSVToArray($file, $column);
    } elseif ($format == 'json') {
      return $app['dataLoader.'.$name] = json_decode(file_get_contents($file));
    } else {
      $app->abort(404, "Wrong imports format. Aborting");
    }


  }

}

?>