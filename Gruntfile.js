'use strict';

var fs = require('fs');
var path = require('path');
var _ = require('lodash');

module.exports = function(grunt) {
  require('time-grunt')(grunt);

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
    build: {
      assets: 'src/css/'
    },
    uglify: {
      options: {
        banner: '<%= banner %>'
      },
      dist: {
        options: {
          sourceMap: 'dist/videojs.record.min.js.map',
          sourceMapRoot: '/'
        },
        src: '<%= concat.dist.dest %>',
        dest: 'dist/videojs.record.min.js'
      },
      plugins: {
        files: grunt.file.expandMapping(['src/js/plugins/*.js'], 'dist/', {
          rename: function(destBase, destPath) {
            var pluginName = destPath.substr(
              destPath.lastIndexOf('/') + 1).replace('.js', '.min.js');
            var newPath = destBase + pluginName;
            return newPath;
          },
        })
      }
    },
    jshint: {
      src: {
        options: {
          jshintrc: '.jshintrc'
        },
        src: ['src/js/**/*.js']
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
          'src/css/videojs.record.css': 'src/css/font/scss/videojs-icons-codepoints.scss'
        }
      }
    },
    jscs: {
      src: ['<%= jshint.src.src %>'],
      options: {
        config: '.jscsrc',
        esnext: false, // If you use ES6 http://jscs.info/overview.html#esnext
        verbose: true, // If you need output with rule names http://jscs.info/overview.html#verbose
        fix: false, // Autofix code style violations when possible.
        requireCurlyBraces: [ "if" ]
      }
    },
    jsonlint: {
      language: {
        src: ['lang/*.json']
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
  grunt.loadNpmTasks('grunt-jscs');
  grunt.loadNpmTasks('grunt-jsonlint');

  grunt.registerTask('font', ['generate-font', 'update-base64', 'sass', 'wrapcodepoints']);
  grunt.registerTask('pretask', ['jshint', 'jscs', 'jsonlint', 'concat', 'vjslanguages', 'sass', 'wrapcodepoints']);
  grunt.registerTask('default', ['pretask', 'build', 'uglify']);

  grunt.registerMultiTask('build', 'build and copy css and fonts', function(){
    var srcDir = this.data;
    var distStylesheet = 'dist/css/videojs.record.css'

    // Copy over CSS
    grunt.file.copy(srcDir + 'videojs.record.css', distStylesheet);
    grunt.log.writeln('Stylesheet ' + distStylesheet['yellow'] +
      ' with version ' + version.full['green'] + ' created.\n');

    // Inject version number into css file
    var css = grunt.file.read(distStylesheet);
    css = css.replace(/GENERATED_AT_BUILD/g, version.full);
    grunt.file.write(distStylesheet, css);

    // Copy over font files
    grunt.file.recurse(srcDir + 'font', function(absdir, rootdir, subdir, filename) {
      // only fonts
      var ext = filename.substring(filename.lastIndexOf('.') + 1, filename.length);
      if (['ttf', 'svg', 'eot', 'woff'].indexOf(ext) > -1) {
        var fpath = 'dist/css/font/' + filename;
        grunt.file.copy(absdir, fpath);
        grunt.log.writeln('Font ' + fpath['yellow'] + ' copied.');
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
      cssDest: 'src/css/font/scss/_icons-codepoints.scss',
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

  // Sass turns unicode codepoints into utf8 characters.
  // We don't want that so we unwrapped them in the templates/scss.hbs file.
  // After sass has generated our css file, we need to wrap the codepoints
  // in quotes for it to work.
  grunt.registerTask('wrapcodepoints', function() {
    var cssPath = path.normalize('./src/css/videojs.record.css');
    var css = grunt.file.read(cssPath);
    grunt.file.write(cssPath, css.replace(/(\\f\w+);/g, "'$1';"));

    var sassPath = path.normalize('./src/css/font/scss/_icons-codepoints.scss');
    var normalSassPath = path.normalize('./src/css/font/scss/_icons.scss');
    var sass = grunt.file.read(sassPath);
    grunt.file.write(normalSassPath, sass.replace(/(\\f\w+),/g, "'$1',"));
  });

  grunt.registerTask('update-base64', function() {
    var iconScssFile = './src/css/font/scss/_icons-codepoints.scss';
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
