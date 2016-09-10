module.exports = function(grunt) {

  var pkg = grunt.file.readJSON('bower.json');

  grunt.initConfig({
    pkg: pkg,

    clean: {
      build: ['build'],
      dist: ['build', '**/*.log', 'lib', 'node_modules']
    },

    copy: {
      css: {
        expand: true,
        cwd: 'src/',
        src: ['*.css'],
        dest: 'build/'
      }
    },

    htmlbuild: {
      dist: {
        src: 'src/*.html',
        dest: './build/',
        options: {
          styles: {
            'font_roboto': ['build/font_roboto.css'],
            'font_roboto_mono': ['build/font_roboto_mono.css']
          },
          data: {
            copyright: grunt.file.read('tmpl/copyright.tmpl')
          }
        }
      }
    },

    replace: {
      dist: {
        src: 'build/*.html',
        dest: './',
        replacements: [{
          from: /href="..\/lib\/([^"]+)"/g,
          to: 'href="../$1"'
        }]
      }
    },

    bumpversion: {
      options: {
        files: ['bower.json'],
        updateConfigs: ['pkg'],
        commit: true,
        commitFiles: ['-a'],
        commitMessage: 'Bump version number to %VERSION%',
        createTag: true,
        tagName: '%VERSION%',
        tagMessage: 'Version %VERSION%',
        push: false
      }
    },

    changelog: {
      options: {
        version: pkg.version
      }
    }
  });

  grunt.loadNpmTasks('grunt-bump');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-conventional-changelog');
  grunt.loadNpmTasks('grunt-html-build');
  grunt.loadNpmTasks('grunt-text-replace');

  grunt.registerTask('build', 'Compile all assets and create the distribution files',
      ['copy:css', 'htmlbuild', 'replace']);

  grunt.task.renameTask('bump', 'bumpversion');

  grunt.registerTask('bump', '', function(versionType) {
    versionType = versionType ? versionType : 'patch';
    grunt.task.run(['bumpversion:' + versionType + ':bump-only',
      'build', 'changelog', 'bumpversion::commit-only']);
  });

  grunt.registerTask('default', 'Build the software',
      ['build']
  );
};
