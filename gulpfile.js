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
/*
	  ' *  ',
	  ' * The MIT License (MIT)',
	  ' *  ',
	  ' * Copyright (c) 2014 Pocketknife Ltd.',
	  ' *  ',
	  ' * Permission is hereby granted, free of charge, to any person obtaining a copy',
	  ' * of this software and associated documentation files (the "Software"), to deal',
	  ' * in the Software without restriction, including without limitation the rights',
	  ' * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell',
	  ' * copies of the Software, and to permit persons to whom the Software is',
	  ' * furnished to do so, subject to the following conditions:',
	  ' *  ',
	  ' * The above copyright notice and this permission notice shall be included in',
	  ' * all copies or substantial portions of the Software.',
	  ' *  ',
	  ' * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR',
	  ' * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,',
	  ' * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE',
	  ' * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER',
	  ' * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,',
	  ' * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN',
	  ' * THE SOFTWARE.',
*/

gulp.task('build:scroll', function() {

  gulp.src(['src/core/core.less', 'src/drag/drag.less', 'src/scroll/scroll.less'], {base:'./'})
    .pipe(plugins.concat('scroll.less'))
	.pipe(plugins.replace('pk', 'ui'))
	.pipe(plugins.less())
	.pipe(plugins.autoprefixer({
		browsers:['last 2 version', 'ie 8', 'ie 9'],
		cascade:true
	}))
	.pipe(plugins.csslint())
	.pipe(plugins.minifyCss())
	.pipe(plugins.rename('scroll.min.css'))
    .pipe(gulp.dest('../ui/scroll/'));
	
	gulp.src(['src/core/core.js', 'src/drag/drag.js', 'src/scroll/scroll.js'], {base: './'})
    .pipe(plugins.concat('scroll.js'))
	.pipe(plugins.replace('pk', 'ui'))
	.pipe(plugins.jshint())
	.pipe(plugins.uglify())
	.pipe(plugins.rename('scroll.min.js'))
    .pipe(gulp.dest('../ui/scroll/'));

});

gulp.task('build:styles', function() {
  return gulp.src('src/**/*.less', {base:'./'})
	.pipe(plugins.plumber())
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
	.pipe(plugins.plumber())
	.pipe(plugins.bump({type:'patch'}))
	.pipe(gulp.dest('./'));
});

gulp.task('build:js',function() {
  return gulp.src('src/**/*.js', {base: './'})
	.pipe(plugins.plumber())
    .pipe(plugins.concat(pkg.name+'.js'))
	.pipe(plugins.jshint())
	.pipe(plugins.uglify())
	.pipe(plugins.rename(pkg.name+'.min.js'))
	.pipe(plugins.header(banner, { pkg : pkg } ))
    .pipe(gulp.dest('dist/'));
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
});

gulp.task('default', ['watch']);
gulp.task('travis', ['build:styles', 'build:js']);
