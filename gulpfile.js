var gulp = require('gulp');
var concat = require('gulp-concat');
var less = require('gulp-less');
var nodemon = require('gulp-nodemon');
var autoprefixer = require('gulp-autoprefixer');

gulp.task('less', function() {
  return gulp.src('./assets/less/*.less')
      //.pipe(concat('master.css'))
      .pipe(less())
      .pipe(autoprefixer({ browsers: ['last 2 versions'], cascade: false}))
      .pipe(gulp.dest('./assets/css/'));
});

gulp.task('start', function() {
  nodemon({
    script: 'main.js',
    ext: 'js html less',
    tasks: ['less'],
    legacyWatch: true
  });
});

gulp.task('default', ['start']);
