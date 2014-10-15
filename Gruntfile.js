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
    concat: {
      js: {
        src: [
                '../pk-base/src/*.js',
                '../pk-draggable/src/*.js',
                '../pk-scroll/src/*.js',
                '../pk-modal/src/*.js',
                '../pk-rating/src/*.js',
                '../pk-toggleswitch/src/*.js',
                '../pk-slider/src/*.js'
              ],
        dest: 'dist/<%= pkg.name %>.js'
      },
      css: {
        src: [
                '../pk-base/src/*.css',
                '../pk-draggable/src/*.css',
                '../pk-scroll/src/*.css',
                '../pk-modal/src/*.css',
                '../pk-rating/src/*.css',
                '../pk-toggleswitch/src/*.css',
                '../pk-slider/src/*.css'
              ],
        dest: 'dist/<%= pkg.name %>.css'
      }
    },
    min: {
      js: {
        src: ['dist/<%= pkg.name %>.js'],
        dest: 'dist/<%= pkg.name %>.min.js'
      }
    },
    cssmin: {
        css: {
            src: ['dist/pocketknife.css'],
            dest: 'dist/pocketknife.min.css'
        }
    },
    jshint: {
  // define the files to lint
  files: ['gruntfile.js', 'dist/**/*.js'],
  // configure JSHint (documented at http://www.jshint.com/docs/)
  options: {
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
        multistr:true
      },
      globals: {
        jQuery: true,
        console: true,
        module: true,
        angular:true
      }
  },
},
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
}
  });
  grunt.loadNpmTasks('grunt-css');

grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  // Default task.
  grunt.registerTask('default', ['concat','uglify','cssmin']);

  // Travis CI task.
  // grunt.registerTask('travis', 'lint concat min');
};
