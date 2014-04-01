
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
            dest: '../<%= finalFolder %>',
            root: './'
        },
        html: 'twigs/base.html.twig'
    },

    // Performs rewrites based on rev and the useminPrepare configuration
    usemin: {
        html: ['../<%= finalFolder %>/twigs/base.html.twig']
    },

    // Watches files for changes and runs tasks based on the changed files
    watch: {
        compass: {
            files: ['sass/{,*/}*.{scss,sass}'],
            tasks: ['compassfull']
        }
    },

    concat: {
      options: {
        separator: ';',
      }
    },

    imagemin: {                          // Task
      dynamic: {                         // Another target
        files: [{
          expand: true,                  // Enable dynamic expansion
          src: ['img/{,*/}{,*/}*.{png,jpg,gif}'],   // Actual patterns to match
          dest: '../<%= finalFolder %>/'                  // Destination path prefix
        }]
      }
    },

    copy: {
      main: {
        files: [
          {src: [
            '.htaccess',
            './vendor/**',
            './font/**',
            './twigs/**',
            './app/**',
            './index.php',
            './routes.yml',
            './settings.yml'],
            dest: '../<%= finalFolder %>/', filter: 'isFile'},
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
        src: '../<%= finalFolder %>/settings.yml',
        overwrite: true,
        replacements: [
          {from: 'base_url: /<%= initFolder %>/', to: 'base_url: /<%= finalFolder %>/'},
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
      grunt.loadNpmTasks('grunt-text-replace');
      grunt.loadNpmTasks('grunt-usemin');

      grunt.task.run('compass:min', 'useminPrepare', 'concat',
          'uglify', 'copy', 'cssmin', 'replace', 'usemin');

  });

  grunt.registerTask('compileimg', [], function() {

      grunt.loadNpmTasks('grunt-contrib-compass');
      grunt.loadNpmTasks('grunt-usemin');
      grunt.loadNpmTasks('grunt-contrib-concat');
      grunt.loadNpmTasks('grunt-contrib-uglify');
      grunt.loadNpmTasks('grunt-contrib-imagemin');
      grunt.loadNpmTasks('grunt-contrib-copy');
      grunt.loadNpmTasks('grunt-contrib-cssmin');
      grunt.loadNpmTasks('grunt-text-replace');
      grunt.loadNpmTasks('grunt-usemin');

      grunt.task.run('compass:min', 'useminPrepare', 'concat',
          'uglify', 'imagemin', 'copy', 'cssmin', 'replace', 'usemin');

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
