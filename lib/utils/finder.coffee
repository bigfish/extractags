#find: recursively searches a directory
#when it finds a file, calls the callback
#with the filepath as argument
fs = require 'fs'
find = (dir, callback) ->
  fs.stat dir, (err, stats) ->
    throw err if err
    fs.readdir dir, (err, files) ->
      throw err if err
      for file in files
        do (file) ->
          filePath = dir + "/" + file
          fs.stat filePath, (err, stats) ->
            throw err if err
            if stats.isFile()
              callback null, filePath
            else if stats.isDirectory
              find filePath, callback

exports.find = find
