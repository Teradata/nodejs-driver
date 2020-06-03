'use strict';

var spawn = require('child_process').spawnSync;
var path = require('path');

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

// var platform = (typeof window != 'undefined' && (window)['process']) ? 'electron' : 'node';
var platform = 'node';
var abiVersion = process.versions.modules;
var os = process.platform;
var teradataNativelibVersion = '1.0.0-beta.1';
var app_root_dir = path.resolve(__dirname).split('node_modules')[0];

process.chdir(app_root_dir);
getSpawn('npm', ['install', '--save', '@teradataprebuilt/nativelib-' + os + '@' + teradataNativelibVersion]);
