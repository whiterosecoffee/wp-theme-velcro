var theme =         './sebastian';
var parent =        './velcro';
var styleFiles =    theme + '/scss/style.scss';
var jsFiles =       theme + '/js/*.js';
var projectURL =    'http://localhost/sebastian/'; // theme URL. Could be something like localhost:8888.

var gulp = require( 'gulp' ); // Gulp of-course
var sass = require( 'gulp-sass' ); // Gulp pluign for Sass compilation.
var concat = require( 'gulp-concat' ); // Concatenates JS files
var sourcemaps = require( 'gulp-sourcemaps' ); // Maps code in a compressed file (E.g. style.css) back to it’s original position in a source file (E.g. structure.scss, which was later combined with other css files to generate style.css)
var notify = require( 'gulp-notify' ); // Sends message notification to you
var browserSync = require( 'browser-sync' ).create(); // Reloads browser and injects CSS. Time-saving synchronised browser testing.
var reload = browserSync.reload; // For manual browser reload.
var watch = require( 'gulp-watch' );
var plumber = require( 'gulp-plumber' );
var util = require( 'gulp-util' );
var uglify = require( 'gulp-uglify' );
var minify = require( 'gulp-minifier' );
//var autoprefixer = require('gulp-autoprefixer');

// See the uglify documentation for more details
var _uglifySettings = {
	compress: {
		comparisons: true,
		conditionals: true,
		dead_code: true,
		drop_console: true,
		unsafe: true,
		unused: true
	}
};

var minifySettigns = {
	minify: true,
	collapseWhitespace: true,
	conservativeCollapse: true,
	//minifyJS: true,
	minifyCSS: true,
	getKeptComment: function ( content, filePath ) {
		var m = content.match( /\/\*![\s\S]*?\*\//img );
		return m && m.join( '\n' ) + '\n' || '';
	}
};

gulp.task( 'browserSync', function () {
	browserSync.init( {
		proxy: projectURL,
		open: false,
		injectChanges: true,
		port: 3000,
		notify: false,
		reloadDelay: 1000,
		browser: [ "google chrome" ]
	} );
} );

gulp.task( 'styles', function () {
	gulp.src( styleFiles ).pipe( plumber( {
		errorHandler: function ( error ) {
			util.beep();
			util.beep();
			util.beep();
			util.log( util.colors.red( 'Error (' + error.plugin + '): ' + error.message ) );
			this.emit( 'end' );
		}
	} ) )
    .pipe( sourcemaps.init() ).pipe( sass().on( 'error', sass.logError ) ).pipe( sourcemaps.write() ).pipe( plumber.stop() ).pipe( gulp.dest( theme ) ).pipe( notify( {
        message: 'TASK: "styles" Completed! 💯',
        onLast: true
    } ) );
    //.pipe( autoprefixer() )
    //.pipe( minify( {minifySettigns} ) );
} );

gulp.task( 'js', function () {
	gulp.src( [ jsFiles, parent + '/js/*.js' ] )
    .pipe( sourcemaps.init() )
    .pipe( concat( 'project.js' ) )
    //.pipe( uglify( _uglifySettings ) )
    .pipe( sourcemaps.write() )
    .pipe( gulp.dest( theme ) )
    .pipe( notify( {
		message: 'TASK: "js" Completed! 💯',
		onLast: true
	} ) );
} );

gulp.task( 'build', [ 'styles', 'js', 'watch', 'browserSync' ] );
gulp.task( 'watch', function () {
	gulp.watch( './**/**.scss', [ 'styles', reload ] );
	gulp.watch( jsFiles, [ 'js', reload ] );
	gulp.watch( parent + '/js/*.js', [ 'js', reload ] );
} );
