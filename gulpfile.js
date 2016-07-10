/*global require*/
"use strict";

// General
var gulp = require('gulp'),
    fs = require('fs'),
    del = require('del'),
    lazypipe = require('lazypipe'),
    plumber = require('gulp-plumber'),
    flatten = require('gulp-flatten'),
    tap = require('gulp-tap'),
    rename = require('gulp-rename'),
    watch = require('gulp-watch'),
    livereload = require('gulp-livereload');

// Pug Templates
var pug = require('gulp-pug');

// Styles
var sass = require('gulp-sass'),
    prefix = require('gulp-autoprefixer'),
    minify = require('gulp-cssnano');

// Scripts and tests
var jshint = require('gulp-jshint'),
    stylish = require('jshint-stylish'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify');

/**
 * Paths to project folders
 */

var paths = {
  input: 'src/**/*',
  output: 'dist/',
  scripts: {
    input: 'src/js/**/*',
    output: 'dist/js/'
  },
  styles: {
    input: 'src/scss/**/*.{scss,sass}',
    output: 'dist/css/'
  },
  templates: {
    input: 'src/templates/**/*.pug',
    output: 'dist/'
  },
  images: {
    input: 'src/images/*',
    output: 'dist/images/'
  },
  assets: {
    input: 'src/assets/*',
    output: 'dist/assets/'
  }
};

/**
 * Gulp Taks
 */

// Lint, minify, and concatenate scripts
gulp.task('build:scripts', ['clean:dist'], function() {
    return gulp.src(paths.scripts.input)
        .pipe(plumber())
        .pipe(concat('main.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest(paths.scripts.output));
});

// Process, lint, and minify Sass files
gulp.task('build:styles', ['clean:dist'], function() {
    return gulp.src(paths.styles.input)
        .pipe(plumber())
        .pipe(sass({
            outputStyle: 'expanded',
            sourceComments: true
        }))
        .pipe(flatten())
        .pipe(prefix({
            browsers: ['last 2 version', '> 1%'],
            cascade: true,
            remove: true
        }))
        .pipe(concat('style.css'))
        .pipe(minify({
            discardComments: {
                removeAll: true
            }
        }))
        .pipe(gulp.dest(paths.styles.output));
});

// Process, and compile Pug files
gulp.task('build:templates', ['clean:dist'], function buildHTML () {
    return gulp.src([paths.templates.input, '!src/templates/inc/**/*.pug'])
        .pipe(pug({
            pretty: false
          }
        ))
        .pipe(gulp.dest(paths.templates.output));
});

// Copy image files into output folder
gulp.task('build:images', ['clean:dist'], function() {
    return gulp.src(paths.images.input)
        .pipe(plumber())
        .pipe(gulp.dest(paths.images.output));
});

// Copy test files into output folder
gulp.task('build:assets', ['clean:dist'], function() {
    return gulp.src(paths.assets.input)
        .pipe(plumber())
        .pipe(gulp.dest(paths.assets.output));
});

// Lint scripts
gulp.task('lint:scripts', function () {
    return gulp.src(paths.scripts.input)
        .pipe(plumber())
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'));
});

// Remove pre-existing content from output and test folders
gulp.task('clean:dist', function () {
    del.sync([
        paths.output
    ]);
});

// Spin up livereload server and listen for file changes
gulp.task('listen', function () {
    livereload.listen();
    gulp.watch(paths.input).on('change', function(file) {
        gulp.start('default');
    });
});

/**
 * Task Runners
 */
 
// Compile files
gulp.task('compile', [
    'lint:scripts',
    'clean:dist',
    'build:scripts',
    'build:styles',
    'build:images',
    'build:assets',
    'build:templates'
]);

// Compile files and generate docs (default)
gulp.task('default', [
    'compile'
]);

// Compile files and generate docs when something changes
gulp.task('watch', [
    'listen',
    'default'
]);