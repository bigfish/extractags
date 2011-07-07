describe "file finder finds files", ->
  it "should find all files in a directory", ->
    finder = require '../src/utils/finder'
    foundFile = false
    error = null
    fileFound = null
    finder.find './spec/testfiles', null, (err, file) ->
      foundFile = true
      error = err
      fileFound = file
    waitsFor ->
      foundFile
    , "find did not find anything after a second", 1000
    runs ->
      expect(fileFound).toBeDefined

  it "should pass the 'finished' argument when finished finding", ->
    finder = require '../src/utils/finder'
    find_finished = false
    found_files = []
    finder.find './spec/testfiles', null,  (err, file, finished) ->
      error = err
      found_files.push file
      find_finished = finished
    waitsFor ->
      find_finished
    , "find did not finish after a second", 1000
    runs ->
      expect(found_files.length).toBe(4)

  it "should filter files", ->
    finder = require '../src/utils/finder'
    find_finished = false
    found_files = []
    finder.find './spec/testfiles', /\.js$/, (err, file, finished) ->
      debugger
      error = err
      found_files.push file
      find_finished = finished
    waitsFor ->
      find_finished
    , "find did not finish after a second", 1000
    runs ->
      expect(found_files.length).toBe(3)


