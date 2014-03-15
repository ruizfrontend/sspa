'use strict';
var util = require('util');
var path = require('path');
var spawn = require('child_process').spawn;
var yeoman = require('yeoman-generator');
var chalk = require('chalk');


var AppGenerator = module.exports = function Appgenerator(args, options, config) {
  yeoman.generators.Base.apply(this, arguments);

  this.options = options;

  this.pkg = JSON.parse(this.readFileAsString(path.join(__dirname, '../package.json')));
};

util.inherits(AppGenerator, yeoman.generators.Base);

AppGenerator.prototype.askFor = function askFor() {
  var cb = this.async();

  // welcome message
  if (!this.options['skip-welcome-message']) {
    console.log(this.yeoman);
    console.log(chalk.magenta('\n\
    Bienvenido al generador de proyectos de lab RTVE.es\n\
    ---------------------------------------------------\n\
    \n\
    Se generará la estructura básica de proyecto en la carpeta actual\n\
    además se configurará grunt para permitir compilar el proyecto \n\
    en la carpeta de destino que desee. \n \n'));
  }

  var prompts = [{
    type: 'input',
    name: 'initFolder',
    message: '\
    Escriba la carpeta que contendrá el proyecto \n\
    (se creará la carpeta e inluirá el proyecto dentro)',
    validate: function(input) { return(input.indexOf(' ') == -1); },
    default: 'newLabProy'
  },{
    type: 'input',
    name: 'finalFolder',
    message: '\
    Escriba la carpeta final para el proyecto \n\
    (la que grunt usará para \'compilar\' el proyecto)',
    validate: function(input) { return(input.indexOf(' ') == -1); },
    default: 'newLabProyCompiled'
  },{
    type: 'input',
    name: 'jsNamespace',
    message: '\
    Escriba el namespace para el javascript \n\
    (se creará en base.js)',
    validate: function(input) { return(input.indexOf(' ') == -1); },
    default: 'app'
  },{
    type: 'checkbox',
    name: 'featLab',
    message: '¿Deseas incluir algun modulo js de labTools?',
    choices: [{
      name: 'lbt-console',
      value: 'lbtConsole',
      checked: false
    }, {
      name: 'lbt-fullscreen',
      value: 'lbtFullscreen',
      checked: false
    }, {
      name: 'lbt-media',
      value: 'lbtMedia',
      checked: false
    }, {
      name: 'lbt-timeline',
      value: 'lbtTimeline',
      checked: false
    }, {
      name: 'lbt-url',
      value: 'lbtUrl',
      checked: false
    }]
  }];

  this.prompt(prompts, function (answers) {

    this.finalFolder = answers.finalFolder;
    this.initFolder = answers.initFolder;
    this.jsNamespace = answers.jsNamespace;

    var featLab = answers.featLab;

    function hasFeatureLab(feat) { return featLab.indexOf(feat) !== -1; }

    // manually deal with the response, get back and store the results.
    // we change a bit this way of doing to automatically do this in the self.prompt() method.

    this.lbtConsole = hasFeatureLab('lbtConsole');
    this.lbtFullscreen = hasFeatureLab('lbtFullscreen');
    this.lbtMedia = hasFeatureLab('lbtMedia');
    this.lbtTimeline = hasFeatureLab('lbtTimeline');
    this.lbtUrl = hasFeatureLab('lbtUrl');

    cb();
  }.bind(this));
};


AppGenerator.prototype.resto = function resto() {

  this.mkdir(this.initFolder);

  this.copy('jshintrc', this.initFolder + '/.jshintrc');

  this.mkdir(this.initFolder + '/sass');

  this.directory('sass', this.initFolder + '/sass');

  this.template('Gruntfile.js', this.initFolder + '/Gruntfile.js');

  this.template('_package.json', this.initFolder + '/package.json');

  this.copy('gitignore', this.initFolder + '/.gitignore');

  this.copy('editorconfig', this.initFolder + '/.editorconfig');

  this.copy('index.php', this.initFolder + '/index.php');
  this.copy('.htaccess', this.initFolder + '/.htaccess');
  this.copy('readme.md', this.initFolder + '/readme.md');
  
  this.copy('routes.yml', this.initFolder + '/routes.yml');
  this.template('settings.yml', this.initFolder + '/settings.yml');

  this.directory('vendor', this.initFolder + '/vendor');

  this.mkdir(this.initFolder + '/app');

  this.directory('app', this.initFolder + '/app');

  this.mkdir(this.initFolder + '/twigs');

  this.directory('twigs', this.initFolder + '/twigs');
  this.template('twigs/base.html.twig', this.initFolder + '/twigs/base.html.twig');

  this.mkdir(this.initFolder + '/js');

  this.template('js/base.js', this.initFolder + '/js/base.js');

  this.mkdir(this.initFolder + '/img');

  this.directory('img', this.initFolder + '/img');

  this.mkdir(this.initFolder + '/libs');

  this.directory('libs', this.initFolder + '/libs');

  this.mkdir(this.initFolder + '/font');

  this.directory('font', this.initFolder + '/font');
};

AppGenerator.prototype.labTools = function labTools() {
  if(this.lbtConsole) this.copy('labtools/lbt-console.js', this.initFolder + '/js/lbt-console.js');
  if(this.lbtFullscreen) this.copy('labtools/lbt-fullscreen.js', this.initFolder + '/js/lbt-fullscreen.js');
  if(this.lbtMedia) this.copy('labtools/lbt-media.js', this.initFolder + '/js/lbt-media.js');
  if(this.lbtTimeline) {
    this.copy('labtools/lbt-timeline.js', this.initFolder + '/js/lbt-timeline.js');
    this.copy('labtools/lbt-timeline.css', this.initFolder + '/js/lbt-timeline.css');
  }
  if(this.lbtUrl) this.copy('labtools/lbt-url.js', this.initFolder + '/js/lbt-url.js');
  if(this.lbtConsole) this.copy('labtools/lbt-console.js', this.initFolder + '/js/lbt-console.js');
}

AppGenerator.prototype.install = function () {
  if (this.options['skip-install']) {
    return;
  }

  var done = this.async();

  console.log(chalk.magenta('\n\
  Gracias por usar el generador de proyectos de lab RTVE.es\n\
  ---------------------------------------------------------') + '\n\
  \n\
  Si todo fue bien, se habrá creado la ' + chalk.magenta('carpeta ' + this.initFolder ) + ' con \n\
  todo lo necesario para crear el proyecto.\n\
  \n\
  Por último entra en tu carpeta ' + this.initFolder + ' y ejecuta  ' + chalk.magenta('npm install') + ' \n\
  para descargar los paquetes necesarios y ya puedes comenzar a usar el proyecto.\n\
  \n\
  Desde ahí puedes usar Grunt sass para compilar sass, Grunt Watch para \n\
  generarlo dinámicamente al hacer cambios en los archivos sass. \n\
  \n\
  Para generar la versión final del proyecto puedes escribir \n\
   ' + chalk.magenta('Grunt compileimg') + 'para optimizar las imagenes o solo ' + chalk.magenta('Grunt \n\
  compile') + ' para no procesar las imagenes.\n\
  \n\
   ' + chalk.magenta('Tu proyecto final se creará en la carpeta ' + this.finalFolder) + '\n \n');

};
