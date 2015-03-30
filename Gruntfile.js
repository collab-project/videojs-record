'use strict';

module.exports = function(grunt) {
  var pkg, version, verParts;
  pkg = grunt.file.readJSON('package.json');

  verParts = pkg.version.split('.');
  version = {
  full: pkg.version,
    major: verParts[0],
    minor: verParts[1],
    patch: verParts[2]
  };
  version.majorMinor = version.major + '.' + version.minor;

  grunt.initConfig({
    pkg: pkg,
    build: {
      src: 'src/js/dependencies.js',
      options: {
        baseDir: 'src/js/'
      }
    },
    banner: '/*! <%= pkg.name %> - v<%= pkg.version %>\n' +
      '* Copyright (c) <%= grunt.template.today("yyyy") %>' +
      ' Licensed <%= pkg.license %> */\n',
    clean: {
      files: ['dist']
    },
    concat: {
      options: {
        banner: '<%= banner %>',
        stripBanners: true
      },
      dist: {
        src: 'src/js/videojs.record.js',
        dest: 'dist/videojs.record.js'
      }
    },
    uglify: {
      options: {
        banner: '<%= banner %>'
      },
      dist: {
        src: '<%= concat.dist.dest %>',
        dest: 'dist/videojs.record.min.js'
      }
    },
    jshint: {
      src: {
        options: {
          jshintrc: '.jshintrc'
        },
        src: ['src/js/*.js']
      },
    },
    csscomb: {
      src: {
        files: {
          'src/css/videojs.record.css': ['src/css/videojs.record.css']
        }
      }
    },
    cssmin: {
      target: {
        files: [{
          expand: true,
          cwd: 'dist/css',
          src: ['*.css'],
          dest: 'dist/css',
          ext: '.record.min.css'
        }]
      }
    },
    watch: {
      gruntfile: {
        files: '<%= jshint.gruntfile.src %>',
        tasks: ['jshint:gruntfile']
      },
      src: {
        files: '<%= jshint.src.src %>',
        tasks: ['jshint:src']
      },
    },
    vjslanguages: {
      defaults: {
        files: {
          'dist/lang': ['lang/*.json']
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-videojs-languages');
  grunt.loadNpmTasks('grunt-csscomb');

  grunt.registerTask('pretask', ['jshint', 'csscomb', 'concat', 'vjslanguages']);
  grunt.registerTask('default', ['pretask', 'build', 'uglify']);

  grunt.registerMultiTask('build', 'Building Source', function(){

    // Copy over CSS
    grunt.file.copy('src/css/videojs.record.css', 'dist/css/videojs.record.css');

    // Inject version number into css file
    var css = grunt.file.read('dist/css/videojs.record.css');
    css = css.replace(/GENERATED_AT_BUILD/g, version.full);
    grunt.file.write('dist/css/videojs.record.css', css);

    // Copy over font files
    grunt.file.recurse('src/css/font', function(absdir, rootdir, subdir, filename) {
      // only fonts
      var ext = filename.substring(filename.lastIndexOf('.') + 1, filename.length);
      if (["ttf", "svg", "eot", "woff"].indexOf(ext) > -1) {
        grunt.file.copy(absdir, 'dist/css/font/' + filename);
      }
    });

    // Minify CSS
    grunt.task.run(['cssmin']);
  });

};
