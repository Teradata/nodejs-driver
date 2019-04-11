'use strict';

var gulp = require('gulp');

var os = process.platform;

var config = {
  paths: {
    requiredfiles: [
      'node_modules/@teradataprebuilt/nativelib-' + os + '/**/*'
    ]
  }
};

gulp.task('copy-native-lib-for-test', function () {
  return gulp
    .src(config.paths.requiredfiles)
    .pipe(gulp.dest('src/node_modules/@teradataprebuilt/nativelib-' + os));
});
