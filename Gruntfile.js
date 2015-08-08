module.exports = function( grunt ) {
    'use strict';

    var pkg = grunt.file.readJSON( 'package.json' );

    // Project configuration.
    grunt.initConfig({
        pkg: pkg,

        banner: '/*! <%= pkg.name %> - v<%= pkg.version %> | <%= pkg.author %> | MIT license */',

        jshint: {
            files: {
                src: [
                    'lib/*.js'
                ]
            },
            options: {
                globals: {
                    'localStorage': false,
                    'navigator': false,
                    'console': false,
                    'alert': false
                },
                'loopfunc': true,
                'jquery': true,
                'browser': true,
                'es3': true,
                '-W065': true,
                'shadow': true,
                'strict': true,
                'expr': true
            }
        },

        copy: {
            dist: {
                src: 'lib/gridded.js',
                dest: 'dist/jquery.gridded.js',
            }
        },

        uglify: {
            options: {
                banner: '<%= banner %>\n'
            },
            dist: {
                files : [{
                    expand: true,
                    cwd: 'dist',
                    src: [ 'jquery.gridded.js' ],
                    dest: 'dist',
                    ext: '.min.js',
                    extDot: 'last'
                }]
            }
        },

        watch: {
            javascript: {
                files: [ 'lib/*.js'],
                tasks: [ 'uglify' ],
                options: {
                    spawn: false
                }
            }
        }

    });

    grunt.registerTask( 'dist', [ 'copy:dist', 'uglify:dist' ] );

    grunt.loadNpmTasks( 'grunt-contrib-copy' );
    grunt.loadNpmTasks( 'grunt-contrib-uglify' );
    grunt.loadNpmTasks( 'grunt-contrib-jshint' );
    grunt.loadNpmTasks( 'grunt-contrib-watch' );
};