/*
 * grunt-flight-lint
 *
 *
 * Copyright (c) 2014 Andy Hume
 * Licensed under the MIT license.
 */

'use strict';

var fs = require('fs');
var fsa = require('flight-static-analysis');

var plugins = [
  // 'inspect',
  // 'name',
  // 'event',
  // 'mixin',
  // 'advice',
  // 'dependency',
  // 'method',
  // 'defaultAttrs',
  // 'selector',
   'domClimbing',
  //'jQuery',
];

module.exports = function (grunt) {

  grunt.registerMultiTask('flight_lint', 'Check for flightjs antipatterns', function () {

    // Iterate over all specified file groups.
    this.files.forEach(function (file) {

      /*
       *  Warn on and remove invalid source files (if nonull was set).
       */
      var src = file.src.filter(function (filepath) {
        if (!grunt.file.exists(filepath)) {
          grunt.log.warn('Source file "' + filepath + '" not found.');
          return false;
        } else {
          return true;
        }
      })

      /*
       *  Read each file to pass to fsa module.
       */
      .map(function (filepath) {
        return {
          code: grunt.file.read(filepath),
          path: filepath
        }
      })

      /*
       *  Run each code blob through fsa and pass to printResults.
       */
      .forEach(function (file) {
        try {
          var result = fsa(file.code, {
            plugins: plugins,
            argv: {
              instances: true
            }
          })
        }
        catch(e) {
          console.log(e.stack);
        }

        printResult(file.path, result);

      })
    });
  });

  function printResult(file, result) {

    if (!result) {
      return;
    }

    Object.keys(result).forEach(function (plugin) {
      result[plugin].instances.forEach(function (instance) {
        grunt.log.writeln(plugin + ' found ** ' + file + ': Line No: ' + instance.loc.start.line);
      })
    });
  }

};
