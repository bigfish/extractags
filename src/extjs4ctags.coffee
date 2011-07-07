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
        if err
            callback err
        classObj = parseText fileText
        if classObj.fullClassName
            classes.push classObj
        #decrement the count of pending flags
        pending--
        #if it is 0 we are all done -- output the stats
        if pending is 0
            unless onComplete is null
                onComplete null, classes

outputCTags = (classes) ->
	for classObj in classes
		console.dir classObj

parseDir = (topdir, callback) ->
	onComplete = callback
	#reset state
	classes = []
	pending = 0
	finder.find topdir, /\.js$/, (err, file) ->
        callback err if err
        if file
            pending++
            parseFile file, callback

exports.parseDir = parseDir
exports.parseFile = parseFile
exports.parseText = parseText

			