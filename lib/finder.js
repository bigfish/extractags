/*jslint node:true */
/*global exports */
(function () {
    var find, processDir, fs, processFile, pendingFiles, pendingDirs, depth;
    fs = require('fs');
    pendingFiles = 0;
    pendingDirs = 0;
    processFile = function (filePath, fileName, fileRE, callback) {
        fs.stat(filePath, function (err, stats) {
            if (err) {
                throw err;
            }
            pendingFiles--;
            if (stats.isFile()) {
                if (fileRE.test(fileName)) {
                    callback(null, filePath, pendingFiles === 0 && pendingDirs === 0);
                }
            } else if (stats.isDirectory()) {
                processDir(filePath, fileRE, callback);
            }
        });
    };
    processDir = function (dir, fileRE, callback) {
        pendingDirs++;
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
                pendingFiles += files.length;
                for (i = 0; i < files.length; i++) {
                    file = files[i];
                    filePath = dir + "/" + file;
                    processFile(filePath, file, fileRE, callback);
                }
                pendingDirs--;
            });
        });
    };

    find = function (dir, fileRE, callback) {
        pendingFiles = 0;
        pendingDirs = 0;
        processDir(dir, fileRE, callback);
    };

    exports.find = find;
}());
