var gulp = require('gulp');
var karma = require('karma').server;
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var minifyCSS = require('gulp-minify-css');
var connect = require('gulp-connect');
var historyApiFallback = require('connect-history-api-fallback');

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
  gulp.src(path.src + '/z.js')
    .pipe(rename('angular-z.js'))
    .pipe(gulp.dest(path.release))
    .pipe(rename('angular-z.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest(path.release));

  gulp.src(path.src + '/z.css')
    .pipe(rename('angular-z.css'))
    .pipe(gulp.dest(path.release))
    .pipe(rename('angular.z.min.css'))
    .pipe(minifyCSS())
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

gulp.task('src-css', function () {
  return gulp.src(path.src + '/z.css')
    .pipe(rename('angular-z.css'))
    .pipe(gulp.dest(path.sample + '/css/lib'))
    .pipe(connect.reload());
});

/**
 * reload sample on html changes
 */
gulp.task('sample-html', function () {
  return gulp.src(path.sample + '/**/*.html')
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
 * reload sample on css changes
 */
gulp.task('sample-css', function () {
  return gulp.src(path.sample + '/**/*.css')
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
    './bower_components/angular-animate/angular-animate.js',
    './bower_components/angular-route/angular-route.js'
  ]).pipe(gulp.dest(path.sample + '/js/lib'));

  /**
   * move angular-z into sample lib directory
   */
  gulp.src(path.release + '/angular-z.js')
    .pipe(gulp.dest(path.sample + '/js/lib'));

  gulp.src(path.release + '/angular-z.css')
    .pipe(gulp.dest(path.sample + '/css/lib'));
});

/**
 * webserver
 */
gulp.task('sample-server', function () {
  connect.server({
    root: path.sample,
    host: 'localhost',
    port: 8080,
    livereload: true,
    middleware: function (connect, opt) {
      return [historyApiFallback];
    }
  });
});

/**
 * watch for changes within sample app directory
 */
gulp.task('sample-watch', function () {
  /**
   * watch sample files
   */
  gulp.watch(path.sample + '/**/*.html', ['sample-html']);
  gulp.watch(path.sample + '/**/*.js', ['sample-js']);
  gulp.watch(path.sample + '/**/*.css', ['sample-css']);

  /**
   * watch src files
   */
  gulp.watch(path.src + '/z.js', ['src-js']);
  gulp.watch(path.src + '/z.css', ['src-css']);
});

/**
 * run sample application
 */
gulp.task('sample', ['sample-update', 'sample-server', 'sample-watch']);