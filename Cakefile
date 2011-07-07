{exec} = require 'child_process'

task 'make', 'run tests and compile coffee from src/*.coffee to lib/*.js', ->
  #compile coffee script
  exec 'coffee --compile --output lib/ src/', (err, stdout, stderr) ->
    throw err if err
    console.log stdout + stderr

task 'test', 'run tests and compile coffee from src/*.coffee to lib/*.js', ->
  #run tests
	exec 'jasmine-node --coffee .', (err, stdout, stderr) ->
    throw err if err
    console.log stdout + stderr
