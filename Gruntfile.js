module.exports = function(grunt) {

    // 1. All configuration goes here 
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        concat: {
            client: {
                src: [
                    'src/client/scripts/core/inputEngine.js',
                    'src/client/scripts/core/renderEngine.js',
                    'src/client/scripts/core/clientPlayer.js',
                    'src/client/scripts/core/clientGameEngine.js',
                    'src/client/scripts/core/spriteSheet.js'
                ],
                dest: 'src/client/clientgame.js'
            },
            shared: {
                src: [
                    "src/shared/core/core.js",
                    "src/shared/core/box2D.js",
                    "src/shared/core/constants.js",
                    "src/shared/core/factory.js",
                    "src/shared/core/timer.js",
                    "src/shared/core/entity.js",
                    "src/shared/core/gameEngine.js",
                    "src/shared/core/physicsEngine.js",
                    "src/shared/core/player.js",
                    "src/shared/core/tileMap.js",
                    "src/shared/core/util.js",
                    "src/shared/maps/outside.js",
                    "src/shared/environment/spawnPoint.js",
                    "src/shared/environment/spawner.js",
                    "src/shared/environment/teleporter.js",
                ],
                dest: 'src/shared/sharedgame.js'
            },
            pregame: {
                src: [
                    "src/client/scripts/pregame/assetLoader.js",
                    "src/client/scripts/pregame/xhr.js",
                    "src/shared/core/core.js"
                ],
                dest: 'public/js/pregame.js'
            },
            merge: {
                src: [
                    "src/shared/sharedgame.js",
                    "src/client/clientgame.js"
                ],
                dest: 'public/js/clientgame.js'
            }
        },
        
        uglify: {
            min: {
                options: {
                    compress: {
                        drop_console: true
                    },
                    preserveComments: false,
                },
                src: 'public/js/clientgame.js',
                dest: 'public/js/clientgame.min.js'
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
                    'src/client/scripts/core/*.js',
                    'src/client/scripts/pregame/*.js',
                    'src/shared/core/*.js', 
                    'src/shared/core/environment/*.js',
                    'src/shared/core/maps/*.js',
                    'src/shared/core/weapons/*.js'
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