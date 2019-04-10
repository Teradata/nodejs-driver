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
var teradataPrebuiltFastcallVersion = '0.2.6';
var teradataNativelibVersion = '1.0.0-beta.1';

getSpawn('npm', ['install', '@teradataprebuilt/fastcall-' + os + '-' + platform + '-v' + abiVersion + '@' + teradataPrebuiltFastcallVersion]);
getSpawn('npm', ['install', '@teradataprebuilt/nativelib-' + os + '@' + teradataNativelibVersion]);
