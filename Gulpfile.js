var gulp = require('gulp'),
    watch = require('gulp-watch'),
    sass = require('gulp-sass'),
    browserify = require('gulp-browserify');

// Basic usage
gulp.task('scripts', function() {
    // Single entry point to browserify
    gulp.src('app/js/trsfr.js')
        .pipe(browserify({
            insertGlobals : true,
        }))
        .pipe(gulp.dest('./app/dist/js'))
});

gulp.task('sass', function() {
    // Single entry point to browserify
    gulp.src('app/scss/main.scss')
        .pipe(sass())
        .pipe(gulp.dest('./app/dist/css'))
});

gulp.task('watch', function() {
    gulp.watch(['app/js/**/*'], ['scripts']);
    gulp.watch(['app/scss/**/*'], ['sass']);
});

gulp.task('default', ['scripts']);
