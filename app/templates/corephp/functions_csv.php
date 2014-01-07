<?php


/*
parse_csv()
------------------------------------------------------------------------------------------------------------------------------ 

Método que parsea un fichero CSV en un array

Parametros de entrada:

$csv_string           -> String con la información del CSV
$delimiter            -> Delimitador usado en el CSV
$skip_empty_lines     -> Flag que indica si se saltan líneas vacias
$trim_fields          -> Flag que indica si se limpian los espacios en blanco al principio/final de cada uno de los campos
*/
function parse_csv ($csv_string, $delimiter = ",", $skip_empty_lines = true, $trim_fields = false) {

  $enc = preg_replace('/(?<!")""/', '!!Q!!', $csv_string);
  $enc = preg_replace_callback(
    '/"(.*?)"/s',
    function ($field) { return urlencode(utf8_encode($field[1])); },
    $enc
  );
  
  $lines = preg_split($skip_empty_lines ? ($trim_fields ? '/( *\R)+/s' : '/\R+/s') : '/\R/s', $enc);
  
  return array_map(
    function ($line) use ($delimiter, $trim_fields) {
      $fields = $trim_fields ? array_map('trim', explode($delimiter, $line)) : explode($delimiter, $line);
      return array_map(
        function ($field) { return str_replace('!!Q!!', '"', utf8_decode(urldecode($field))); },
        $fields
      );
    },
    $lines
  );
};

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
function fileCSVToArray ($dataFilePath, $columm) {

	// Variables
	$firstLine = true;
	$initialOne = 0;
	$charsCat = array();

	// Datos que devolveremos
	$dataReturn = array();


	// Abrimos el fichero
	$file = fopen($dataFilePath,"r");

	// Lo recorremos
	while (($arr = fgetcsv($file, 4000, ",")) !== false) {
	  
	  if ($firstLine == true) { 
	    $firstLine = false;
	    $cols = $arr;
	  } else {

	    $newChar = array();
	    for ($i=0; $i < count($cols); $i++) { 
	      $newChar[$cols[$i]] = trim($arr[$i]);
	    }
	    $charsCat[$newChar[$columm]][] = $newChar;
	    $charfinal[] = $newChar;
	  }
	  $initialOne = $initialOne + 1;
	}

	$dataReturn[0] = $charsCat;
	$dataReturn[1] = $charfinal;

	return $dataReturn;
};


?>