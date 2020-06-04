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
  process.chdir('..' + path.sep + 'dist');
  fs.copyFileSync('..' + path.sep + 'package.json', 'package.json');
  fs.copyFileSync('..' + path.sep + 'README.md', 'README.md');
  fs.mkdirSync('scripts');
  fs.copyFileSync('..' + path.sep + 'scripts' + path.sep + 'install-dependencies.js', 'scripts' + path.sep + 'install-dependencies.js');
  cb();
});

gulp.task('npm-publish', function (cb) {
  var cmd = getSpawn('npm', ['publish', '--access=public']);
  cmd.on('close', function (code) {
    cb(code);
  });
});

gulp.task('npm-logout', function (cb) {
  var cmd = getSpawn('npm', ['logout']);
  cmd.on('close', function (code) {
    console.log('Published Node.js Teradata Driver successfully.');
    cb(code);
  });
});

gulp.task('publish-nodejsdriver', gulp.series('update-package-json', 'npm-publish', 'npm-publish', 'npm-logout'));
