//Order of checking
// ~/.gitconfig
// ~/.config/git/config
var fs = require('fs');
var path = require('path');
var home = require('user-home');
var findParentDir = require('find-parent-dir');
var configParser = require('js-git/lib/config-codec');

function GitConfig(options) {
  var configPath;
  options = options || {};

  this.getValue = _getValue;
  configPath = options.global ? _getGlobalConfig() : _getLocalConfig(options.dir || process.cwd());
  this.config = _parseConfig(configPath);
}


function _getGlobalConfig() {
  var homeGlobal = path.join(home, '.gitconfig');
  var configGlobal = path.join(home,  '.config', 'git', '.gitconfig');

  if (fs.existsSync(homeGlobal)) {
    return homeGlobal;
  }
  if (fs.existsSync(configGlobal)) {
    return configGlobal;
  }
}

function _getLocalConfig(dir) {
   var gitDir = findParentDir.sync(dir, '.git');
   var configPath = path.join(gitDir, '.git/config');
   if (fs.existsSync(configPath)) {
     return configPath;
   }
}

function _getValue(obj, key) {
  key = key && key.split('.');
  while (key && key.length) {
    obj = obj || {};
    obj = obj[key.shift()];
  }
  return obj;
}

function _parseConfig(path) {
  if (fs.existsSync(path)) {
    var config = fs.readFileSync(path, 'utf8');
    return configParser.decode(config);
  }
}

GitConfig.prototype.get = function (value) {
  return _getValue(this.config, value);
};

module.exports = GitConfig;
