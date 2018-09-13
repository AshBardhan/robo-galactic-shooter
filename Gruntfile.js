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
		zip: {
			'using-cwd': {
				cwd: 'dist/',
				src: ['dist/**'],
				dest: 'robo-galactic-shooter.zip'
			}
		},
		watch: {
			'src': {
				files: ['src/**'],
				tasks: ['concat:test']
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify-es');
	grunt.loadNpmTasks('grunt-zip');
	grunt.loadNpmTasks('grunt-contrib-watch');

	grunt.registerTask('build', ['concat', 'copy', 'uglify:js', 'zip']);
	grunt.registerTask('test', ['concat', 'watch']);
};