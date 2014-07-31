<?php

namespace Services;

/**
 * Servicio que nos permite tratar con ficheros devolviendo un array
 *
 * @version 1.0
 * @copyright 2014
 */
class FiletoArrayServiceProvider {

	/*
	fileCSVToString()
	------------------------------------------------------------------------------------------------------------------------------ 

	Método que parsea un fichero CSV a un Array

	Parametros de entrada:

	$dataFilePath         -> Path al fichero CSV
	$columm 			  -> Columna que queremos sea usada como indice o agrupador del array

	Parametros de Salida:

		
	$dataReturn[0] = $charsCat; 	-> Array de salida que agrupa en función del valor dado en $columm
	$dataReturn[1] = $charfinal; 	-> Array de salida ordenados segun se leen del fichero CSV
	*/
	public static function fileCSVToArray ($dataFilePath, $columm) {

		// Variables
		$firstLine = true;
		$charsCat = array();
		$counter = 0;

		try {

			// Abrimos el fichero
			$file = fopen($dataFilePath,"r");

	        if ( $file===false ) {
				// error reading or opening file
	           return true;
	        }

			// Lo recorremos
			while (($arr = fgetcsv($file, 4000, ",")) !== false) {
			  if ($firstLine == true) {
			    $firstLine = false;
			    $cols = $arr;
			  } else {

			    $newRow = array();
			    for ($i=0; $i < count($cols); $i++) { 
			      $newRow[$cols[$i]] = trim($arr[$i]);
			    }
			    
			    if(!$columm) {
			    	$charsCat[$counter] = $newRow;
			    	$counter ++;
			    } else {
			    	$charsCat[$newRow[$columm]] = $newRow;
			    }
			  }
			}



		} catch (Exception $e) {
		    echo 'Excepción capturada: ',  $e->getMessage(), "\n";
		}


		return $charsCat;
	}
}

?>