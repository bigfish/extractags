describe "parse Ext JS 4 source files", ->

	extags = null
	fileText = """
		Ext.define("some.Class", {
				
		});
	"""
	# beforeEach = ->

	it 'should parse the class name', ->
		extags = require '../src/extjs4ctags.coffee'
		parsed_class = extags.parseText fileText
		expect(parsed_class.fullClassName).toBe("some.Class")
	
	it 'should parse a directory', ->
		extags = require '../src/extjs4ctags.coffee'
		#setup
		parsedClasses = null
		err = null
		parseComplete = false

		#exercise
		extags.parseDir './spec/testfiles', (err, classes) ->
			err = err
			parsedClasses = classes
			parseComplete = true


		waitsFor ->
			return parseComplete
		, "parsing did not complete", 1000
		
		runs ->
			expect(err).toBe(null)
			expect(parsedClasses).toNotBe(null)

		return null



