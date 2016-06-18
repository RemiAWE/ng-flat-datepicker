'use strict';

var es   = require('event-stream');
var gulp = require('gulp');
var $    = require('gulp-load-plugins')();
var karmaServer = require('karma').Server;

var paths = {
    src: {
        html: __dirname+'/src/templates/**/*.html',
        js: __dirname+'/src/js/**/*.js',
        tests: __dirname+'/tests/**/*.js',
        scss: __dirname+'/src/scss/**/*.scss'
    },
    config: {
        karma: __dirname+'/karma.conf.js'
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

gulp.task('install', ['sass', 'js']);
gulp.task('default', ['install']);

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

gulp.task('test', function (done) {
  new karmaServer({
    configFile: __dirname + '/karma.conf.js',
    singleRun: true
  }, done).start();
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
});
gulp.task('watch-test', function(){
    $.watch([paths.src.js, paths.src.html, paths.src.tests, paths.config.karma], $.batch(function(events, done){
        gulp.start('test', done);
    }));
});


function getTemplatesStream() {
    return gulp.src(paths.src.html)
        .pipe($.angularTemplatecache('templates.js', {
            module: 'ngFlatDatepicker'
        }));
}
