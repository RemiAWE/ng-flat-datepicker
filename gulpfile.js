'use strict';

var es   = require('event-stream');
var gulp = require('gulp');
var $    = require('gulp-load-plugins')();
var eslint = require('gulp-eslint');

var paths = {
    src: {
        html: __dirname+'/src/templates/**/*.html',
        js: __dirname+'/src/js/**/*.js',
        scss: __dirname+'/src/scss/**/*.scss'
    },
    tmp: __dirname+'/.tmp/',
    dist: __dirname+'/dist/'
};

var plumberErrorHandler = {
    errorHandler: function (err) {
        console.log(err);
        this.emit('end');
    }
};

gulp.task('js', function(){
    return es.merge(getTemplatesStream(), gulp.src(paths.src.js))
        .pipe($.plumber(plumberErrorHandler))
        .pipe($.angularFilesort())
        .pipe($.ngAnnotate())
        .pipe($.concat('ng-flat-datepicker.js'))
        .pipe(gulp.dest(paths.dist))
        .pipe($.uglify())
        .pipe($.rename('ng-flat-datepicker.min.js'))
        .pipe(gulp.dest(paths.dist));
});

gulp.task('sass', function(){
    return gulp.src(paths.src.scss)
        .pipe($.plumber(plumberErrorHandler))
        .pipe($.sass({ outputStyle: 'expanded' }))
        .pipe($.autoprefixer({ browsers: ['last 2 versions'] }))
        .pipe($.rename('ng-flat-datepicker.css'))
        .pipe(gulp.dest(paths.dist))
        .pipe($.csso())
        .pipe($.rename('ng-flat-datepicker.min.css'))
        .pipe(gulp.dest(paths.dist));
});


gulp.task('lint', function () {
    return gulp.src(['src/js/*.js','!node_modules/**'])
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
});

/**
 * Watch
 */
gulp.task('watch', function(){
    $.watch(paths.src.scss, $.batch(function(events, done){
        gulp.start('sass', done);
    }));
    $.watch([paths.src.js, paths.src.html], $.batch(function(events, done){
        gulp.start('js', done);
    }));
    $.watch([paths.src.js], $.batch(function(events, done){
        gulp.start('lint', done);
    }));
});

gulp.task('default', ['lint', 'sass', 'js']);

function getTemplatesStream() {
    return gulp.src(paths.src.html)
        .pipe($.angularTemplatecache('templates.js', {
            module: 'ngFlatDatepicker'
        }));
}
