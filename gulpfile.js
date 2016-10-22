var gulp = require('gulp');
var concat = require('gulp-concat');
var less = require('gulp-less');
var nodemon = require('gulp-nodemon');
var autoprefixer = require('gulp-autoprefixer');
var babel = require('gulp-babel');

gulp.task('less', function() {
  return gulp.src('./assets/less/*.less')
      //.pipe(concat('master.css'))
      .pipe(less())
      .pipe(autoprefixer({ browsers: ['last 2 versions'], cascade: false}))
      .pipe(gulp.dest('./assets/css/'));
});

gulp.task('start', function() {
  nodemon({
    script: 'dist/main.js',
    ext: 'js html less',
	 ignore: 'dist/**',
    tasks: ['less','babel'],
    legacyWatch: true
  });
});

gulp.task('babel', function() {
	return gulp.src(['./src/*.js', './src/**/*.js'])
		.pipe(babel())
		.pipe(gulp.dest('./dist'));
});

gulp.task('default', ['babel', 'start']);
