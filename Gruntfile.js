/*global module:false*/
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    meta: {
      banner: '/*\n' +
        ' * <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
        '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
        '<%= pkg.homepage ? " * " + pkg.homepage + "\n" : "" %>' +
        ' * Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>\n' +
        ' * Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %>\n' +
        ' */'
    },
    // Join files
    concat: {
      js: {
        src: [
                'src/**/*.js'
              ],
        dest: 'dist/<%= pkg.name %>.min.js'
      },
      css: {
        src: [
                'src/**/*.css'
              ],
        dest: 'dist/<%= pkg.name %>.min.css'
      }
    },
    min: {
      js: {
        src: ['dist/<%= pkg.name %>.min.js'],
        dest: 'dist/<%= pkg.name %>.min.js'
      }
    },
    // Minify CSS Files
    cssmin: {
        css: {
            src: ['dist/<%= pkg.name %>.min.css'],
            dest: 'dist/<%= pkg.name %>.min.css'
        }
    },
    // LINT CSS Files
    csslint: {
      css: {
          src: "src/**/*.css",
          rules: {
              "import": false,
              'regex-selectors':false, // remove
              'adjoining-classes':false,
              'unqualified-attributes':false, // remove
              'outline-none':false,
              'box-sizing':false,
              'fallback-colors':false,
              'box-model':false
           //   "overqualified-elements": 2
          }
      }
   },
   // LINT JS files
    jshint: {
  // define the files to lint
  files: ['gruntfile.js', 'src/**/*.js'],
  // configure JSHint (documented at http://www.jshint.com/docs/)
  
    options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        boss: true,
        eqnull: true,
        unused:true,
        browser: true,
        multistr:true,
        globals: {
          jQuery: true,
          console: true,
          module: true,
          angular:true
        }
      }
},
// Minify JS files
uglify: {
  options: {
    // the banner is inserted at the top of the output
    banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
  },
  dist: {
    files: {
      'dist/<%= pkg.name %>.min.js': ['<%= concat.js.dest %>']
    }
  }
},
// Add/remove CSS vendor profixes
autoprefixer: {
  options:{
  browsers: ['last 2 version', 'ie 8', 'ie 9']
},
        dist: {
            files: {
                'dist/<%= pkg.name %>.min.css': 'dist/<%= pkg.name %>.min.css'
            }
        }
    },
    // Automaticall run tasks on file changes
watch: {
    options: {
        livereload: true,
    },
    js: {
        files: ['Gruntfile.js','src/**/*.js'],
        tasks: ['jshint','concat', 'uglify'],
        options: {
            spawn: false,
        },
    },
        css: {
        files: ['Gruntfile.js','src/**/*.css'],
        tasks: ['csslint','concat','autoprefixer', 'cssmin'],
        options: {
            spawn: false,
        },
    } 
},

        browserSync: {
            dev: {
                bsFiles: {
                    src : 'dist/**/*.css'
                },
                options: {
                    watchTask: true // < VERY important
                }
            }
        }

  });
  grunt.loadNpmTasks('grunt-css');
grunt.loadNpmTasks('grunt-notify');
grunt.loadNpmTasks('grunt-contrib-watch');
grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
   grunt.loadNpmTasks('grunt-autoprefixer');
   grunt.loadNpmTasks('grunt-browser-sync');
  // Default task.
  // grunt.registerTask('default', ['watch', 'browserSync', 'csslint', 'jshint','concat', 'uglify','autoprefixer','cssmin']);
  grunt.registerTask('default', ['watch', 'browserSync']);
/**
 * @license pocketknife v1.2.20
 * (c) 2014-2014 Pocketknife, Ltd. http://angularjs.org
 * License: MIT
 */
  // Travis CI task.
  // grunt.registerTask('travis', 'lint concat min');
};
