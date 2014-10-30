var gulp = require('gulp'),
	pkg = require('./package.json'),
	browserSync = require('browser-sync'),
	plugins = require("gulp-load-plugins")({
		pattern: ['gulp-*', 'gulp.*'],
		replaceString: /\bgulp[\-.]/
	});
	
	var banner = ['/**',
	  ' * <%= pkg.title || pkg.name %>',
	  ' * @version v<%= pkg.version %>',
	  ' * @link <%= pkg.homepage %>',  
	  ' * @copyright (c)<%= new Date().getFullYear() %> <%= pkg.author.name %>',  
	  ' * @license <%= pkg.licenses[0].type %> (<%= pkg.licenses[0].url %>)',
	  ' */',
	  ''].join('\n');

 
gulp.task('build:styles', function() {
  return gulp.src('src/**/*.less', {base:'./'})
	// Concat all LESS files
    .pipe(plugins.concat(pkg.name+'.less'))
	// Convert LESS to CSS
	.pipe(plugins.less())
	// Add vendor prefixes to CSS
	.pipe(plugins.autoprefixer({
		browsers:['last 2 version', 'ie 8', 'ie 9'],
		cascade:true
	}))
	// LINT CSS
	.pipe(plugins.csslint())
	// Minify CSS
	.pipe(plugins.minifyCss())
	// Rename destination file
	.pipe(plugins.rename(pkg.name+'.min.css'))
	// Add banner
	.pipe(plugins.header(banner, { pkg : pkg } ))
	// Save output
    .pipe(gulp.dest('dist/'));
	// Bump patch version

});

gulp.task('bump', function(){
  return gulp.src('./package.json')
	.pipe(plugins.bump({type:'patch'}))
	.pipe(gulp.dest('./'));
});

gulp.task('build:js',function() {
  return gulp.src('src/**/*.js', {base: './'})
	// .pipe(prettify())
	// .pipe(gulp.dest('./'))
	// Concat all JS files
    .pipe(plugins.concat(pkg.name+'.js'))
	// HINT JS
	.pipe(plugins.jshint())
	// Minify JS
	.pipe(plugins.uglify())
	// Rename destination file 
	.pipe(plugins.rename(pkg.name+'.min.js'))
	// Add banner
	.pipe(plugins.header(banner, { pkg : pkg } ))
	// Save output	
    .pipe(gulp.dest('dist/'));
	// Bump patch version
});

gulp.task('build:icons', function(){
  return gulp.src(['src/icons/*.svg'])
    .pipe(plugins.iconfontCss({
      fontName: 'pk',
      path: 'less',
	  fontPath:'src/',
      targetPath: '../fontIcons.less'
    }))
    .pipe(plugins.iconfont({
      fontName: 'fontIcons'
     }))
    .pipe(gulp.dest('src/fonts/src/'));
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

gulp.task('watch', ['browser-sync'], function () {
   gulp.watch('src/**/*.less', ['build:styles', 'bump']);
   gulp.watch('src/**/*.js', ['build:js', 'bump']);
   return true;
});
gulp.task('default', ['watch']);

gulp.task('travis', ['build:styles', 'build:js']);
