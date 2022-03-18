'use strict';

var gulp = require('gulp');
var fs = require('fs');
var path = require('path');
var spawn = require('child_process').spawn;
var runSequence = require('run-sequence');
var rimraf = require('rimraf');

function getSpawn(command, args, options) {
  if (!/^win/.test(process.platform)) { // linux
    return spawn(command, args, {
      stdio: 'inherit'
    });
  } else { // windows
    return spawn('cmd', ['/s', '/c', command].concat(args), {
      stdio: [null, process.stdout, process.stderr]
    });
  }
}

gulp.task('update-package-json', function (cb) {
  process.chdir('dist');
  fs.copyFileSync('..' + path.sep + 'package.json', 'package.json');
  fs.copyFileSync('..' + path.sep + 'README.md', 'README.md');
  cb();
});

gulp.task('npm-publish', function (cb) {
  var cmd = getSpawn('npm', ['publish', '--access=public']);
  cmd.on('close', function (code) {
    cb(code);
  });
});

gulp.task('publish-nodejsdriver', gulp.series('update-package-json', 'npm-publish'));
