const sass = require("node-sass");

module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON("package.json"),

    // configure sass -----------------------------------
    sass: {
      dist: {
        options: {
          implementation: sass,
          outputStyle: "compressed",
          sourceMap: true
        },
        files: {
          "dist/css/main.min.css": "src/scss/main.scss"
        }
      }
    },
    // configure autoprefixer for css
    autoprefixer: {
      dist: {
        options: {
          map: true,
          browsers: ["last 2 version", "ie 8"]
        },
        files: {
          "dist/css/main.min.css": "dist/css/main.min.css"
        }
      }
    },

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
      },
      scripts: {
        files: "src/scss/**/*.scss",
        tasks: ["sass", "autoprefixer"]
      }
    }
  });

  grunt.registerTask("default", ["watch"]);

  grunt.loadNpmTasks("grunt-sass");
  grunt.loadNpmTasks("grunt-autoprefixer");
  grunt.loadNpmTasks("grunt-contrib-uglify");
  grunt.loadNpmTasks("grunt-contrib-watch");
  grunt.loadNpmTasks("grunt-browserify");
};
