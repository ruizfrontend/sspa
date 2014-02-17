
module.exports = function(grunt) {

  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    compass: {
      min: {
        options: {              // Target options
          sassDir: 'sass',
          cssDir: 'css',
          environment: 'production',
          outputStyle: 'compressed',
          imagesDir: './img',
          relativeAssets: true
        }
      },
      full: {
        options: {              // Target options
          sassDir: 'sass',
          outputStyle: 'nested',
          cssDir: 'css',
          imagesDir: './img',
          relativeAssets: true
        }
      }
    },

    // Reads HTML for usemin blocks to enable smart builds that automatically
    // concat, minify and revision files. Creates configurations in memory so
    // additional tasks can operate on them
    useminPrepare: {
        options: {
            dest: '../newLabProy',
            root: './'
        },
        html: 'twigs/base.html.twig'
    },

    // Performs rewrites based on rev and the useminPrepare configuration
    usemin: {
        html: ['../newLabProy/{,*/}*.html']
    },

    // Watches files for changes and runs tasks based on the changed files
    watch: {
        compass: {
            files: ['sass/{,*/}*.{scss,sass}'],
            tasks: ['compass:full']
        }
    },

    concat: {
      options: {
        separator: ';',
      }
    },

/*
    uglify: {
      my_target: {
        files: {
          '../newLabProy/src/app.js': [
            './js/{,* /}*.js'
          ]
        }
      },
      option:{
         preserveComments: true
      }
    },

    autoprefixer: {
      single_file: {
        options: {
          // Target-specific options go here.
        },
        src: 'css/styles.css',
        dest: '../newLabProy/src/styles.min.css'
      },
    },
    
    cssmin: {
      combine: {
      }
    },
*/
    imagemin: {                          // Task
      dynamic: {                         // Another target
        files: [{
          expand: true,                  // Enable dynamic expansion
          src: ['img/*.{png,jpg,gif}'],   // Actual patterns to match
          dest: '../newLabProy/'                  // Destination path prefix
        }]
      }
    },

    modernizr: {
      "devFile" : "bower_components/modernizr/modernizr.js",
      "outputFile" : "../newLabProy/bin/modernizr-custom.js",
      files: [
          'js/{,*/}*.js',
          'styles/{,*/}*.css'
      ],
    },

    copy: {
      main: {
        files: [
          {src: [
            '.htaccess',
            './vendor/**',
            './font/**',
            './twigs/**',
            './*.csv',
            './index.php',
            './routes.yml',
            './settings.yml'],
            dest: '../newLabProy/', filter: 'isFile'},
        ]
      }
    },

    'bower-install': {
      target: {
        src: ['./twigs/base.html.twig'],
      }
    },

    replace: {

      php: {
        src: '../newLabProy/settings.yml',
        overwrite: true,
        replacements: [
          {from: 'FINALPATH: /finalpath/', to: 'FINALPATH: /newLabProy/'},
          {from: 'debug: true', to: 'debug: false'}
        ]
      },

    }

  });

  // Default task(s).
  grunt.registerTask('compile', [], function() {

      grunt.loadNpmTasks('grunt-contrib-compass');
      grunt.loadNpmTasks('grunt-usemin');
      grunt.loadNpmTasks('grunt-contrib-concat');
      grunt.loadNpmTasks('grunt-contrib-uglify');
      grunt.loadNpmTasks('grunt-contrib-copy');
      grunt.loadNpmTasks('grunt-contrib-cssmin');
      grunt.loadNpmTasks('grunt-usemin');

      grunt.task.run('compass:min', 'useminPrepare', 'concat',
          'uglify', 'copy', 'cssmin', 'usemin');

  });

  grunt.registerTask('compileimg', [], function() {

      grunt.loadNpmTasks('grunt-contrib-compass');
      grunt.loadNpmTasks('grunt-usemin');
      grunt.loadNpmTasks('grunt-contrib-concat');
      grunt.loadNpmTasks('grunt-contrib-uglify');
      grunt.loadNpmTasks('grunt-contrib-imagemin');
      grunt.loadNpmTasks('grunt-contrib-copy');
      grunt.loadNpmTasks('grunt-contrib-cssmin');
      grunt.loadNpmTasks('grunt-usemin');

      grunt.task.run('compass:min', 'useminPrepare', 'concat',
          'uglify', 'imagemin', 'copy', 'cssmin', 'usemin');

  });

  grunt.registerTask('watch', [], function() {

      grunt.loadNpmTasks('grunt-contrib-watch');
      grunt.loadNpmTasks('grunt-contrib-compass');
      grunt.task.run('watch');

  });

  grunt.registerTask('compassfull', [], function() {

      grunt.loadNpmTasks('grunt-contrib-compass');
      grunt.task.run('compass:full');
  });

  grunt.registerTask('bower-install', [], function() {

      grunt.loadNpmTasks('grunt-bower-install');
      grunt.task.run('bower-install');
  });

  grunt.registerTask('sass', [], function() {

      grunt.loadNpmTasks('grunt-contrib-compass');
      grunt.task.run('compass:full');
  });
};
