module.exports = function(grunt) {

    // 1. All configuration goes here 
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        concat: {
            client: {
                src: 'client/scripts/core/*.js',
                dest: 'client/scripts/client.js',
            },
            shared: {
                src: [
                    'shared/core/*.js',
                    'shared/environment/*.js',
                    'shared/maps/*.js',
                    'shared/weapons/*.js',
                ],
                dest: 'shared/shared.js',
            },
            
        },
        
        uglify: {
            client: {
                src: 'client/scripts/client.js',
                dest: 'client/scripts/client.min.js'
            },
            shared: {
                src: 'shared/shared.js',
                dest: 'shared/shared.min.js',
            },
        },
    });

    // 3. Where we tell Grunt we plan to use this plug-in.
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    
    // 4. Where we tell Grunt what to do when we type "grunt" into the terminal.
    grunt.registerTask('default', ['concat', 'uglify']);

};