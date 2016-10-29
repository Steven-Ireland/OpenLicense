var gulp = require('gulp');
var concat = require('gulp-concat');
var less = require('gulp-less');
var nodemon = require('gulp-nodemon');
var autoprefixer = require('gulp-autoprefixer');
var babel = require('gulp-babel');
var mocha = require('gulp-mocha');
var del = require('del');
var path = require('path');

gulp.task('less', function() {
	return gulp.src('./frontend/less/**/*')
		//.pipe(concat('master.css'))
		.pipe(less({
			paths: [path.join(__dirname, 'less', 'includes')]
		}))
		.pipe(autoprefixer({ browsers: ['last 2 versions'], cascade: false}))
		.pipe(gulp.dest('./_dist/frontend/css/'));
});

gulp.task('start', ['deploy'], function() {
	nodemon({
		script: '_dist/main.js',
		ext: 'js ejs less',
		ignore: '_dist/**',
		tasks: ['deploy'],
		legacyWatch: true
 	});
});

gulp.task('clean', function() {
	return del.sync('./_dist');
});

gulp.task('deploy', ['clean', 'babel', 'less'], function() {
	gulp.src(['./frontend/pages/**/*'])
		.pipe(gulp.dest('./_dist/frontend/pages'));

	gulp.src(['./frontend/js/*'])
		.pipe(gulp.dest('./_dist/frontend/js'));

	gulp.src(['./bower_components/**/*'])
			.pipe(gulp.dest('./_dist/frontend/bower_components'));
});

gulp.task('babel', function() {
	return gulp.src(['./backend/src/*.js', './backend/src/**/*.js'])
		.pipe(babel())
		.pipe(gulp.dest('./_dist'));
});

gulp.task('wait', function(cb) {
	setTimeout(cb, 5000);
});

gulp.task('test', ['start', 'wait'], function() {
	return gulp.src('./backend/test/**/*.js')
		.pipe(mocha({reporter: 'min', require:['mocha-steps']}))
		.on('end', function() {
			process.exit();
		})
		.on('error', function() {
			process.exit(1);
		});
})

gulp.task('default', ['start']);
