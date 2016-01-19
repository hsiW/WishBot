module.exports = function(grunt) {

    grunt.initConfig({
        concat: {
            options: {
                separator: ';',
            },
            dist: {
                src: [
                    'src/intro.js',
                    'src/tag-parser.js',
                    'src/styled-console.js',
                    'src/outro.js'
                ],
                dest: 'dist/styled-console.meta.js',
            },
        },
        metascript: {
            target: {
                options: {
                    mode: "transform"
                },
                src: "dist/styled-console.meta.js",
                dest: "dist/styled-console.js"

            }
        },
        uglify: {
            target: {
                files: {
                    'dist/styled-console.min.js' : ['dist/styled-console.js']
                }
            }
        },
        clean: ["dist/styled-console.meta.js"]
    });

    grunt.loadNpmTasks('grunt-metascript');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-clean');

    grunt.registerTask('default', ['concat', 'metascript', 'uglify', 'clean']);

};