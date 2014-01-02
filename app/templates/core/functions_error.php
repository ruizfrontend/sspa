<?php
/*

error()
------------------------------------------------------------------------------------------------------------------------------ 

Método que nos permite manejar los errores producidos durante la ejecucion. 

Se crea un archivo 'error.log' en el directorio raiz que contiene información sobre dicho error.

Parametros de entrada:

$numero           -> Número del error producido
$texto            -> Mensaje de error que aparece
*/
function error($numero,$texto) {

	// Accedemos a la variable global properties que nos dara información si debemos mostrar los errores en nuestro entorno
	global $properties;

	// Filtro que nos permite convertir a boolean el dato leido del fichero de properties
	$mostrarError = filter_var($properties['ERRORLOG'], FILTER_VALIDATE_BOOLEAN);
	if ( $mostrarError ) {

		$ddf = fopen('error.log','a');
		fwrite($ddf,"[".date(DATE_ATOM)."] Error $numero: $texto \n");
		fclose($ddf);
	}
};

// Establecemos que el manejador de los errores sea nuestra funcion
set_error_handler('error');

?>