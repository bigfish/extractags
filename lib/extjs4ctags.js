(function() {
  var classes, findFilesInDir, fs, onComplete, outputCTags, parseDir, parseFile, parseText, pending;
  fs = require('fs');
  pending = 0;
  classes = [];
  onComplete = null;
  findFilesInDir = function(dir, callback) {
    return fs.stat(dir, function(err, stats) {
      if (err) {
        callback(err);
      }
      return fs.readdir(dir, function(err, files) {
        var file, _i, _len, _results;
        if (err) {
          callback(err);
        }
        _results = [];
        for (_i = 0, _len = files.length; _i < _len; _i++) {
          file = files[_i];
          _results.push((function(file) {
            var filePath;
            filePath = dir + "/" + file;
            return fs.stat(filePath, function(err, stats) {
              if (err) {
                callback(err);
              }
              if (stats.isFile()) {
                return callback(null, filePath);
              } else if (stats.isDirectory) {
                return findFilesInDir(filePath, callback);
              }
            });
          })(file));
        }
        return _results;
      });
    });
  };
  parseText = function(fileStr) {
    var cur_class, line, lines, _fn, _i, _len;
    cur_class = {};
    lines = fileStr.split('\n');
    _fn = function(line) {
      var define_res, extend_res;
      define_res = /^\s*Ext\.define\(\s*['"]([^'"]*)['"]/.exec(line);
      if (define_res) {
        cur_class.fullClassName = define_res[1];
      }
      extend_res = /extend\s*\:\s*["']([^"']*)['"]/.exec(line);
      if (extend_res) {
        return cur_class.extend = extend_res[1];
      }
    };
    for (_i = 0, _len = lines.length; _i < _len; _i++) {
      line = lines[_i];
      _fn(line);
    }
    return cur_class;
  };
  parseFile = function(file) {
    return fs.readFile(file, 'utf8', function(err, fileText) {
      var classObj;
      classObj = parseText(fileText);
      if (classObj.fullClassName) {
        classes.push(classObj);
      }
      pending--;
      if (pending === 0) {
        if (onComplete !== null) {
          return onComplete(null, classes);
        }
      }
    });
  };
  outputCTags = function(classes) {
    var classObj, _i, _len, _results;
    _results = [];
    for (_i = 0, _len = classes.length; _i < _len; _i++) {
      classObj = classes[_i];
      _results.push(console.dir(classObj));
    }
    return _results;
  };
  parseDir = function(topdir, callback) {
    onComplete = callback;
    classes = [];
    pending = 0;
    return findFilesInDir(topdir, function(err, file) {
      if (err) {
        callback(err);
      }
      if (file.match(/\.js$/)) {
        pending++;
        return parseFile(file, callback);
      }
    });
  };
  exports.findFilesInDir = findFilesInDir;
  exports.parseDir = parseDir;
  exports.parseFile = parseFile;
  exports.parseText = parseText;
}).call(this);
