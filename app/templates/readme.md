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

#### Third-Party Dependencies

*(HTML/CSS/JS/Images/etc)*

Añadimos librerías externas con [bower-install](https://github.com/stephenplusplus/grunt-bower-install): 

```bash
  bower install --save jquery
  grunt bower-install
```
