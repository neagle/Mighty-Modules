/*global module:false, require:true*/
module.exports = function (grunt) {

	// Load all Grunt tasks automatically
	require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

	// Project configuration.
	grunt.initConfig({
		// Metadata.
		pkg: grunt.file.readJSON('package.json'),
		banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
			'<%= grunt.template.today("yyyy-mm-dd") %>\n' +
			'<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
			'* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
			' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n',
		// Task configuration.
		copy: {
			dev: {
				expand: true,
				cwd: 'src/',
				src: [
					'**',
					// Exclude folders that are built/compiled separately
					'!images/**',
					'!scss/**',
					'!mighty/**'
				],
				dest: 'dev/'
			},
			mighty: {
				expand: true,
				cwd: 'src/mighty',
				src: [
					'**/*'
				],
				dest: 'dev/mighty/'
			},
			prod: {
				expand: true,
				cwd: 'src/',
				src: [
					'**',
					// Exclude folders that are built/compiled separately
					'!images/**',
					'!scss/**'
				],
				dest: 'prod/'
			}
		},
		// Minify .png, .jpg, and .gif files and place optimized versions in
		// build directories
		imagemin: {
			dev: {
				files: [{
					expand: true,
					cwd: 'src/images',
					src: ['**/*.{png,jpg,gif}'],
					dest: 'dev/images'
				}]
			},
			prod: {
				files: [{
					expand: true,
					cwd: 'src/images',
					src: ['**/*.{png,jpg,gif}'],
					dest: 'prod/images'
				}]
			}
		},

		// Compile SCSS files to CSS
		sass: {
			dev: {
				files: {
					'dev/css/style.css': 'src/scss/style.scss'
				}
			},
			prod: {
				files: {
					'prod/css/style.css': 'src/scss/style.scss'
				}
			}
		},

		replace: {
			dev: {
				options: {
					patterns: [{
						match: 'basePath',
						replacement: '/',
						expression: false
					}],
					force: true
				},
				files: [
					{ src: ['dev/mighty.js'], dest: './' }
				]
			},
			prod: {
				options: {
					patterns: [{
						match: 'basePath',
						replacement: 'http://mighty.aol.net/',
						expression: false
					}],
					force: true
				},
				files: [
					{ src: ['prod/mighty.js'], dest: './' }
				]
			}
		},

		autoprefixer: {
			dev: {
				src: 'dev/**/*.css'
			},
			prod: {
				src: 'prod/**/*.css'
			}
		},

		concat: {
			options: {
				banner: '<%= banner %>',
				stripBanners: true
			},
			dist: {
				src: ['lib/<%= pkg.name %>.js'],
				dest: 'dist/<%= pkg.name %>.js'
			}
		},
		uglify: {
			options: {
				banner: '<%= banner %>'
			},
			dist: {
				src: '<%= concat.dist.dest %>',
				dest: 'dist/<%= pkg.name %>.min.js'
			}
		},
		jshint: {
			options: {
				jshintrc: './.jshintrc'
			},
			gruntfile: {
				src: 'Gruntfile.js'
			},
			js: {
				src: [
					'src/**/**.*.js',
					// Never check minified files
					// (Though what are they doing there, anyway?)
					'!src/**/**.min.js'
				]
			}
		},
		watch: {
			gruntfile: {
				files: '<%= jshint.gruntfile.src %>',
				tasks: ['jshint:gruntfile']
			},
			sass: {
				files: ['src/scss/**/*.scss'],
				tasks: ['sass:dev']
			},
			images: {
				files: ['src/images/**/*'],
				tasks: ['imagemin:dev']
			},
			mighty: {
				files: ['src/mighty/**/*'],
				tasks: ['copy:mighty']
			},
			miscFiles: {
				files: [
					'src/**/*',
					'!src/scss/**',
					'!src/images/**',
					'!src/mighty/**'
				],
				tasks: ['copy:dev']
			},
			filesWithVars: {
				files: [
					'src/mighty.js'
				],
				tasks: ['replace:dev']
			},
			css: {
				files: [
					'dev/**/*.css'
				],
				tasks: ['autoprefixer:dev'],
				options: {
					debounceDelay: 5000
				}
			}
		},
		php: {
			dev: {
				options: {
					base: './dev'
				}
			}
		},

		clean: {
			options: {
				// Output what this task would do without actually deleting anything.
				// Vital for debugging.
				//'no-write': true
			},
			builds: ['dev/**/*', 'prod/**/*']
		}
	});

	// Default task.
	grunt.registerTask('default', ['imagemin:dev', 'sass:dev', 'copy:dev', 'copy:mighty', 'autoprefixer:dev',
		'replace:dev']);
	grunt.registerTask('prod', ['imagemin:prod', 'sass:prod', 'copy:prod', 'autoprefixer:prod', 'replace:prod']);

	grunt.registerTask('watch-serve', ['default', 'php', 'watch']);

};
