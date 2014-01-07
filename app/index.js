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
    name: 'finalFolder',
    message: '\
    Escriba la carpeta final para el proyecto \n\
    (la que grunt usará para \'compilar\' el proyecto)',
    validate: function(input) { return(input.indexOf(' ') == -1); },
    default: 'newLabProy'
  },{
    type: 'confirm',
    name: 'corePhp',
    message: '¿Deseas incluir el core PHP del lab?',
    default: true
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
  },{
    type: 'checkbox',
    name: 'featLibs',
    message: '¿Deseas incluir alguna librería externa? (jQuery se incluye por defecto)',
    choices: [{
      name: 'modernizr',
      value: 'includeModernizr',
      checked: true
    }, {
      name: 'popcorns.js -> procesado de eventos multimedia',
      value: 'libsPopcorn',
      checked: false
    }, {
      name: 'mouseWheel -> control de la rueda del ratón',
      value: 'libsMousewheel',
      checked: false
    }, {
      name: 'snap.js -> dibujo svg',
      value: 'libsSnap',
      checked: false
    }, {
      name: 'd3js -> gráficas',
      value: 'libsD3',
      checked: false
    }, {
      name: 'moment.js -> simplifica el uso de fechas',
      value: 'libsMomentjs',
      checked: false
    }, {
      name: 'hammer.js -> control de eventos touch',
      value: 'libsHammer',
      checked: false
    }]
  }];

  this.prompt(prompts, function (answers) {
    this.finalFolder = answers.finalFolder;

    var featLab = answers.featLab;
    var featLibs = answers.featLibs;

    function hasFeatureLab(feat) { return featLab.indexOf(feat) !== -1; }
    function hasFeatureLib(feat) { return featLibs.indexOf(feat) !== -1; }

    // manually deal with the response, get back and store the results.
    // we change a bit this way of doing to automatically do this in the self.prompt() method.
    this.includeModernizr = hasFeatureLib('includeModernizr');
    this.libsPopcorn = hasFeatureLib('libsPopcorn');
    this.libsMousewheel = hasFeatureLib('libsMousewheel');
    this.libsSnap = hasFeatureLib('libsSnap');
    this.libsD3 = hasFeatureLib('libsD3');
    this.libsMomentjs = hasFeatureLib('libsMomentjs');
    this.libsHammer = hasFeatureLib('libsHammer');

    this.lbtConsole = hasFeatureLab('lbtConsole');
    this.lbtFullscreen = hasFeatureLab('lbtFullscreen');
    this.lbtMedia = hasFeatureLab('lbtMedia');
    this.lbtTimeline = hasFeatureLab('lbtTimeline');
    this.lbtUrl = hasFeatureLab('lbtUrl');

    cb();
  }.bind(this));
};

AppGenerator.prototype.gruntfile = function gruntfile() {
  this.template('Gruntfile.js');
};

AppGenerator.prototype.packageJSON = function packageJSON() {
  this.template('_package.json', 'package.json');
};

AppGenerator.prototype.git = function git() {
  this.copy('gitignore', '.gitignore');
  this.copy('gitattributes', '.gitattributes');
};

AppGenerator.prototype.bower = function bower() {
  this.copy('bowerrc', '.bowerrc');
  this.template('_bower.json', 'bower.json');
};

AppGenerator.prototype.jshint = function jshint() {
  this.copy('jshintrc', '.jshintrc');
};

AppGenerator.prototype.editorConfig = function editorConfig() {
  this.copy('editorconfig', '.editorconfig');
};

AppGenerator.prototype.corePHP = function corePHP() {
  this.mkdir('corephp');

  this.directory('corephp', 'corephp');
};

AppGenerator.prototype.mainStylesheet = function mainStylesheet() {
  this.mkdir('sass');

  this.directory('sass', 'sass');
};

AppGenerator.prototype.resto = function resto() {
  this.copy('index.php', 'index.php');
  this.copy('.htaccess', '.htaccess');
  this.copy('readme.md', 'readme.md');
  this.copy('entorno.properties', 'entorno.properties');
  
  this.mkdir('templates');

  this.copy('templates/html.html', 'templates/html.html');
  this.template('templates/base.html', 'templates/base.html');

  this.mkdir('js');

  this.copy('js/base.js', 'js/base.js');

  this.mkdir('img');

  this.directory('img', 'img');

  this.mkdir('font');

  this.directory('font', 'font');
};

AppGenerator.prototype.labTools = function labTools() {
  if(this.lbtConsole) this.copy('labtools/lbt-console.js', 'js/lbt-console.js');
  if(this.lbtFullscreen) this.copy('labtools/lbt-fullscreen.js', 'js/lbt-fullscreen.js');
  if(this.lbtMedia) this.copy('labtools/lbt-media.js', 'js/lbt-media.js');
  if(this.lbtTimeline) {
    this.copy('labtools/lbt-timeline.js', 'js/lbt-timeline.js');
    this.copy('labtools/lbt-timeline.css', 'js/lbt-timeline.css');
  }
  if(this.lbtUrl) this.copy('labtools/lbt-url.js', 'js/lbt-url.js');
  if(this.lbtConsole) this.copy('labtools/lbt-console.js', 'js/lbt-console.js');
}

AppGenerator.prototype.install = function () {
  if (this.options['skip-install']) {
    return;
  }

  var done = this.async();
  this.installDependencies({
    skipMessage: this.options['skip-install-message'],
    skipInstall: this.options['skip-install'],
    callback: done
  });
};
