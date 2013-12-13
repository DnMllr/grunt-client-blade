/*
 * grunt-client-blade
 * https://github.com/DnMllr/grunt-client-blade
 *
 * Copyright (c) 2013 Daniel Miller
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks

  grunt.registerMultiTask('client_blade', 'Compiling blade templates to one file and exposing them to a namespace', function() {

    var blade = require('blade');
    var templates = [];
    templates.push('window.blade = {')
    // Iterate over all specified file groups.
    this.files.forEach(function(f) {
      // Concat specified files.
      var src = f.src.filter(function(filepath) {
        // Warn on and remove invalid source files (if nonull was set).
        if (!grunt.file.exists(filepath)) {
          grunt.log.warn('Source file "' + filepath + '" not found.');
          return false;
        } else {
          return true;
        }
      }).forEach(function(filepath) {
        // Read file source.
        var templateString = grunt.file.read(filepath);
        var pathArray = filepath.split('/');
        var name = pathArray[pathArray.length - 1].split('.')[0];
        console.log(name);
        blade.compile(templateString, {
          filename: name
        }, function(err, templ){
          if (err) {
            grunt.log.warn(err);
          } else {
            templates.push(name + ':' + templ.toString() + ',');
          }
        });
      });

      templates[templates.length - 1] = templates[templates.length - 1].slice(0, templates[templates.length - 1].length - 1);
      templates.push('};')


      // Write the destination file.
      grunt.file.write(f.dest, grunt.util.normalizelf(templates.join('')));

      // Print a success message.
      grunt.log.writeln('File "' + f.dest + '" created.');
    });
  });

};
