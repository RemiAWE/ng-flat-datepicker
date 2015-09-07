'use strict';

var gulp = require('gulp');
var $    = require('gulp-load-plugins')();

var plumberErrorHandler = {
    errorHandler: function (err) {
        console.log(err);
        this.emit('end');
    }
};

gulp.task('js', function(){
    return gulp.src(__dirname+'/src/js/**/*.js')
        .pipe($.plumber(plumberErrorHandler))
        .pipe($.rename('ng-datepicker.js'))
        .pipe(gulp.dest(__dirname+'/dist/'));
});

gulp.task('sass', function(){
    return gulp.src(__dirname+'/src/scss/**/*.scss')
        .pipe($.plumber(plumberErrorHandler))
        .pipe($.sass({ outputStyle: 'expanded' }))
        .pipe($.rename('ng-datepicker.css'))
        .pipe(gulp.dest(__dirname+'/dist/'));
});

/**
 * Watch
 */
gulp.task('watch', function(){
    $.watch(__dirname+'/src/scss/**/*.scss', $.batch(function(events, done){
        gulp.start('sass', done);
    }));
    $.watch(__dirname+'/src/js/**/*.js', $.batch(function(events, done){
        gulp.start('js', done);
    }));
});
