#!/usr/bin/env node
fs = require 'fs'

#accept input of top level dir
args = process.argv
unless args.length is 3
	console.log "missing required directory argument"
	process.exit 1

topdir = args.pop()

parser = require("../lib/extjs4ctags")

classes = parser.parseDir topdir
