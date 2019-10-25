module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON("package.json"),

    // configure browserify for es6+ transpile -----------------------------------
    browserify: {
      dist: {
        files: {
          "src/js-compiled/index-compiled.js": "src/js/index.js"
        },
        options: {
          transform: [["babelify", { presets: "env" }]],
          browserifyOptions: {
            debug: false
          }
        }
      }
    },

    // configure uglify for minified and bundled js -----------------------------------
    uglify: {
      dist: {
        options: {
          sourceMap: false
        },
        files: {
          "dist/js/index.min.js": "src/js-compiled/index-compiled.js"
        }
      }
    },

    // configure watch task -----------------------------------
    watch: {
      javascript: {
        files: "src/**/*.js",
        tasks: ["browserify:dist", "uglify:dist"]
      }
    }
  });

  grunt.registerTask("default", ["watch"]);

  grunt.loadNpmTasks("grunt-contrib-uglify");
  grunt.loadNpmTasks("grunt-contrib-watch");
  grunt.loadNpmTasks("grunt-browserify");
};
