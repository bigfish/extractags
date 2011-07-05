describe "file finder finds files", ->
  it "should find all files in a directory", ->
    finder = require '../lib/utils/finder'
    findComplete = false
    error = null
    fileFound = null
    finder.find './spec/testfiles', (err, file) ->
      findComplete = true
      error = err
      fileFound = file
    waitsFor ->
      findComplete
    , "find did not find anything after a second", 1000
    runs ->
      expect(fileFound).toBeDefined
    return null
