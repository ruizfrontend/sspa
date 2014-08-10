# SSPA: Silex single-page-application yeoman generator [![Built with Grunt](https://cdn.gruntjs.com/builtwith.png)](http://gruntjs.com/)

This project started as a simple generator with a few PHP functions to help systematize some back-end architecture for our proyects at [lab.rtve.es](http://lab.rtve.es), including common task like seo managing or data handling to work easily in collaboration with our team of journalists and creatives. For almost 20 projects in a year, the project has been growing, implementing new functionalities, until we decided to make it public so can help someone with the same needs. 

But since the begining the main purspose subsist: **lay down a solid backend architecture so the team can focus on frontend tasks from the second one** 

## Features
- **Yeoman** (node.js) generator for easy deploy new versions of the framework.

### Back end components
- **Silex** PHP micro-framework based on **symfony** code, with some public and custom code:
    - **Twig** as PHP template engine.
    - **Monolog** logging library.
    - **Markdown filter** for twig or PHP.
    - **Silex routing system**.

### Front end components
- **Yeoman** generator.
- **Bower** package manager.
- **HTML5** 
- **SASS**
- **Grunt** task manager with some common tasks commnads predefined.

## Demo
Please, take a look at the demo to see some common patterns easily created with the framework.

## Use
El proyecto se generará en la carpeta en la que estés, y esta será tu carpeta de desarrollo, con su index.html y todo eso. A partir de esta carpeta se generarán las carpetas scss, js, img, fonts.... además de todos los archivos de configuración habituales.

Tembién se generará la configuración para **grunt** con 4 tareas configuradas:

- **watch**: tarea para el procesado dinámico de los scsss
- **bower-install**: tarea para instalar dependencias (ver sección 'Third-Party Dependencies')
- **compile**: genera la versión de producción del proyecto (sin imágenes)
- **compileimg**: genera la versión de producción del proyecto (con imágenes)

###Los proyectos incluyen: 

- Las tareas grunt comentadas antes, configuradas para cada tarea especificado, incluyendo minificación del código css y html, compresión de las imágenes, 
- Estructura de **git** lista para darle un git init y comenzar a comitear.
- Un **.htaccess** básico.
- Un **readme.md** básico.

Opcionalmente incluirán según se elija en el proceso de instalación:

- Las librerías **labTools** que utilizamos en el laboratorio.
- El **core de PHP** habitual del lab.
- Librerías externas listas para ser instaladas con **bower**.

## Instalación del generador

Como el generador no es público (ej. github), tenemos que instalarlo en local. Para ello clonamos el proyecto en una **carpeta con el nombre generator-NOMBREGENERATOR**, siendo NOMBREGENERATOR el nombre que yeoman buscará para ejecutarlo. 

Una vez clonado, y dentro de la carpeta, cargamos las dependencias de npm y vinculamos el proyecto:

```
  npm install
  npm link
```

Tras esto deberíamos ser capaces de generar un proyecto nuevo usando desde una carpeta vacia

```
  yo NOMBREGENERATOR
```

## Post instalacción

Una vez generado un proyecto nuevo con yeoman, deberíamos tener los archivos necesarios para nuestro proyecto. *Sin embargo aún tenemos que instalar los componentes expternos del proyecto.* Por un lado necesitamos instalar los componentes de node:

```
  npm install
```

y los componentes de Silex:

```
  php composer.phar install
```

ahora tenemos todo lo que necesitamos para comenzar nuestro primer proyecto


```
  grunt watch
```

Una vez hecho esto, grunt esperará a que se cambien los archivos de la carpeta sass, y en cuanto detecte cambios los compilará en la carpeta css. Una vez procesado por primera vez y creada la carpeta css, ya tenemos todo lo necesario para generar nuestras versiones de producción con uno de los dos comandos:

```
  grunt compile
  grunt compileimg
```

## Extra info

- [Sample twig data structure](data-structure.md)


