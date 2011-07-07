(function() {
  var find, fs, pending;
  fs = require('fs');
  pending = 0;
  find = function(dir, fileRE, callback) {
    if (fileRE == null) {
      fileRE = /.*/;
    }
    debugger;
    return fs.stat(dir, function(err, stats) {
      if (err) {
        throw err;
      }
      return fs.readdir(dir, function(err, files) {
        var file, _i, _len, _results;
        if (err) {
          throw err;
        }
        _results = [];
        for (_i = 0, _len = files.length; _i < _len; _i++) {
          file = files[_i];
          pending++;
          _results.push((function(file) {
            var filePath;
            filePath = dir + "/" + file;
            return fs.stat(filePath, function(err, stats) {
              if (err) {
                throw err;
              }
              pending--;
              if (stats.isFile()) {
                debugger;
                if (fileRE.test(file)) {
                  return callback(null, filePath, pending === 0);
                }
              } else if (stats.isDirectory()) {
                return find(filePath, fileRE, callback);
              }
            });
          })(file));
        }
        return _results;
      });
    });
  };
  exports.find = find;
}).call(this);
