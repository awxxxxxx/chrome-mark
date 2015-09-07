/**
 * @author waterbear
 */

var gulp = require('gulp'),
	sass = require('gulp-sass'),
	connect = require('gulp-connect');

gulp.task('style', function() {
	return gulp.src('./src/sass/*.scss')
		.pipe(sass())
		.pipe(gulp.dest('./public/css'))
		.pipe(connect.reload());
});

gulp.task('script', function() {
	return gulp.src('./public/js/**/*.js')
		.pipe(connect.reload());
});

gulp.task('html', function() {
	return gulp.src(['./public/*.html','./*.html'])
		.pipe(connect.reload());
})

gulp.task('connect', function() {
	connect.server({
		root:[__dirname],
		livereload: true
	});
});

gulp.task('watch', function() {
    gulp.watch('./public/js/**/*.js', ['script']);
    gulp.watch('./src/css/*.scss', ['style']);
    gulp.watch(['./public/*.html','./*.html'], ['html']);
});

gulp.task('default', ['style','connect','watch','script']);
