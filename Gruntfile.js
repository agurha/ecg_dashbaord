/**
 * Created with JetBrains WebStorm.
 * User: agurha
 * Date: 31/03/2013
 * Time: 13:14
 * To change this template use File | Settings | File Templates.
 */

var path = require('path');
var lrSnippet = require('grunt-contrib-livereload/lib/utils').livereloadSnippet;

var folderMount = function folderMount(connect, point) {
  return connect.static(path.resolve(point));
};

module.exports = function (grunt) {

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-compress');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-regarde');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-livereload');

  grunt.initConfig({
    pkg: '<json:package.json>',
    meta: {
      banner: '\n/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' + '<%= grunt.template.today("yyyy-mm-dd") %>\n ' + '<%= pkg.homepage ? "* " + pkg.homepage + "\n *\n " : "" %>' + '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;\n' + ' * Licensed under the <%= _.pluck(pkg.licenses, "type").join(", ") %> license */'
    },
    clean: {
      "default": ['dist']
    },
    copy: {
      "default": {
        files: [
          {
            src: ["src/frontend/libs/foundation/modernizr.foundation.js"],
            dest: "dist/js/modernizr.js"
          },
          {
            src: ["src/frontend/libs/angular/angular-loader.js"],
            dest: "dist/js/angular-loader.js"
          },
          {
            src: ["src/frontend/libs/syntaxHighlighter/scripts/shCore.js"],
            dest: "dist/js/shCore.js"
          },
          {
            src: ["src/frontend/libs/syntaxHighlighter/scripts/shBrushPhp.js"],
            dest: "dist/js/shBrushPhp.js"
          },
          {
            src: ["src/frontend/libs/syntaxHighlighter/styles/shCoreRDark.css"],
            dest: "dist/css/shCore.css"
          },
          {
            src: ["src/frontend/libs/syntaxHighlighter/styles/shThemeRDark.css"],
            dest: "dist/css/shThemeDefault.css"
          },
          {
            expand: true, flatten: true, src: ["src/frontend/fonts/*"], dest: "dist/fonts/"
          }
        ]
      }
    },
    livereload: {
      port: 35729 // Default livereload listening port.
    },
    connect: {
      livereload: {
        options: {
          port: 9001,
          middleware: function (connect, options) {
            return [lrSnippet, folderMount(connect, options.base)]
          }
        }
      }
    },
    // Configuration to be run (and then tested)
    regarde: {
      txt: {
        files: '**/*.txt',
        tasks: ['livereload']
      }
    },
    jade: {
      compile: {
        options: {
          pretty: true
        },
        files: grunt.file.expandMapping(['**/*.jade'], 'dist', {
          cwd: 'src/views',
          rename: function(destBase, destPath){
            return destBase + destPath.replace(/\.jade$/, '.html');
          }
        })
      }
    },
    uglify: {
      dist: {
        files: {
          'dist/js/script.js': ['dist/js/script.js']
        }
      }
    },
    cssmin: {
      compress: {
        files: {
          'dist/css/main.css': ['dist/css/main.css']
        }
      }
    }
  });

  grunt.registerTask('default', ['clean', 'copy', 'build-dev', 'force']);
  grunt.registerTask('prod', ['clean', 'copy', 'build-prod', 'minify', 'force']);

  grunt.registerTask('force', ['livereload-start', 'connect', 'regarde']);

  grunt.registerTask('minify', ['uglify:dist', 'cssmin']);

  grunt.registerTask('deploy', ['clean', 'copy', 'build-prod', 'minify', 'rsync:deploy']);

  grunt.registerTask('deploy-staging', ['clean', 'copy', 'build-prod', 'minify', 'rsync:staging']);
};
