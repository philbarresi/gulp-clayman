// Following example of:
// https://koglerjs.com/verbiage/gulp
// https://github.com/koglerjs/gulp-dum-tpl/blob/master/index.js

var clayman = require("clayman"),
    through = require("through"),
    path = require("path"),
    gutil = require("gulp-util"),
    PluginError = gutil.PluginError,
    File = gutil.File;

module.exports = function (fileName, options) {
    if (!fileName) {
        throw new PluginError("gulp-clayman", "Missing fileName");
    }

    options = options || {};

    var firstFile = null,
        fileContents = [];

    // Each file will be passed through bufferContents
    function bufferContents(file) {
        //Skip empty/absent files
        if (file.isNull()) {
            return;
        }

        //This plugin doesn't support Streams
        if (file.isStream()) {
            return this.emit("error", new PluginError("gulp-clayman", "Streaming not supported"));
        }

        // Store a reference to the first file given.
        // We'll use it to configure the outgoing file
        // (Follows convention of gulp-concat)
        if (!firstFile) {
            firstFile = file;
        }

        // Collect the string versions of the files
        fileContents.push(file.contents.toString("utf8"));
    }

    // After all files are collected, endStream will run
    function endStream() {

        // Grab the Clayman difference
        var endResult = clayman.difference.apply(clayman, fileContents);

        if (options.namespace) {
            // we have to namespace clayman
            endResult.namespace(options.namespace);
        }

        // Configure outgoing file.
        var outputPath = path.join(firstFile.base, fileName);
        var outputFile = new File({
            cwd: firstFile.cwd,
            base: firstFile.base,
            path: outputPath,
            contents: new Buffer(endResult.toString())
        });

        // Emit outgoing file and end.
        this.emit("data", outputFile);
        this.emit("end");
    }

    return through(bufferContents, endStream);
};
