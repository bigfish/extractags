{exec} = require 'child_process'

task 'build', 'compile extjs4ctags coffee script', ->
	exec 'coffee --compile ./lib/extjs4ctags.coffee', (err, stdout, stderr) ->
		throw err if err
		console.log stdout + stderr

task 'test', 'test parsing behaviour with jasmine', ->
	exec 'jasmine-node --coffee .', (err, stdout, stderr) ->
		throw err if err
		console.log stdout + stderr

