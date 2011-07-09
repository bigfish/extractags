/*jslint node:true */
/*global exports */
(function () {
    var find, fs, processFile, pending;
    fs = require('fs');
    pending = 0;
    processFile = function (filePath, fileName, fileRE, callback) {
        fs.stat(filePath, function (err, stats) {
            if (err) {
                throw err;
            }
            pending--;
            if (stats.isFile()) {
                if (fileRE.test(fileName)) {
                    callback(null, filePath, pending === 0);
                }
            } else if (stats.isDirectory()) {
                find(filePath, fileRE, callback);
            }
        });
    };
    find = function (dir, fileRE, callback) {
        if (fileRE === null) {
            fileRE = /.*/;
        }
        fs.stat(dir, function (err, stats) {
            if (err) {
                throw err;
            }
            fs.readdir(dir, function (err, files) {
                var file, filePath, i;
                if (err) {
                    throw err;
                }
                for (i = 0; i < files.length; i++) {
                    file = files[i];
                    pending++;
                    filePath = dir + "/" + file;
                    processFile(filePath, file, fileRE, callback);
                }
            });
        });
    };
    exports.find = find;
}());
