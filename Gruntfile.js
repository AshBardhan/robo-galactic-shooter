module.exports = function (grunt) {
	grunt.initConfig({
		copy: {
			'build': {
				expand: true,
				cwd: 'src',
				src: ['index.html', "game.js"],
				dest: 'dist/'
			}
		},
		concat: {
			'js': {
				src: ['src/core.js', 'src/sprite.js', 'src/gameLoop.js', 'src/pointer.js', 'src/keyboard.js', 'src/pixel.js', 'src/riffwave.js', 'src/sfxr.js', 'src/index.js'],
				dest: 'src/game.js',
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
	grunt.loadNpmTasks('grunt-contrib-uglify-es');
	grunt.loadNpmTasks('grunt-contrib-watch');

	grunt.registerTask('build', ['concat', 'copy', 'uglify:js']);
	grunt.registerTask('test', ['concat', 'watch']);
};