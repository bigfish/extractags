describe "parse Ext JS 4 source files", ->

  extags = null
  fileText = """
    Ext.define("some.Class", {
        
    });
  """
  it 'should parse the class name from a String', ->
    extags = require '../src/extjs4ctags'
    parsed_class = extags.parseText fileText
    expect(parsed_class.fullClassName).toBe("some.Class")
  
  it 'should parse a directory', ->
    #setup
    extags = require '../src/extjs4ctags'
    parsedClasses = null
    err = null
    parseComplete = false

    #exercise
    extags.parseDir './spec/testfiles', (err, classes) ->
      extags = require '../src/extjs4ctags'
      err = err
      parsedClasses = classes
      parseComplete = true

    waitsFor ->
      parseComplete
    , "parsing did not complete", 1000
    
    runs ->
      expect(err).toBe(null)
      expect(parsedClasses).toNotBe(null)
      expect(parsedClasses.length).toBe(3)
      expect(parsedClasses[0].fullClassName).toBe("life.Animal")

  it 'should parse a file', ->
    extags = require '../src/extjs4ctags'
    parsed = false
    parsed_data = null
    parsed_file = extags.parseFile './spec/testfiles/Animal.js', (classObj) ->
      parsed = true
      parsed_data = classObj
    waitsFor ->
      parsed
    runs ->
      expect(parsed_data.fullClassName).toBe('life.Animal')


