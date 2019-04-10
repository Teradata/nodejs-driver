'use strict';

var gulp = require('gulp');
var fs = require('fs');
var path = require('path');
var spawn = require('child_process').spawnSync;
var runSequence = require('run-sequence');
var gunzip = require('gulp-gunzip');
var untar = require('gulp-untar');

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
  
});

gulp.task('prebuild', function (cb) {
  process.chdir('node_modules' + path.sep + 'fastcall');
  var cmd = getSpawn('prebuild', ['-t', '5.12.0', '-t', '6.16.0', '-t', '7.10.1', '-t', '8.15.0', '-t', '9.11.2', '-t', '10.15.1', '-t', '11.9.0', '--backend', 'cmake-js']);
  cb();
});

gulp.task('uncompress', function (cb) {
  var files = fs.readdirSync('prebuilds');
  var completed = 0;
  for (var i = 0; i < files.length; i++) {
    if (files[i].indexOf('.tar.gz') > -1) {
      var splitFileName = files[i].split('-');
      var abiNumber = splitFileName[3];
      gulp.src('prebuilds/' + files[i])
        .pipe(gunzip())
        .pipe(untar())
        .pipe(gulp.dest('prebuilds/uncompressed/' + abiNumber)).on('end', function() {
          completed++;
          if (completed == files.length) {
            cb();
          }
        });
    }
  }
});

gulp.task('npm-publish', function (cb) {
  var os = process.argv.slice(2)[1].split('=')[1];
  fs.readdir('prebuilds', function (err, files) {
    var data = fs.readFileSync('README.md', 'utf8');
    if (err) {
      return console.log(err);
    }
    var result = data.replace(/# TOC/g, '# Teradata Prebuilt CMake version of FastLoad\n# TOC');
    fs.writeFileSync('README.md', result, 'utf8');
    for (var i = 0; i < files.length; i++) {
      if (files[i].indexOf('.tar.gz') > -1) {
        var splitFileName = files[i].split('-');
        var abiNumber = splitFileName[3];
        var platform = splitFileName[2];
        fs.copyFileSync('prebuilds/uncompressed/' + abiNumber + path.sep + 'build' + path.sep + 'Release' + path.sep +  'fastcall.node', 'build' + path.sep + 'Release' + path.sep + 'fastcall.node');
        fs.copyFileSync('prebuilds/uncompressed/' + abiNumber + path.sep + 'build' + path.sep + 'Release' + path.sep + 'ref.node', 'build' + path.sep + 'Release' + path.sep + 'ref.node');

        fs.copyFileSync('..' + path.sep + '..' + path.sep + '.npmignore', '.npmignore');
        fs.copyFileSync('..' + path.sep + '..' + path.sep + 'package.json', 'package.json');
        var data = fs.readFileSync('package.json', 'utf8');
        if (err) {
          return console.log(err);
        }
        var result = data.replace(/teradata-prebuilt-fastcall/g, '@teradataprebuilt/fastcall-' + os + '-' + platform + '-' + abiNumber);

        fs.writeFileSync('package.json', result, 'utf8');
        var cmd = getSpawn('npm', ['publish', '--access=public']);
        console.log('Published fastcall-' + os + '-' + platform + '-' + abiNumber);
      }
    }
  });
});

gulp.task('npm-logout', function (cb) {
  var cmd = getSpawn('npm', ['logout']);
  console.log('Published Fastcall successfully.');
  cb(code);
});

gulp.task('publish-fastcall', function (cb) {
  runSequence('prebuild', 'uncompress', 'npm-publish', 'npm-logout');
});
