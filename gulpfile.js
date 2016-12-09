const gulp 							=		require('gulp'),
			assign 						=		require('lodash.assign'),
			browserify 				=		require('browserify'),
			watchify 					=		require('watchify'),
			babelify 					=		require('babelify'),
			fs 								=		require('fs'),
			es 								=		require('event-stream'),
			path 							=		require('path'),
			source 						=		require('vinyl-source-stream'),
			buffer 						=		require('vinyl-buffer'),
			browserSync 			=		require('browser-sync').create();

			// GULP PLUGINS 
const sass 							=		require('gulp-sass'),
			prefix 						=		require('gulp-autoprefixer'),
			eslint 						=		require('gulp-eslint'),
			gutil 						=		require('gulp-util'),
			mocha 						=		require('gulp-mocha'),
			uglify 						=		require('gulp-uglify'),
			concat 						=		require('gulp-concat'),
			minifyCSS 				=		require('gulp-minify-css'),
			rename 						=		require('gulp-rename'),
			exit 							=		require('gulp-exit'),
			nodemon 					=		require('gulp-nodemon');



/**
 * Entry / output points
 * Index of entry array should match index of its respective output array.
 */
const sassFiles = {
		entries: [
			{
				file: './manager/static/src/sass/style.sass',	// SASS Entry file for manager section,
				path: './manager/static/src/sass/'
			},
			{
				file: './public/src/sass/style.sass',					// SASS Entry point for public,
				path: './public/src/sass/'
			},			
		],
		outputs: [
				'./manager/static/styles',							// SASS Output for manager section
				'./public/styles', 											// SASS Output for public.
		],
};

const jsFiles = {
		entries: [
				'./manager/static/src/js/index.js', 		// JS Entry point for manager section
				'./public/src/js/index.js',							// JS Entry point for public
		],
		outputs: [
				'./manager/static/js',									// JS Output for manager section
				'./public/js'	,													// JS Output for public
		],
};



/**
 * Test paths
 */
const testPaths = {
	server: [
		'./testhelpers/index.js',
		'./**/*.spec.js',
		'!./node_modules/**/*.*',
		'!./public/src/**/*.js',
		'!./manager/static/src/**/*.js',
	],
	client: [
		'./testhelpers/index.js',
		'./public/src/js/**/*.spec.js',
		'./manager/static/src/js/**/*.spec.js',
	],
	all: [
		'./testhelpers/index.js',
		'/**/*.spec.js',
		'!./node_modules/**/*.*',
	],
};



/**
 * Browser-sync task
 */
gulp.task('browsersync', ['nodemon'], function(){
				browserSync.init(null, {
								proxy: 'http://localhost:3000',
								files: ['./**/*.*','!./node_modules'],
								port: 3002
						});

				gulp.watch([
					'./public/src/js/**/*.js',
					'./manager/static/src/js/**/*.js',
				], ['js']);

				gulp.watch([
					'./public/src/sass/**/*.sass',
					'./manager/static/src/sass/**/*.sass',
				], ['sass']);
});


/**
 * Styles task
 */
gulp.task('sass', () => {
		const sassTasks = sassFiles.entries.map((entry, i) => {
				return gulp
						.src(entry.file)
						.pipe(sass({
								'outputStyle':'expanded',
								'includePaths':[entry.path]
						})
						.on('error', sass.logError))
						.pipe(prefix({
								browsers: [
										'> 1%',
										'last 2 versions',
										'firefox >= 4',
										'safari 7',
										'safari 8',
										'IE 8',
										'IE 9',
										'IE 10',
										'IE 11',
								],
								cascade: true
						}))
						.pipe(rename('style.css'))
						.pipe(gulp.dest(sassFiles.outputs[i]))
						.pipe(browserSync.stream());
		});

		return es.merge.apply(null, sassTasks);
});



/**
 * JS task
 */
gulp.task('js', () => {
		const jsTasks = jsFiles.entries.map((entry, i) => {
				return browserify({
						entries: entry,
						extensions: ['.js'],
						transform: [
								babelify.configure({
										presets: ["es2015"]
								})
						],
				})
				.bundle()
				.on('error', gutil.log.bind(gutil, 'Browserify error.'))
				.pipe(source('scripts.js'))
				.pipe(buffer())
				.on('error', gutil.log)
				.pipe(gulp.dest(jsFiles.outputs[i]))
				.pipe(browserSync.reload({ stream: true, once: true }));
		});

		return es.merge.apply(null, jsTasks);
});


 /**
 * ES/JS Linting task - all js
 */
gulp.task('lint-all-js', () => {
		return gulp
				.src([
						'./**/*.js',
						'!node_modules/**',
						'!./app/**/*.spec.js',
				])
				.pipe(eslint())
				.pipe(eslint.format())
				.pipe(eslint.failAfterError());
});


 /**
 * ES/JS Linting task - server
 */
gulp.task('lint-server-js', () => {
		return gulp
				.src([
						'./**/*.js',
						'!node_modules/**',
						'!./**/*.spec.js',
						'!./public/**/*.js',
						'!./manager/static/**/*.js',
				])
				.pipe(eslint())
				.pipe(eslint.format())
				.pipe(eslint.failAfterError());
});


 /**
 * ES/JS Linting task - client js
 */
gulp.task('lint-client-js', () => {
		return gulp
				.src([
						'./public/src/js/**/*.js',
						'./manager/static/src/js/**/*.js',
				])
				.pipe(eslint())
				.pipe(eslint.format())
				.pipe(eslint.failAfterError());
});



 /**
 * Tests task - run all tests once.
 */
gulp.task('tests:run-all', () => {
		return gulp
				.src(testPaths.all)
				.pipe(mocha());
});


 /**
 * Tests task - run server tests once.
 */
gulp.task('tests:run-server', () => {
		return gulp
				.src(testPaths.server)
				.pipe(mocha());
});


/**
 * Tests task - watch server tests.
 */
gulp.task('tests:watch-server', () => {
		return gulp
				.src(testPaths.server)
				.pipe(mocha({
						watch: true,
						reporter: 'spec',
						})
				);
});


/**
 * Tests task - run client-side tests.
 */
gulp.task('tests:run-client', () => {
		return gulp
				.src(testPaths.client)
				.pipe(mocha());
});


/**
 * Tests task - watch client-side tests
 */
gulp.task('tests:watch-client', () => {
		return gulp
				.src(testPaths.client)
				.pipe(mocha({
						watch: true,
						reporter: 'spec',
						})
				);
});



 /**
 * Nodemon task
 */
gulp.task('nodemon', (cb) => {  
		let started = false;

		return nodemon({
				script: './app.js',
				ignore: ['./public/','./manager/static/']
		}).on('start', () => {
						// to avoid nodemon being started multiple times
						if (!started) {
								cb();
								started = true; 
						} 
		});
});



 /**
 * Default task
 */
gulp.task('default', ['sass', 'js', 'browsersync']);