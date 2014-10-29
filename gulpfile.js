var gulp = require('gulp'),
	pkg = require('./package.json')
	less= require('gulp-less'),
	concat = require('gulp-concat'),
	csslint = require('gulp-csslint'),
	autoprefixer = require('gulp-autoprefixer'),
	rename = require('gulp-rename'),
	minifyCSS = require('gulp-minify-css'),
	jshint = require('gulp-jshint'),
	uglify = require('gulp-uglify'),
	header = require('gulp-header'),
	bump = require('gulp-bump'),
	browserSync = require('browser-sync');

	var banner = ['/**',
	  ' * <%= pkg.title || pkg.name %>',
	  ' * @version v<%= pkg.version %>',
	  ' * @link <%= pkg.homepage %>',  
	  ' * @copyright (c)<%= new Date().getFullYear() %> <%= pkg.author.name %>',  
	  ' * @license <%= pkg.licenses[0].type %> (<%= pkg.licenses[0].url %>)',
	  ' */',
	  ''].join('\n');

// Auto load plugins with gulp-load-plugins https://www.npmjs.org/package/gulp-load-plugins
/*
var plugins = require('gulp-load-plugins')({
    // pattern: 'gulp-*', // the glob to search for
    // config: 'package.json', // where to find the plugins, by default  searched up from process.cwd() 
    scope: ['dependencies', 'devDependencies', 'peerDependencies'], // which keys in the config to look within
    replaceString: 'gulp-', // what to remove from the name of the module when adding it to the context
    camelize: true, // if true, transforms hyphenated plugins names to camel case
    lazy: true, // whether the plugins should be lazy loaded on demand
});
*/

gulp.task('styles', function() {
  gulp.src('src/**/*.less')
	// Concat all LESS files
    .pipe(concat(pkg.name+'.less'))
	// Convert LESS to CSS
	.pipe(less())
	// Add vendor prefixes to CSS
	.pipe(autoprefixer({
		browsers:['last 2 version', 'ie 8', 'ie 9'],
		cascade:true
	}))
	// LINT CSS
	.pipe(csslint())
	// Minify CSS
	.pipe(minifyCSS())
	// Rename destination file
	.pipe(rename(pkg.name+'.min.css'))
	// Add banner
	.pipe(header(banner, { pkg : pkg } ))
	// Save output
    .pipe(gulp.dest('dist/'));
	// Bump patch version
	gulp.run('bump');
});

gulp.task('bump', function(){
  gulp.src('./package.json')
	.pipe(bump({type:'patch'}))
	.pipe(gulp.dest('./'));
});

gulp.task('js', function() {
  gulp.src('src/**/*.js')
	// Concat all JS files
    .pipe(concat(pkg.name+'.js'))
	// HINT JS
	.pipe(jshint())
	// Minify JS
	.pipe(uglify())
	// Rename destination file
	.pipe(rename(pkg.name+'.min.js'))
	// Add banner
	.pipe(header(banner, { pkg : pkg } ))
	// Save output
    .pipe(gulp.dest('dist/'));
	// Bump patch version
	gulp.run('bump');
});


gulp.task('browser-sync', function () {
   var files = [
      'dist/*.css',
      'dist/*.js',
      '*.html'
   ];
   browserSync.init(files, {
      server: {
         baseDir: './'
      }
   });
});

gulp.task('watch', function () {
   gulp.run('browser-sync');
   gulp.watch('src/**/*.less', ['styles']);
   gulp.watch('src/**/*.js', ['js']);
});

gulp.task('default', function() {
   gulp.run('watch');
});
