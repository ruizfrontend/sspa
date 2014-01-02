<?php

function filePropertiesToArray($file_path) {

	$lines = explode("\n", trim(file_get_contents($file_path)));
	$properties = array();

	foreach ($lines as $line) {
	    $line = trim($line);

	    if (!$line || substr($line, 0, 1) == '#') // skip empty lines and comments
	        continue;

	    if (false !== ($pos = strpos($line, ':'))) {
	        $properties[trim(substr($line, 0, $pos))] = trim(substr($line, $pos + 1));
	    }
	}

	return $properties;
}

?>