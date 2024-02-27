module.exports = function (grunt) {
	grunt.initConfig({
		copy: {
			'build': {
				expand: true,
				cwd: 'src',
				src: ['index.html'],
				dest: 'dist/'
			}
		},
		concat: {
			'js': {
				src: ['src/core.js', 'src/sprite.js', 'src/gameLoop.js', 'src/pointer.js', 'src/keyboard.js', 'src/pixel.js', 'src/riffwave.js', 'src/sfxr.js', 'src/index.js'],
				dest: 'dist/game.js',
			}
		},
		uglify: {
			'js': {
				expand: true,
				cwd: 'dist',
				src: ['game.js'],
				dest: 'dist/'
			}
		},
		watch: {
			'src': {
				files: ['src/**.js', '!src/game.js'],
				tasks: ['concat']
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-watch');

	grunt.registerTask('release', ['concat', 'copy', 'uglify']);
	grunt.registerTask('default', ['concat', 'copy', 'watch']);
};