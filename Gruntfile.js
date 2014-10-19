/*global module:false*/
module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        meta: {
            banner: '/*\n' +
                '  @license <%= pkg.title || pkg.name %> - v<%= pkg.version %>\n' +
                '  (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %> <%= pkg.homepage %>\n' +
                '  License: <%= _.pluck(pkg.licenses, "type").join(", ") %>\n' +
                ' */\n'
        },
        // Join files
        concat: {
            js: {
                src: [
                    'src/**/*.js'
                ],
                dest: 'dist/<%= pkg.name %>.js'
            },
            less: {
                src: [
                    'src/**/*.less'
                ],
                dest: 'dist/<%= pkg.name %>.less'
            }
        },
        min: {
            js: {
                src: ['dist/<%= pkg.name %>.js'],
                dest: 'dist/<%= pkg.name %>.min.js'
            }
        },
        // Minify CSS Files
        cssmin: {
            options: {
                banner: '<%= meta.banner %>'
            },
            css: {
                src: ['dist/<%= pkg.name %>.css'],
                dest: 'dist/<%= pkg.name %>.min.css'
            }
        },
        // LINT CSS Files
        csslint: {
            css: {
                src: "src/**/*.css",
                rules: {
                    "import": false,
                    //   'regex-selectors':false, // remove
                    'adjoining-classes': false,
                    //   'unqualified-attributes':false, // remove
                    'outline-none': false,
                    'box-sizing': false,
                    'fallback-colors': false,
                    'box-model': false
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
                unused: true,
                browser: true,
                multistr: true,
                globals: {
                    jQuery: true,
                    console: true,
                    module: true,
                    angular: true
                }
            }
        },
        // Minify JS files
        uglify: {
            options: {
                banner: '<%= meta.banner %>'
            },
            dist: {
                files: {
                    'dist/<%= pkg.name %>.min.js': ['<%= concat.js.dest %>']
                }
            }
        },
        // Add/remove CSS vendor profixes
        autoprefixer: {
            options: {
                browsers: ['last 2 version', 'ie 8', 'ie 9']
            },
            dist: {
                files: {
                    'dist/<%= pkg.name %>.css': 'dist/<%= pkg.name %>.css'
                }
            }
        },
        // Automaticall run tasks on file changes
        watch: {
            options: {
                livereload: true,
            },
            gruntfile: {
                files: ['Gruntfile.js'],
                tasks: ['concat', 'less', 'csslint', 'cssbeautifier', 'autoprefixer', 'cssmin', 'jshint', 'jsbeautifier', 'uglify', 'clean'],
                options: {
                    spawn: false,
                },
            },
            js: {
                files: ['src/**/*.js'],
                tasks: ['jshint', 'jsbeautifier', 'concat', 'uglify', 'clean'],
                options: {
                    spawn: false,
                },
            },
            css: {
                files: ['src/**/*.css'],
                tasks: ['csslint', 'cssbeautifier', 'concat', 'autoprefixer', 'cssmin', 'clean'],
                options: {
                    spawn: false,
                },
            },
            less: {
                files: ['src/**/*.less'],
                tasks: ['concat', 'less', 'csslint', 'cssbeautifier', 'autoprefixer', 'cssmin', 'clean'],
                options: {
                    spawn: false,
                },
            }
        },
        // Make CSS look nice
        cssbeautifier: {
            files: ["src/**/*.css"]
        },
        // Make JS look nice
        jsbeautifier: {
            files: ['Gruntfile.js', 'src/**/*.js']
        },
        // Generate CSS from LESS
        less: {
            dist: {
                files: {
                    "dist/<%= pkg.name %>.css": "dist/<%= pkg.name %>.less"
                }
            }
        },
        // Remove dist artefacts
        clean: {
            js: ["dist/**/*.js", "!dist/**/*.min.js"],
            less: ["dist/**/*.less"],
            css: ["dist/**/*.css", "!dist/**/*.min.css"]
        },
        // Auto update any open browser windows
        browserSync: {
            dev: {
                bsFiles: {
                    src: 'dist/**/*.css'
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
    grunt.loadNpmTasks('grunt-cssbeautifier');
    grunt.loadNpmTasks('grunt-jsbeautifier');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-clean');
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
