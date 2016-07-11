'use strict';

module.exports = function(grunt) {

	// Dynamically load npm tasks
	//
	require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

	grunt.initConfig({

		pkg: grunt.file.readJSON('package.json'),

		// Banner

		banner: '\n/*\n * Generated with Grunt on <%= grunt.template.today("dd.mm.yyyy") %> at <%= grunt.template.today("H:MM:ss") %>\n */\n',

		///////////////////////////////////////////////////////////

		// Directories

		buildDir: '_static/build',
		sourceDir: 'app/frontend',
		bowerDir: 'bower_components',
		moduleDir: 'app/NxModule/*',

		// Styles
		stylesDevOnly: [
			'<%=sourceDir%>/css/dev/*.{less,css}'
		],

		styles: [
			'<%=bowerDir%>/spartan-grid/src/spartan.less',
			'<%=sourceDir%>/css/lib/*.{less,css}',
			'<%=sourceDir%>/css/*.less',
			'<%=moduleDir%>/*.less',
			'<%=moduleDir%>/skins/*.less'
		],


		// Scripts

		scripts: [
			'<%=bowerDir%>/terrificjs/dist/terrific.js',
			'<%=bowerDir%>/terrificjs-extensions/terrific-extensions.js',
			'<%=bowerDir%>/lawg/lawg.js',
			'<%=bowerDir%>/enquire/dist/enquire.js',

			'<%=sourceDir%>/js/*.js',
			'<%=moduleDir%>/*.js',
			'<%=moduleDir%>/skins/*.js'
		],

		scriptsLint: [
			'<%=sourceDir%>/js/*.js', '<%=moduleDir%>/*.js', '<%=moduleDir%>/skins/*.js'
		],

		///////////////////////////////////////////////////////////

		// Styles
		// - @Link https://www.npmjs.com/package/grunt-less-imports
		less_imports: {
			dev: {
				src: ['<%=stylesDevOnly%>', '<%=styles%>'],
				dest: '<%=buildDir%>/less-imports.less'
			},
			dist: {
				src: ['<%=styles%>'],
				dest: '<%=buildDir%>/less-imports.less'
			}
		},

		less: {
			dev: {
				options: {
					// Enable source maps.
					sourceMap: true,

					// Write the source map to a separate file with the given filename.
					sourceMapFilename: '<%=buildDir%>/styles.css.map',

					// Override the default url that points to the sourcemap from the compiled css file.
					sourceMapURL: 'styles.css.map',

					// Adds this path onto the less file paths in the source map.
					sourceMapRootpath: '../../',

					modifyVars: {
						'static-base': '..'
					}
				},
				files: {
					'<%=buildDir%>/styles.css': '<%=buildDir%>/less-imports.less'

				}
			},
			dist: {
				options: {
					compress: true,

					// Enable source maps.
					sourceMap: true,

					// Write the source map to a separate file with the given filename.
					sourceMapFilename: '<%=buildDir%>/styles.css.map',

					// Override the default url that points to the sourcemap from the compiled css file.
					sourceMapURL: 'styles.css.map',

					// Adds this path onto the less file paths in the source map.
					sourceMapRootpath: '../../',

					modifyVars: {
						'static-base': '..'
					}
				},
				files: {
					'<%=buildDir%>/styles.css': '<%=buildDir%>/less-imports.less'
				}
			}
		}

		/**
		 * https://github.com/nDmitry/grunt-autoprefixer
		 */
		,
		autoprefixer: {
			options: {
				cascade: true,
				map: true
			},
			all: {
				'<%=buildDir%>/styles.css': '<%=buildDir%>/styles.css'
			}
		},


		///////////////////////////////////////////////////////////

		// Scripts

		eslint: {
			target: ['Gruntfile.js', '<%=scriptsLint%>']
		},

		uglify: {

			dev: {
				options: {
					banner: '<%= banner %>',
					preserveComments: 'all',
					mangle: false,
					beautify: true,
					sourceMap: true,
					sourceMapName: '<%=buildDir%>/scripts.js.map'
				},

				files: {
					'<%=buildDir%>/scripts.js': ['<%=scripts%>']
				}
			},

			min: {
				options: {
					banner: '<%= banner %>',
					sourceMap: '<%=buildDir%>/scripts.js.map',
					sourceMapRoot: '../',
					sourceMappingURL: 'scripts.js.map'
				},

				files: {
					'<%=buildDir%>/scripts.js': ['<%=scripts%>']
				}
			}
		},

		///////////////////////////////////////////////////////////

		// Copy

		copy: {
			main: {
				files: [{
					expand: true,
					cwd: '<%=sourceDir%>',
					src: ['index.html', 'fonts/**', 'img/**'],
					dest: '<%=buildDir%>'
				}]
			}
		},

		///////////////////////////////////////////////////////////

		// BrowserSync

		browserSync: {
			dev: {
				bsFiles: {
					src: '<%=buildDir%>/styles.css'
				},
				options: {

					// Change this according to your host
					proxy: 'advokatur-egger.loc',
					watchTask: true,
					open: false
				}
			}
		},

		///////////////////////////////////////////////////////////

		// Clean

		clean: [
			'<%=buildDir%>'
		],

		///////////////////////////////////////////////////////////

		// Watch

		watch: {
			options: {
				spawn: false
			},
			styles: {
				files: ['<%=styles%>'],
				tasks: ['styles-dev']
			},
			scripts: {
				files: ['<%=scripts%>'],
				tasks: ['scripts-dev']
			},
			gruntfile: {
				files: ['Gruntfile.js'],
				tasks: 'default'
			}
		}
	});

	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// Main Tasks

	// The default task is dist, so if you forget the param,
	// it degrades to a dist build

	// Default Task
	grunt.registerTask('default', [
		'clean',
		'styles-dist',
		'scripts-dist',
		'copy'
	]);

	// Dev Watch Task
	grunt.registerTask('dev', [
		'clean',
		'styles-dev',
		'scripts-dev',
		'copy',
		'browserSync',
		'watch'
	]);

	//
	// Sub Tasks

	grunt.registerTask('styles-dev', [
		'less_imports:dev',
		'less:dev',
		'autoprefixer'
	]);

	grunt.registerTask('styles-dist', [
		'less_imports:dist',
		'less:dist',
		'autoprefixer'
	]);

	grunt.registerTask('scripts-dev', [
		'eslint',
		'uglify:dev'
	]);

	grunt.registerTask('scripts-dist', [
		'eslint',
		'uglify:min'
	]);
};
