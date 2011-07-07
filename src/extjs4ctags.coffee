fs = require 'fs'
finder = require './utils/finder'
pending = 0
classes = []
onComplete = null


parseText = (fileStr) ->
  cur_class = {}
  lines = fileStr.split '\n'
  for line in lines
    do (line) ->

      #find class definition line and parse class name
      define_res = /^\s*Ext\.define\(\s*['"]([^'"]*)['"]/.exec line
      if define_res
        cur_class.fullClassName = define_res[1]

      #find extend 
      extend_res = /extend\s*\:\s*["']([^"']*)['"]/.exec line
      if extend_res
        cur_class.extend = extend_res[1]

  return cur_class


parseFile = (file, callback) ->
  fs.readFile file, 'utf8', (err, fileText) ->
    throw err if err
    classObj = parseText fileText
    callback classObj

outputCTags = (classes) ->
  for classObj in classes
    console.dir classObj

parseDir = (topdir, callback) ->
  onComplete = callback
  #reset state
  classes = []
  pending = 0
  finder.find topdir, /\.js$/, (err, file, finished) ->
    throw err if err
    if file
      parseFile file, (classObj) ->
        classes.push classObj
        if finished
          callback null, classes

exports.parseDir = parseDir
exports.parseFile = parseFile
exports.parseText = parseText

      
