'use strict';

var fs = require('fs');
var path = require('path');
var _ = require('lodash');

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
    banner: '/*! <%= pkg.name %> v<%= pkg.version %>\n' +
      '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
      '* Copyright (c) 2014-<%= grunt.template.today("yyyy") %>' +
      ' - Licensed <%= pkg.license %> */\n',
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
    cssmin: {
      target: {
        files: [{
          expand: true,
          cwd: 'dist/css',
          src: ['*.css', '!*.min.css'],
          dest: 'dist/css',
          ext: '.record.min.css'
        }]
      }
    },
    sass: {
      dist: {
        files: {
          'src/css/videojs.record.css': 'src/css/font/scss/videojs-icons.scss'
        }
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
  grunt.loadNpmTasks('grunt-sass');

  grunt.registerTask('font', ['generate-font', 'update-base64']);
  grunt.registerTask('pretask', ['jshint', 'concat', 'vjslanguages', 'sass']);
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
      if (['ttf', 'svg', 'eot', 'woff'].indexOf(ext) > -1) {
        grunt.file.copy(absdir, 'dist/css/font/' + filename);
      }
    });

    // Minify CSS
    grunt.task.run(['cssmin']);
  });

  grunt.registerTask('generate-font', function() {
    var done = this.async();

    var webfontsGenerator = require('webfonts-generator');
    var iconConfig = require('./src/css/font/icons.json');
    var svgRootDir = iconConfig['root-dir'];
    var icons = iconConfig.icons;

    var iconFiles = icons.map(function(icon) {
      // If root-dir is specified for a specific icon, use that.
      if (icon['root-dir']) {
        return icon['root-dir'] + icon.svg;
      }

      // Otherwise, use the default root-dir.
      return svgRootDir + icon.svg;
    });

    webfontsGenerator({
      files: iconFiles,
      dest: 'src/css/font/',
      fontName: iconConfig['font-name'],
      cssDest: 'src/css/font/scss/_icons.scss',
      cssTemplate: 'src/css/font/templates/scss.hbs',
      htmlDest: 'src/css/font/preview.html',
      htmlTemplate: 'src/css/font/templates/html.hbs',
      html: true,
      rename: function(iconPath) {
        var fileName = path.basename(iconPath);

        var iconName = _.result(_.find(icons, function(icon) {
          var svgName = path.basename(icon.svg);

          return svgName === fileName;
        }), 'name');

        return iconName;
      },
      types: ['svg', 'ttf', 'woff', 'eot']
    }, function(error) {
      if (error) {
        console.error(error);
        done(false);
      }

      done();
    });

  });

  grunt.registerTask('update-base64', function() {
    var iconScssFile = './src/css/font/scss/_icons.scss';
    var fontFiles = {
      ttf: './src/css/font/videojs-record.ttf',
      woff: './src/css/font/videojs-record.woff'
    };

    var scssContents = fs.readFileSync(iconScssFile).toString();

    Object.keys(fontFiles).forEach(function(font) {
      var fontFile = fontFiles[font];
      var fontContent = fs.readFileSync(fontFile);

      var regex = new RegExp("(url.*font-" + font + ".*base64,)([^\\s]+)(\\).*)");

      scssContents = scssContents.replace(regex, "$1" + fontContent.toString('base64') + "$3");
    });

    fs.writeFileSync(iconScssFile, scssContents);
  });

};
