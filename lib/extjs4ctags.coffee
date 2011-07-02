pending = 0
classes = []
onComplete = null

findFilesInDir = (dir, callback) ->
	fs.stat dir, (err, stats) ->
		callback err if err
		fs.readdir dir, (err, files) ->
			callback err if err
			for file in files
				do (file) ->
					filePath = dir + "/" + file
					fs.stat filePath, (err, stats) ->
						callback err if err
						if stats.isFile()
							callback null, filePath
						else if stats.isDirectory
							findFilesInDir filePath, callback

parseText = (fileText) ->
	cur_class = {}
	lines = fileText.split '\n'
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

parseFile = (file) ->
	fs.readFile file, 'utf8', (err, fileText) ->
		throw err if err

		cur_class = parse fileText

		#add parsed class data object to collection
		if cur_class.fullClassName
			classes.push cur_class

		#decrement the count of pending flags
		pending--

		#if it is 0 we are all done -- output the stats
		if pending is 0
			onComplete classes

outputCTags = (classes) ->
	for classObj in classes
		console.dir classObj

parseDir = (topdir, callback) ->
	onComplete = callback
	#reset state
	classes = []
	pending = 0
	findFilesInDir topdir, (err, file) ->
		throw err if err
		if file.match /\.js$/
			pending++
			parseFile file, callback
		
exports.parseDir = parseDir
exports.parseText = parseText

			
