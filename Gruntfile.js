module.exports = function(grunt) {

    // 1. All configuration goes here 
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        concat: {
            client: {
                src: [
                    'client/scripts/core/inputEngine.js',
                    'client/scripts/core/renderEngine.js',
                    'client/scripts/core/clientPlayer.js',
                    'client/scripts/core/clientGameEngine.js',
                    'client/scripts/core/spriteSheet.js'
                ],
                dest: 'client/scripts/client.js'
            },
            shared: {
                src: [
                    "shared/core/core.js",
                    "shared/core/box2D.js",
                    "shared/core/constants.js",
                    "shared/core/factory.js",
                    "shared/core/timer.js",
                    "shared/core/entity.js",
                    "shared/core/gameEngine.js",
                    "shared/core/physicsEngine.js",
                    "shared/core/player.js",
                    "shared/core/tileMap.js",
                    "shared/core/util.js",
                    "shared/maps/outside.js",
                    "shared/environment/spawnPoint.js",
                    "shared/environment/spawner.js",
                    "shared/environment/teleporter.js",
                ],
                dest: 'shared/shared.js'
            }
        },
        
        uglify: {
            client: {
                options: {
                    compress: {
                        drop_console: true
                    },
                    preserveComments: false,
                },
                src: 'client/scripts/client.js',
                dest: 'client/scripts/client.min.js'
            },
            shared: {                
                options: {
                    compress: {
                        drop_console: true
                    },
                    preserveComments: false,
                },
                src: 'shared/shared.js',
                dest: 'shared/shared.min.js',
            }
        },
        
        imagemin: {
            dynamic: {
                files: [{
                    expand: true,
                    cwd: 'client/img/',
                    src: ['**/*.{png,jpg,gif}'],
                    dest: 'client/img/'
                }]
            }
        },
        
        watch: {
            dev: {
                files: [
                    'client/scripts/core/*.js',
                    'client/scripts/pregame/*.js',
                    'shared/core/*.js', 
                    'shared/core/environment/*.js',
                    'shared/core/maps/*.js',
                    'shared/core/weapons/*.js'
                    ],
                tasks: ['concat', 'uglify']
            }
        },
    });

    // 3. Where we tell Grunt we plan to use this plug-in.
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-imagemin');
    grunt.loadNpmTasks('grunt-contrib-watch');
    
    // 4. Where we tell Grunt what to do when we type "grunt" into the terminal.
    grunt.registerTask('default', ['concat', 'uglify', 'imagemin']);
    grunt.registerTask('dev', ['concat', 'uglify', 'imagemin', 'watch']);
    
};