module.exports = function (grunt) {
    'use strict';
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        paths: {
            root : 'wp-content/themes/tri/'
        },

        //Clean our directories.
        clean: {
            options: {
                force: true
            },
            js: [
                'js/build/*'
            ],
            css: [
                'css/build/*'
            ]
        },
        //Combine our Javascript files.
        concat: {
            options: {
                separator: "\n\n"
            },
            vendor: {
                src: [
                    '<%= paths.root %>js/vendor/jquery.js',
                    '<%= paths.root %>js/vendor/respond.to.js',
                    '<%= paths.root %>js/vendor/unveil.js',
                    '<%= paths.root %>js/vendor/tether.js',
                    '<%= paths.root %>js/vendor/bootstrap.js'
                ],
                dest: '<%= paths.root %>js/build/vendor.js'
            },
            main : {
                src: [
                    '<%= paths.root %>js/main.js'
                ],
                dest: '<%= paths.root %>js/build/main.js'
            }
        },
        //Minfiy our Javascript.
        uglify: {
            options: {
                compress: {
                    warnings: false
                },
                mangle: true,
                preserveComments: /^!|@preserve|@license|@cc_on/i
            },
            vendor: {
                src: ['<%= concat.vendor.dest %>'],
                dest: '<%= paths.root %>js/build/min/vendor.min.js'
            },
            main :{
                src: ['<%= concat.main.dest %>'],
                dest: '<%= paths.root %>js/build/min/main.min.js'
            }
        },
        //Compile our LESS to CSS.
        sass: {
            tri: {
                src: '<%= paths.root %>scss/theme.scss',
                dest: '<%= paths.root %>css/build/<%= pkg.name %>.css'
            }
        },
        //Minify our CSS.
        cssmin: {
            options: {
                compatibility: 'ie8',
                keepSpecialComments: '*',
                sourceMap: false,
                advanced: false
            },
            build: {
                files: [{
                    expand: true,
                    cwd: '<%= paths.root %>css/build/',
                    src: [
                        '*.css',
                        '!*.css.map',
                        '!*.min.css'
                    ],
                    dest: '<%= paths.root %>css/build/min/',
                    ext: '.min.css'
                }]
            }
        },
        //Watch for file changes.
        watch: {
            css: {
                files: '<%= paths.root %>scss/**/*.scss',
                tasks: [
                    'clean:css',
                    'build-css'
                ],
                options: {
                    //livereload: false
                }
            },
            js: {
                files: [
                    'Gruntfile.js',
                    '<%= paths.root %>js/gorilla/**/*.js',
                    '<%= paths.root %>js/vendor/**/*.js'
                ],
                tasks: [
                    'clean:js',
                    'build-js'
                ],
                options: {
                    reload: true
                }
            }
        }
    });

    // These plugins provide necessary tasks.
    require('load-grunt-tasks')(grunt);
    require('time-grunt')(grunt);

    // JS task.
    grunt.registerTask('build-js', ['clean:js', 'concat:vendor', 'concat:main', 'uglify:vendor', 'uglify:main']);

    //CSS task.
    grunt.registerTask('build-css', ['clean:css', 'sass', 'cssmin']);

    //Build task.
    grunt.registerTask('build', ['build-js', 'build-css']);

    //Watch task.
    grunt.registerTask('watch:build', ['watch:css', 'watch:js']);

    grunt.registerTask('default', 'build');

};