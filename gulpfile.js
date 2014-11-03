var gulp = require('gulp'),
	pkg = require('./package.json'),
	browserSync = require('browser-sync'),
	plugins = require("gulp-load-plugins")({
		pattern: ['gulp-*', 'gulp.*'],
		replaceString: /\bgulp[\-.]/
	}),
	banner = ['/**',
	  ' * <%= pkg.title || pkg.name %>',
	  ' * @version v<%= pkg.version %>',
	  ' * @link <%= pkg.homepage %>',  
	  ' * @copyright (c)<%= new Date().getFullYear() %> <%= pkg.author.name %>',  
	  ' * @license <%= pkg.licenses[0].type %> (<%= pkg.licenses[0].url %>)',
	  ' */',
	  ''].join('\n');

 
gulp.task('build:styles', function() {
  return gulp.src('src/**/*.less', {base:'./'})
    .pipe(plugins.concat(pkg.name+'.less'))
	.pipe(plugins.less())
	.pipe(plugins.autoprefixer({
		browsers:['last 2 version', 'ie 8', 'ie 9'],
		cascade:true
	}))
	.pipe(plugins.csslint())
	.pipe(plugins.minifyCss())
	.pipe(plugins.rename(pkg.name+'.min.css'))
	.pipe(plugins.header(banner, { pkg : pkg } ))
    .pipe(gulp.dest('dist/'));
});

gulp.task('bump', function(){
  return gulp.src('./package.json')
	.pipe(plugins.bump({type:'patch'}))
	.pipe(gulp.dest('./'));
});

gulp.task('build:js',function() {
  return gulp.src('src/**/*.js', {base: './'})
    .pipe(plugins.concat(pkg.name+'.js'))
	.pipe(plugins.jshint())
	.pipe(plugins.uglify())
	.pipe(plugins.rename(pkg.name+'.min.js'))
	.pipe(plugins.header(banner, { pkg : pkg } ))
    .pipe(gulp.dest('dist/'));
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
   gulp.watch('src/**/*.js', ['build:js', 'bump', 'document']);
   return true;
});

gulp.task('git:discard', function () {
	plugins.run('git stash').exec();
	plugins.run('git checkout master').exec();
	plugins.run('git pull').exec();
});
gulp.task('git:discard', function () {
	plugins.run('git stash').exec();
	plugins.run('git checkout master').exec();
	plugins.run('git pull').exec();
});
gulp.task('git:commit', function () {
	plugins.run('git add -A && git commit -m "CI auto-commit"').exec();
	plugins.run('git push').exec();
});





gulp.task('document', function () {
	plugins.run('yuidoc').exec();
   gulp.src('_docs_main.css', {base:'./'})
	.pipe(plugins.rename('main.css'))
	.pipe(plugins.wait(5000))
   .pipe(gulp.dest('docs/assets/css/'));	
});

gulp.task('default', ['watch']);
gulp.task('travis', ['build:styles', 'build:js']);
