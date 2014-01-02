'use strict';
var util = require('util');
var path = require('path');
var spawn = require('child_process').spawn;
var yeoman = require('yeoman-generator');
var chalk = require('chalk');


var AppGenerator = module.exports = function Appgenerator(args, options, config) {
  yeoman.generators.Base.apply(this, arguments);

  // setup the test-framework property, Gruntfile template will need this
  this.testFramework = options['test-framework'] || 'mocha';
  this.coffee = options.coffee;

  // for hooks to resolve on mocha by default
  options['test-framework'] = this.testFramework;

  // resolved to mocha by default (could be switched to jasmine for instance)
  this.hookFor('test-framework', {
    as: 'app',
    options: {
      options: {
        'skip-install': options['skip-install-message'],
        'skip-message': options['skip-install']
      }
    }
  });

  this.options = options;

  this.pkg = JSON.parse(this.readFileAsString(path.join(__dirname, '../package.json')));
};

util.inherits(AppGenerator, yeoman.generators.Base);

AppGenerator.prototype.askFor = function askFor() {
  var cb = this.async();

  // welcome message
  if (!this.options['skip-welcome-message']) {
    console.log(this.yeoman);
    console.log(chalk.magenta('Prepararemos una super app con less, compass, y los modulos de labtools que elijas.'));
  }

  var prompts = [{
    type: 'input',
    name: 'proyName',
    message: 'Escribe el nompre para el proyecto (prefijo corto y tal)',
    validate: function(input) { return(input.indexOf(' ') == -1); },
    default: 'newLabProy'
  },{
    type: 'input',
    name: 'proyDevName',
    message: 'Escribe el nompre para la carpeta de desarrollo',
    validate: function(input) { return(input.indexOf(' ') == -1); },
    default: 'newLabProy-dev'
  },{
    type: 'input',
    name: 'proyProdName',
    message: 'Escribe el nompre para la carpeta final',
    validate: function(input) { return(input.indexOf(' ') == -1); },
    default: 'newLabProy'
  },{
    type: 'confirm',
    name: 'corePhp',
    message: '¿Deseas incluir el core PHP del lab?',
    default: false
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
    }, {
      name: 'lbt-fullscreen',
      value: 'lbtFullscreen',
      checked: false
    }]
  },{
    type: 'checkbox',
    name: 'featLibs',
    message: '¿Deseas incluir alguna otra librería externa?',
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
    this.proyName = answers.proyName;
    this.proyDevName = answers.proyDevName;
    this.proyProdName = answers.proyProdName;

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
    this.lbtFullscreen = hasFeatureLab('lbtFullscreen');

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
  this.mkdir('core');

  this.directory('core', 'core');
};

AppGenerator.prototype.mainStylesheet = function mainStylesheet() {
  var css = 'main.' + (this.compassBootstrap ? 's' : '') + 'css';
  this.copy(css, 'app/styles/' + css);
};

AppGenerator.prototype.writeIndex = function writeIndex() {
  var bs;

  this.indexFile = this.readFileAsString(path.join(this.sourceRoot(), 'index.html'));
  this.indexFile = this.engine(this.indexFile, this);

  this.indexFile = this.appendFiles({
    html: this.indexFile,
    fileType: 'js',
    optimizedPath: 'scripts/main.js',
    sourceFileList: ['scripts/main.js'],
    searchPath: '{app,.tmp}'
  });
};

AppGenerator.prototype.app = function app() {
  this.mkdir('app');
  this.mkdir('app/scripts');
  this.mkdir('app/styles');
  this.mkdir('app/images');
  this.write('app/index.html', this.indexFile);

  this.write('app/scripts/main.js', 'console.log(\'\\\'Allo \\\'Allo!\');');
};

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
