var gulp = require('gulp');
var browserify = require('gulp-browserify');

// Basic usage
gulp.task('scripts', function() {
    // Single entry point to browserify
    gulp.src('app/js/trsfr.js')
        .pipe(browserify({
            insertGlobals : true,
        }))
        .pipe(gulp.dest('./app/dist/js'))
});
