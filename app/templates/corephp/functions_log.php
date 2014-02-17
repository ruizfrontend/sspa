<?php

/*

console()
------------------------------------------------------------------------------------------------------------------------------ 

Método que nos permite crear un log con datos producidos durante la ejecucion. 

Se crea un archivo 'output.log' en el directorio raiz que contiene información sobre dichas variables.

Parametros de entrada:

$variable         -> Variable que parseamos
*/
function console($variable) {

	// Accedemos a la variable global properties que nos dara información si debemos mostrar los errores en nuestro entorno
	global $properties;

	// Filtro que nos permite convertir a boolean el dato leido del fichero de properties
	$mostrarLog = filter_var($properties['LOG'], FILTER_VALIDATE_BOOLEAN);
	if ( $mostrarLog ) {

		$ddf = fopen('output.log','a');
		fwrite($ddf,"\n-------------------------------------------\n" . print_r($variable, true));
		fclose($ddf);
	}
};

?>