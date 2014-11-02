var gulp = require('gulp');
var karma = require('karma').server;
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var connect = require('gulp-connect');

var path = {
  src: './src',
  sample: './sample',
  release: './release',

};

/**
 * test
 */
gulp.task('karma', function (done) {
  karma.start({
    configFile: __dirname + '/karma.conf.js'
  }, done);
});

/**
 * build-release
 */
gulp.task('build-release', function () {
  return gulp.src(path.src + '/z.js')
    .pipe(rename('angular-z.js'))
    .pipe(gulp.dest(path.release))
    .pipe(rename('angular-z.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest(path.release));
});

/**
 * move changed source to sample lib directory
 */
gulp.task('src-js', function () {
  return gulp.src(path.src + '/z.js')
    .pipe(rename('angular-z.js'))
    .pipe(gulp.dest(path.sample + '/js/lib'))
    .pipe(connect.reload());
});

/**
 * reload sample on html changes
 */
gulp.task('sample-html', function () {
  return gulp.src(path.sample + '/*.html')
    .pipe(connect.reload());
});

/**
 * release sample on js changes
 */
gulp.task('sample-js', function () {
  return gulp.src(path.sample + '/**/*.js')
    .pipe(connect.reload());
});

/**
 * update sample library
 */
gulp.task('sample-update', function () {
  /**
   * move angular into sample lib directory
   */
  gulp.src([
    './bower_components/angular/angular.js',
    './bower_components/angular-route/angular-route.js'
  ]).pipe(gulp.dest(path.sample + '/js/lib'));

  /**
   * move angular-z into sample lib directory
   */
  gulp.src(path.release + '/angular-z.js')
    .pipe(gulp.dest(path.sample + '/js/lib'));
});

/**
 * webserver
 */
gulp.task('sample-server', function () {
  connect.server({
    root: path.sample,
    port: 8080,
    livereload: true
  });
});

/**
 * watch for changes within sample app directory
 */
gulp.task('sample-watch', function () {
  gulp.watch(path.sample + '/*.html', ['sample-html']);
  gulp.watch(path.sample + '/**/*.js', ['sample-js']);
  gulp.watch(path.src + '/z.js', ['src-js']);
});

/**
 * run sample application
 */
gulp.task('sample', ['sample-update', 'sample-server', 'sample-watch']);