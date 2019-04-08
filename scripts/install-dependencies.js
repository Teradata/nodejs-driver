'use strict';

var spawn = require('child_process').spawnSync;

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

// getSpawn('npm', ['install', 'teradata-prebuilt-fastcall-' + os + '-' + platform + '-v' + abiVersion]);
// getSpawn('npm', ['install', 'teradata-nativelib-' + os]);
