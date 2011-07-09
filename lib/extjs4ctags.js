(function() {
  var classes, finder, fs, onComplete, outputCTags, parseDir, parseFile, parseText, pending;
  fs = require('fs');
  finder = require('./utils/finder');
  pending = 0;
  classes = [];
  onComplete = null;
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
  parseFile = function(file, callback) {
    return fs.readFile(file, 'utf8', function(err, fileText) {
      var classObj;
      if (err) {
        throw err;
      }
      classObj = parseText(fileText);
      if (classObj) {
        return callback(null, classObj);
      } else {
        return callback("unable to parse file: " + file);
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
    return finder.find(topdir, /\.js$/, function(err, file, finished) {
      debugger;      if (err) {
        throw err;
      }
      if (file) {
        return parseFile(file, function(err, classObj) {
          if (err) {
            throw err;
          }
          classes.push(classObj);
          if (finished) {
            return callback(null, classes);
          }
        });
      }
    });
  };
  exports.parseDir = parseDir;
  exports.parseFile = parseFile;
  exports.parseText = parseText;
}).call(this);
