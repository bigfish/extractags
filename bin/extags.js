(function() {
  var args, classes, fs, parser, topdir;
  fs = require('fs');
  args = process.argv;
  if (args.length !== 3) {
    console.log("missing required directory argument");
    process.exit(1);
  }
  topdir = args.pop();
  parser = require("../lib/extjs4ctags");
  classes = parser.parseDir(topdir);
}).call(this);
