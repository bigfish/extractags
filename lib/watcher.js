/*jslint node:true white:false */
/*global exports */
var fs = require('fs');
var sys = require('sys');
var watchFiles, unWatchFiles, watchDirectory, watchFileOnce, watchedFiles;

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
    watchedFiles = watched;
    fs.stat(path, function (err, stats) {
        if (err) {
            sys.error('Error retrieving stats for file: ' + path);
        } else {
            if (stats.isDirectory()) {
                watchDirectory(path, callback, watched);
                //when something in the directory is changed
                //re-watch the directory to pick up any new files
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
//unwatch all currently watched files
unWatchFiles = function () {
    var i;
    for (i = 0; i < watchedFiles.length; i++) {
        fs.unwatchFile(watchedFiles[i]);
    }
    watchedFiles = [];
};

exports.watchFiles = watchFiles;
exports.unWatchFiles = unWatchFiles;
