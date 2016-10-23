var gulp = require('gulp');
var concat = require('gulp-concat');
var less = require('gulp-less');
var nodemon = require('gulp-nodemon');
var autoprefixer = require('gulp-autoprefixer');
var babel = require('gulp-babel');
var mocha = require('gulp-mocha');

gulp.task('less', function() {
	return gulp.src('./assets/less/*.less')
		//.pipe(concat('master.css'))
		.pipe(less())
		.pipe(autoprefixer({ browsers: ['last 2 versions'], cascade: false}))
		.pipe(gulp.dest('./assets/css/'));
});

gulp.task('start', ['babel'], function(cb) {
	var started = false;
	nodemon({
		script: 'dist/main.js',
		ext: 'js html less',
		ignore: 'dist/**',
		tasks: ['less','babel'],
		legacyWatch: true
 	})
	.on('start', function() {
		if (!started) {
			started = true;
			setTimeout(cb, 5000);
		}
	});
});

gulp.task('babel', function() {
	return gulp.src(['./src/*.js', './src/**/*.js'])
		.pipe(babel())
		.pipe(gulp.dest('./dist'));
});

gulp.task('test', ['start'], function() {
	return gulp.src('./test/**/*.js')
		.pipe(mocha({reporter: 'min', require:['mocha-steps']}))
		.on('end', function() {
			process.exit();
		})
		.on('error', function() {
			process.exit(1);
		});
})

gulp.task('default', ['start']);
