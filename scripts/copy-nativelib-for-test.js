'use strict';

var gulp = require('gulp-help')(require('gulp'));

var os = process.platform;

var config = {
  paths: {
    requiredfiles: [
      'node_modules/@teradataprebuilt/nativelib-' + os + '/**/*'
    ]
  }
};

gulp.task('copy-native-lib-for-test', 'Copy Native Lib For test', function () {
  return gulp
    .src(config.paths.requiredfiles)
    .pipe(gulp.dest('src/node_modules/@teradataprebuilt/nativelib-' + os));
});
