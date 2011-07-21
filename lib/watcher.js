/*jslint node:true white:false */
/*global exports */
var fs = require('fs');
var sys = require('sys');
var watchFiles, watchDirectory, watchFileOnce;

watchFileOnce = function (watched, path, callback) {
    if (watched.indexOf(path) === -1) {
        watched.push(path);
        fs.watchFile(path, {
            persistent: true,
            interval: 500
        }, callback);
    }
};

watchDirectory = function (path, callback, watched) {
    fs.readdir(path, function (err, fileNames) {
        if (err) {
            sys.error('Error reading path: ' + path);
        } else {
            fileNames.forEach(function (fileName) {
                //if (utils.isInProject(fileName)) {
                watchFiles(path + '/' + fileName, callback, watched);
                //}
            });
        }
    });
};

watchFiles = function (path, callback, watched) {
    watched = watched || [];
    fs.stat(path, function (err, stats) {
        if (err) {
            sys.error('Error retrieving stats for file: ' + path);
        } else {
            if (stats.isDirectory()) {
                watchDirectory(path, callback, watched);
                watchFileOnce(watched, path, function () {
                    watchDirectory(path, callback, watched);
                });
            } else {
                watchFileOnce(watched, path, function (curr, prev) {
                    callback(path, curr, prev);
                });
            }
        }
    });
};
exports.watchFiles = watchFiles;
