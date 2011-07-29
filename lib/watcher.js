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

watchDirectory = function (path, callback, watched, readTriggersCallback) {
    fs.readdir(path, function (err, fileNames) {
        if (err) {
            sys.error('Error reading path: ' + path);
        } else {
            fileNames.forEach(function (fileName) {
                watchFiles(path + '/' + fileName, callback, watched, readTriggersCallback);
            });
        }
    });
};

watchFiles = function (path, callback, watched, readTriggersCallback) {
    watched = watched || [];
    watchedFiles = watched;
    fs.stat(path, function (err, stats) {
        if (err) {
            sys.error('Error retrieving stats for file: ' + path);
        } else {
            if (stats.isDirectory()) {
                watchDirectory(path, callback, watched, readTriggersCallback);
                //when something in the directory is changed
                //re-watch the directory to pick up any new files
                watchFileOnce(watched, path, function () {
                    //todo - ignore access
                    watchDirectory(path, callback, watched, readTriggersCallback);
                });
            } else {
                watchFileOnce(watched, path, function (curr, prev) {
                    //for some reason, mtime is an object which is always different from any other
                    //event if they have the same string value --- so use the string value for comparison
                    if (readTriggersCallback || (curr.mtime.toString() !== prev.mtime.toString())) {
                        callback(path, curr, prev);
                    }
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
