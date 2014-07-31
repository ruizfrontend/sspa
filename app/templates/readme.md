# Nuevo proyecto del lab RTVE.es

Descripción del proyecto


## Requisitos, dependencias y otros aquí

Para compilar el proyecto se requiere NodeJs y sus módulos correspondientes. Sin embargo, está diseñado para que el proyecto se ejecute directamente en su carpeta, sin mayores requisitos que un servidor Apache suficientemente actualizado.

## Características del proyecto

El proyecto incluye 4 tareas **grunt** configiuradas:

- **watch**: tarea para el procesado dinámico de los scsss
- **sass**: Como el anterior, pero solo se ejecuta una vez
- **compile**: genera la versión de producción del proyecto (sin imágenes)
- **compileimg**: genera la versión de producción del proyecto (con imágenes)

##Instalación

Una vez descargado el repositorio, hace falta instalar todas las dependencias.
Para ello necesitamos *NPM* y ejecutar la instalación mediante:

```bash
  npm install
```

Además necesitamos los componentes de Silex. Para ello ejecutamos:

```bash
  php composer.phar install
```

Finalmente hace falta hacer un primer renderizado del sass para que se genere un styles.css útil.
Para ello basta con ejecutar:

```bash
  grunt sass
```

Y ya podremos lanzar el proyecto en el navegador desde la carpeta de instalación.

Si te dió algún problema feo consulte con un especialista


```
#!python

      ________________________________________________  
     _____/\/\____________/\/\______/\/\/\/\/\_______  
    _____/\/\__________/\/\/\/\____/\/\____/\/\_____  
   _____/\/\________/\/\____/\/\__/\/\/\/\/\_______  
  _____/\/\________/\/\/\/\/\/\__/\/\____/\/\_____  
 _____/\/\/\/\/\__/\/\____/\/\__/\/\/\/\/\_______  
________________________________________________  
          ________________________________________________________________   
         _____/\/\/\/\/\____/\/\/\/\/\/\__/\/\____/\/\__/\/\/\/\/\/\_____   
        _____/\/\____/\/\______/\/\______/\/\____/\/\__/\_______________   
       _____/\/\/\/\/\________/\/\______/\/\____/\/\__/\/\/\/\/\_______   
      _____/\/\__/\/\________/\/\________/\/\/\/\____/\/\_____________   
     _____/\/\____/\/\______/\/\__________/\/\______/\/\/\/\/\/\_____   
    ________________________________________________________________ 
```
________Diseño: Ismael Recio, Redacción: Miriam Hernanz / Arturo Panyagua _____  
_______Realización: César Vallejo / Miguel Campos ____________________________  
______Desarrollo: @ruizfrontend / Francisco Quintero / Belén García @ 2014___