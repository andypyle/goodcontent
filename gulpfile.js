let gulp 		= 	require('gulp'),
	assign 		= 	require('lodash.assign'),
	browserify 	= 	require('browserify'),
	watchify 	= 	require('watchify'),
	babelify 	= 	require('babelify'),
	fs 			= 	require('fs'),
	path 		= 	require('path'),
	source 		= 	require('vinyl-source-stream'),
	buffer 		= 	require('vinyl-buffer'),
	browserSync = 	require('browser-sync').create(),
	// GULP PLUGINS 
	sass 		= 	require('gulp-sass'),
	prefix 		= 	require('gulp-autoprefixer'),
	gutil 		= 	require('gulp-util'),
	uglify 		= 	require('gulp-uglify'),
	concat 		= 	require('gulp-concat'),
	minifyCSS 	= 	require('gulp-minify-css'),
	rename 		=	require('gulp-rename'),
	exit 		= 	require('gulp-exit'),
	nodemon 	= 	require('gulp-nodemon');

let sources = {
	manager: {
		sass: path.resolve('manager','static','src','sass'),
		js: path.resolve('manager','static','src','js')
	},
	site: {
		sass: path.resolve('public','src','sass'),
		js: path.resolve('public','src','js')
	}	
};

let entries = {
	manager: {
		sass: path.join(sources.manager.sass, 'style.sass'),
		js: path.join(sources.manager.js, 'index.js')
	},
	site: {
		sass: path.join(sources.site.sass, 'style.sass'),
		js: path.join(sources.site.js, 'index.js')
	}
}

let output = {
	manager: {
		sass: path.resolve('manager','static','styles'),
		js: path.resolve('manager','static','js')
	},
	site: {
		sass: path.resolve('public','styles'),
		js: path.resolve('public','js')
	}
}




// DEV SERVER
gulp.task('browsersync', ['nodemon'], function(){
    browserSync.init(null, {
        proxy: 'http://localhost:3000',
        files: ['public/**/*.*', 'manager/static/**/*.*'],
        port: 3002
    });

    gulp.watch('./public/src/sass/**/*.sass', ['sass-site']);
    gulp.watch('./manager/static/src/sass/**/*.sass', ['sass-manager']);  
});

gulp.task('sass-site', () => {
	gulp.src(entries.site.sass)
    .pipe(sass({'outputStyle':'expanded'})
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
            'IE 11'
            ],
        cascade: true
    }))
    .pipe(rename('style.css'))
    .pipe(gulp.dest(output.site.sass))
    .pipe(browserSync.stream());
});

gulp.task('sass-manager', () => {
	gulp.src(entries.manager.sass)
    .pipe(sass({'outputStyle':'expanded'})
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
            'IE 11'
            ],
        cascade: true
    }))
    .pipe(rename('style.css'))
    .pipe(gulp.dest(output.manager.sass))
    .pipe(browserSync.stream());
});

// JS - site
let siteJsOptions = {
    entries: [entries.site.js],
    extensions: ['.js'],
    transform: [babelify.configure({
        presets: ["es2015"]
    })],
    debug: true,
    insertGlobals: false
};
let siteOpts = assign({}, watchify.args, siteJsOptions);
let siteB = watchify(browserify(siteOpts));

// 'gulp scripts' task to build scripts
gulp.task('site-js', bundleSiteScripts);
siteB.on('update', bundleSiteScripts);
siteB.on('log', gutil.log);

// bundle() function for js bundling
function bundleSiteScripts(){
    return siteB.bundle()
        .on('error', gutil.log.bind(gutil, 'Browserify error.'))
        .pipe(source('scripts.js'))
        .pipe(buffer())
        .on('error', gutil.log)   
        .pipe(gulp.dest(output.site.js))
        .pipe(browserSync.reload({stream:true, once: true}));
};

// JS - manager
let managerJsOptions = {
    entries: [entries.manager.js],
    extensions: ['.js'],
    transform: [babelify.configure({
        presets: ["es2015"]
    })],
    debug: true,
    insertGlobals: false
};
let managerOpts = assign({}, watchify.args, managerJsOptions);
let managerB = watchify(browserify(managerOpts));

// 'gulp scripts' task to build scripts
gulp.task('manager-js', bundleManagerScripts);
managerB.on('update', bundleManagerScripts);
managerB.on('log', gutil.log);

// bundle() function for js bundling
function bundleManagerScripts(){
    return managerB.bundle()
        .on('error', gutil.log.bind(gutil, 'Browserify error.'))
        .pipe(source('scripts.js'))
        .pipe(buffer())
        .on('error', gutil.log)   
        .pipe(gulp.dest(output.manager.js))
        .pipe(browserSync.reload({stream:true, once: true}));
};

gulp.task('nodemon', function (cb) {	
	let started = false;

	return nodemon({
		script: 'app.js'
	}).on('start', function () {
		// to avoid nodemon being started multiple times
		if (!started) {
			cb();
			started = true; 
		} 
	});
});


// DEFAULT
gulp.task('default', ['nodemon','browsersync','sass-site','sass-manager']);