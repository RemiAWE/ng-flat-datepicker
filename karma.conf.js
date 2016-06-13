module.exports = function(config) {
  config.set({
    basePath: '',
    plugins: [ 
      'karma-phantomjs-launcher', 
      'karma-jasmine', 
      'karma-ng-html2js-preprocessor' 
    ], 
    frameworks: ['jasmine'],
    files: [
      'node_modules/moment/moment.js',
      'node_modules/angular/angular.js',
      'node_modules/angular-mocks/angular-mocks.js',
      'src/js/*.js',
      'src/templates/*.html',
      'tests/**/*.js',
    ],
    preprocessors: {
      "src/templates/*.html": ["ng-html2js"]
    },
    ngHtml2JsPreprocessor: {
      stripPrefix: "src/templates/",
      moduleName: "ngFlatDatepicker",
    },
    exclude: [],
    reporters: ['progress'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    browsers: ['PhantomJS'],
  })
}
