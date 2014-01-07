
module.exports = function(grunt) {

  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    compass: {
      dist: {                   // Target
        options: {              // Target options
          sassDir: 'sass',
          cssDir: 'css',
          environment: 'production',
          imagesDir: './img',
          relativeAssets: true
        }
      },
    },

    // Reads HTML for usemin blocks to enable smart builds that automatically
    // concat, minify and revision files. Creates configurations in memory so
    // additional tasks can operate on them
    useminPrepare: {
        options: {
            dest: '../<%= finalFolder %>'
        },
        html: 'templates/base.html'
    },

    // Performs rewrites based on rev and the useminPrepare configuration
    usemin: {
        html: ['../<%= finalFolder %>/{,*/}*.html']
    },

    // Watches files for changes and runs tasks based on the changed files
    watch: {
        compass: {
            files: ['sass/{,*/}*.{scss,sass}'],
            tasks: ['compass']
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
          '../<%= finalFolder %>/src/app.js': [
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
        dest: '../<%= finalFolder %>/src/styles.min.css'
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
          dest: '../<%= finalFolder %>/'                  // Destination path prefix
        }]
      }
    },

    modernizr: {
      "devFile" : "bower_components/modernizr/modernizr.js",
      "outputFile" : "../<%= finalFolder %>/src/modernizr-custom.js",
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
            './corephp/**',
            './font/**',
            './templates/**',
            './*.csv',
            './entorno.properties',
            './index.php'],
            dest: '../<%= finalFolder %>/', filter: 'isFile'},
        ]
      }
    },

    'bower-install': {
      target: {
        src: ['./templates/base.html'],
      }
    },

    replace: {

      php: {
        src: '../<%= finalFolder %>/entorno.properties',
        overwrite: true,
        replacements: [
          {from: 'FINALPATH: /finalpath/', to: 'FINALPATH: /<%= finalFolder %>/'},
          {from: 'LOG: true', to: 'LOG: false'},
          {from: 'ERRORLOG: true', to: 'ERRORLOG: false'}
        ]
      },

    }

  });

  // Default task(s).
  grunt.registerTask('compile', ['compass', 'useminPrepare','concat',
    'uglify', 'copy', 'replace', 'cssmin','modernizr',  'usemin']);
  grunt.registerTask('compileimg', ['compass', 'useminPrepare','concat',
    'uglify', 'imagemin', 'copy', 'replace', 'cssmin', 'modernizr', 'usemin']);
  grunt.registerTask('watch', ['watch']);
  grunt.registerTask('bower-install', ['bower-install']);

  grunt.loadNpmTasks("grunt-usemin");
  grunt.loadNpmTasks("grunt-modernizr");
  grunt.loadNpmTasks('grunt-bower-install');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-compass');
  grunt.loadNpmTasks('grunt-autoprefixer');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-text-replace');
  grunt.loadNpmTasks('grunt-contrib-imagemin');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
};
