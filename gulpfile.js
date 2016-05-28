'use strict';

var es   = require('event-stream');
var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');
var gulp = require('gulp');
var $    = require('gulp-load-plugins')();

var paths = {
    src: {
        html: __dirname+'/src/*.html',
        html_template: __dirname+'/src/templates/**/*.html',
        js: __dirname+'/src/js/**/*.js',
        scss: __dirname+'/src/scss/**/*.scss'
    },
    dep: {
      angular: __dirname+'/node_modules/angular/angular.js',
      moment: __dirname+'/node_modules/moment/moment.js',
      jmoment: __dirname+'/node_modules/moment-jalaali/build/moment-jalaali.js'
    },
    tmp: __dirname+'/.tmp/',
    dist: __dirname+'/dist/',
    demo: __dirname+'/demo/'
};

var plumberErrorHandler = {
    errorHandler: function (err) {
        console.log(err);
        this.emit('end');
    }
};

gulp.task('html', function() {
  gulp.src(paths.src.html).pipe(gulp.dest(paths.demo));
});

gulp.task('prerequisitiesJs', function(){
    return gulp.src([paths.dep.angular,paths.dep.moment,paths.dep.jmoment])
        .pipe($.concat('prerequisities.js'))
        .pipe(gulp.dest(paths.dist))
        .pipe($.uglify())
        .pipe($.rename('prerequisities.min.js'))
        .pipe(gulp.dest(paths.dist));
});

gulp.task('js', ['prerequisitiesJs'], function(){
    return es.merge(getTemplatesStream(), gulp.src(paths.src.js))
        .pipe(jshint())
        .pipe(jshint.reporter(stylish))
        .pipe($.plumber(plumberErrorHandler))
        .pipe($.angularFilesort())
        .pipe($.ngAnnotate())
        .pipe($.concat('ng-jalaali-flat-datepicker.js'))
        .pipe(gulp.dest(paths.dist))
        .pipe($.uglify())
        .pipe($.rename('ng-jalaali-flat-datepicker.min.js'))
        .pipe(gulp.dest(paths.dist));
});

gulp.task('sass', function(){
    return gulp.src(paths.src.scss)
        .pipe($.plumber(plumberErrorHandler))
        .pipe($.sass({ outputStyle: 'expanded' }))
        .pipe($.autoprefixer({ browsers: ['last 2 versions'] }))
        .pipe($.rename('ng-jalaali-flat-datepicker.css'))
        .pipe(gulp.dest(paths.dist))
        .pipe($.csso())
        .pipe($.rename('ng-jalaali-flat-datepicker.min.css'))
        .pipe(gulp.dest(paths.dist));
});

/**
 * Watch
 */
gulp.task('watch', function(){
    $.watch(paths.src.scss, $.batch(function(events, done){
      gulp.start('sass', done);
    }));
    $.watch([paths.src.js, paths.src.html_template], $.batch(function(events, done){
      gulp.start('js', done);
    }));
    $.watch([paths.src.html], $.batch(function(events, done) {
      gulp.start('html', done);
    }));
});

function getTemplatesStream() {
    return gulp.src(paths.src.html_template)
        .pipe($.angularTemplatecache('templates.js', {
            module: 'ngJalaaliFlatDatepicker'
        }));
}
