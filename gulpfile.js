const gulp = require('gulp');
const ts = require('gulp-typescript');
const sourcemaps = require('gulp-sourcemaps');
// var merge = require('merge2');

const tsProject = ts.createProject('tsconfig.json');

gulp.task('scripts', function() {

	return tsProject.src()
		.pipe(tsProject())
		.pipe(gulp.dest('dist'))

});

gulp.task('prod_scripts', function() {

	return tsProject.src()
		.pipe(sourcemaps.init())
		.pipe(tsProject())
		.pipe(sourcemaps.write())
		.pipe(gulp.dest('dist'))

});


gulp.task('watch', ['scripts'], function() {
	gulp.watch('src/**/*.ts', ['scripts']);
});