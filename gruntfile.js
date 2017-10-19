module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

 
 
    "tslint": {
      options: {
        configuration: 'tslint.json',
        rulesDirectory: 'tsrules'
      },
      snowchain: {
        src: [
          'code/cursors/**/*.ts',
          '!code/cursors/**/WhereGrammar.ts',
          '!code/cursors/**/sha.d.ts'
        ]
      }
    }
  });

 

  // Load grunt plugins


  grunt.loadNpmTasks('grunt-tslint');
 grunt.loadNpmTasks("grunt-ts");

 
  // Default task
  grunt.registerTask('default', ["tslint"]);
};
