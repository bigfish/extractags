describe "generate ctags", ->

	extags = null
	fileText = """
		Ext.define("some.Class", {
				
		});
	"""
	beforeEach = ->
		extags = require '../extjs4ctags.coffee'

	it 'should parse the class name', ->
		parsed_class = extags.parseText fileText
		parsed_class.fullClassName.should_equal "some.Class"




