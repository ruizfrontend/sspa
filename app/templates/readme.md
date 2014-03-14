# Nuevo proyecto del lab RTVE.es

Descripción del proyecto

## Requisitos, dependencias y otros aquí

- uno
- dos 
- tre...

## Características del proyecto

El proyecto incluye 4 tareas **grunt** configiuradas:

- **watch**: tarea para el procesado dinámico de los scsss
- **bower-install**: tarea para instalar dependencias (ver sección 'Third-Party Dependencies')
- **compile**: genera la versión de producción del proyecto (sin imágenes)
- **compileimg**: genera la versión de producción del proyecto (con imágenes)

##Instalación

Una vez descargado el repositorio, hace falta instalar todas las dependencias.
Para ello necesitamos *NPM* y *bower* (no iríamos muy lejos sin ellos) y ejecutar la instalación mediante:

```bash
  npm install
```

Finalmente hace falta hacer un primer renderizado del sass para que se genere un styles.css útil.
Para ello basta con ejecutar:

```bash
  grunt sass
```

Y ya podremos lanzar el proyecto en el navegador desde la carpeta de instalación.

Si te dió algún problema consulte con un especialista

#### Third-Party Dependencies

*(HTML/CSS/JS/Images/etc)*

Añadimos librerías externas con [bower-install](https://github.com/stephenplusplus/grunt-bower-install): 

```bash
  bower install --save jquery
  grunt bower-install
```
