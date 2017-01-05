module.exports = function (grunt) {
	'use strict';

	var fs = require('fs');
	var path = require('path');

	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

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
                    'js/vendor/jquery.js',
                    'js/vendor/jquery.validate.js',
                    'js/vendor/unveil.js',
                    'js/vendor/menu.js'
                ],
				dest: 'js/build/vendor.js'
			},
            main : {
                src: [
                    'js/main.js'
                ],
                dest: 'js/build/main.js'
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
				dest: 'js/build/min/vendor.min.js'
			},
            main: {
                src: ['<%= concat.main.dest %>'],
                dest: 'js/build/min/main.min.js'
            }
		},
        //Compile our LESS to CSS.
		less: {
			main: {
				options: {
					strictMath: false,
					sourceMap: true,
					outputSourceFiles: true,
					sourceMapURL: '<%= pkg.name %>.css.map',
                    sourceMapFilename: 'css/build/<%= pkg.name %>.css.map'
				},
				src: 'css/less/styles.less',
                dest: 'css/build/<%= pkg.name %>.css'
			},
            pages : {
                options: {
                    strictMath: false,
                    sourceMap: true,
                    outputSourceFiles: true
                },
                files: [{
                    expand: true,
                    cwd: 'css/less/',
                    src: [
                        '*.less',
                        '!styles.less',
                        '!uikit.less'
                    ],
                    dest: 'css/build/',
                    ext: '.css'
                }]
            }
		},
        //Add browser prefixes.
        autoprefixer: {
            options: {
                browsers: ['last 2 versions']
            },
            build: {
                options: {
                    map: true
                },
                src: 'css/build/*.css'
            }
        },
        //Minify our CSS.
        cssmin: {
            options: {
                compatibility: 'ie9',
                keepSpecialComments: '*',
                sourceMap: false,
                advanced: false
            },
            build: {
                files: [{
                    expand: true,
                    cwd: 'css/build/',
                    src: [
                        '*.css',
                        '!*.css.map',
                        '!*.min.css'
                    ],
                    dest: 'css/build/min/',
                    ext: '.min.css'
                }]
            }
        },
        //Watch for file changes.
        watch: {
            css: {
                files: 'css/less/**/*.less',
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
                    'js/vendor/**/*.js'
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
    grunt.registerTask('build-css', ['clean:css', 'less', 'autoprefixer', 'cssmin']);

    //Build task.
    grunt.registerTask('build', ['build-js', 'build-css']);

    //Watch task.
    grunt.registerTask('watch:build', ['watch:css', 'watch:js']);
};