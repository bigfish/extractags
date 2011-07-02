fs = require 'fs'

#accept input of top level dir
args = process.argv
unless args.length is 3
	console.log "missing required directory argument"
	process.exit 1
topdir = args.pop()

#functions
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
outputCTags = (classes) ->
	for classObj in classes
		console.dir classObj

############## MAIN ###############
pending = 0
classes = []
#statistics
stats = {
	files_parsed: 0,
	num_classes: 0
}
#gen_ctags
genCTags = (file) ->
	fs.readFile file, 'utf8', (err, fileText) ->
		throw err if err
		#initialize class data object
		cur_class = {
			filePath: file
		}
		stats.files_parsed++

		#split into lines
		lines = fileText.split '\n'

		#parse class config
		for line in lines
			do (line) ->
				#find class definition line and parse class name
				define_res = /^\s*Ext\.define\(\s*['"]([^'"]*)['"]/.exec line
				if define_res
					stats.num_classes++
					cur_class.fullClassName = define_res[1]
				#find extend 
				extend_res = /extend\s*\:\s*["']([^"']*)['"]/.exec line
				if extend_res
					cur_class.extend = extend_res[1]

		#add parsed class data object to collection
		if cur_class.fullClassName
			classes.push cur_class

		#decrement the count of pending flags
		pending--

		#if it is 0 we are all done -- output the stats
		if pending is 0
			outputCTags(classes)
			# console.log("DONE!")
			# console.dir stats

#main
findFilesInDir topdir, (err, file) ->
	throw err if err
	if file.match /\.js$/
		pending++
		genCTags file
		

			
