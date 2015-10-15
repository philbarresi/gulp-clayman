var gulp = require('gulp'),
    clayman = require('./')
    path = require('path');

gulp.task('default', function() {
    return gulp.src(['./test-files/bootstrap.css', './test-files/bootstrap-modified.css'])
        .pipe(clayman('diff.css'))
        .pipe(gulp.dest('./test-files/'));
});
