#find: recursively searches a directory
#when it finds a file, calls the callback
#with the filepath as argument
fs = require 'fs'
pending = 0
find = (dir, fileRE = /.*/, callback) ->
  debugger
  fs.stat dir, (err, stats) ->
    throw err if err
    fs.readdir dir, (err, files) ->
      throw err if err
      for file in files
        pending++
        do (file) ->
          filePath = dir + "/" + file
          fs.stat filePath, (err, stats) ->
            throw err if err
            pending--
            if stats.isFile()
              debugger
              if fileRE.test file
                callback null, filePath, pending is 0
            else if stats.isDirectory()
              find filePath, fileRE, callback

exports.find = find
