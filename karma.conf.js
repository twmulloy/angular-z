module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine'],
    files: [
      'bower_components/angular/angular.js',
      'bower_components/angular-mocks/angular-mocks.js',
      'src/z.js',
      'test/*_spec.js'
    ],
    exclude: [],
    preprocessors: {},
    reporters: ['progress'],
    port: 8080,
    colors: true,
    // LOG_DISABLE|LOG_ERROR|LOG_WARN|LOG_INFO|LOG_DEBUG
    logLevel: config.LOG_DEBUG,
    autoWatch: true,
    // PhantomJS|Chrome
    browsers: ['Chrome'],
    singleRun: false
  });
};