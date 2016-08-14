#!/usr/bin/env node

'use strict';

const gulp = require('gulp')
  , nodemon = require('gulp-nodemon')
  , notify = require('gulp-notify')
  , babel = require('gulp-babel')
  , sourcemaps = require('gulp-sourcemaps')
  , concat = require('gulp-concat')
  , sass = require('gulp-sass')
  , path = require('path')
  , jscs = require('gulp-jscs')
;

var config = {
  sassDir: 'resources/sass',
  es6Dir: 'resources/es6',
  cssDir: 'public/css',
  jsDir: 'public/js'
};

gulp.task('server', function() {
  nodemon({
    script: 'bin/www',
    watch: [
      'app.js',
      'bin/',
      'routes/',
      'public/*',
      'public/*/**',
      'views/'
    ],
    ext: 'js jade html'
  }).on('restart', function() {
    gulp.src('app.js')
      .pipe(notify('Restarting server on localhost:3000'));
  });
});

gulp.task('transpiler', function() {
  return gulp.src(path.join(config.es6Dir, '**/*.js'))
    .pipe(sourcemaps.init())
    .pipe(babel())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(config.jsDir));
});

gulp.task('css', function() {
  return gulp.src(path.join(config.sassDir, '/style.scss'))
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(config.cssDir));
});

gulp.task('jscs', () => {
  return gulp.src(['app.js', 'bin/*/**.js', 'routes/*/**.js', 'resource/es6/*/**.js'])
    .pipe(jscs())
    .pipe(jscs.reporter());
});

gulp.task('default', ['server'], function () {
  gulp.watch(path.join(config.sassDir, '/**/*.scss'), { debounceDelay: 2000 }, ['css']);
  gulp.watch(path.join(config.es6Dir, '**/*.js'), { debounceDelay: 2000 }, ['jscs', 'transpiler']);
});
