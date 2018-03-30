// build.js
var fs = require("fs");
var browserify = require("browserify");

browserify(["js/app.js"])
  .transform("babelify", {presets: ["es2015"]})
  .bundle()
  .pipe(fs.createWriteStream("dist/app.js"));