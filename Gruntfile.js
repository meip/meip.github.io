module.exports = function (grunt) {

  grunt.initConfig({
    pages: {
      options: {
        pageSrc: 'src/pages',
        data: {
          baseUrl: '/'
        }
      },
      posts: {
        src: 'posts',
        dest: 'dist',
        layout: 'src/layouts/post.jade',
        url: 'posts/:title/',
        options: {
          pagination: {
            postsPerPage: 2,
            listPage: 'src/pages/index.jade'
          }
        }
      }
    },
    compass: {
      dist: {
        options: {
          sassDir: 'src/styles',
          cssDir: 'dist/styles'
        }
      }
    },
    // Move files not handled by other tasks
    copy: {
      dist: {
        files: [{
          expand: true,
          dot: true,
          cwd: 'src',
          dest: 'dist',
          src: [
            'images/**',
            'scripts/**',
            'styles/**.css',
            'styles/fonts/**',
          ]
        }]
      }
    },
    watch: {
      dist: {
        files: ['dist/**'],
        options: {
          livereload: true
        }
      },
      compass: {
        files: ['src/styles/**'],
        tasks: ['compass']
      },
      pages: {
        files: [
          'posts/**',
          'src/layouts/**',
          'src/pages/**'
        ],
        tasks: ['pages']
      },
      copy: {
        files: [
          'src/images/**',
          'src/scripts/**',
          'src/styles/**.css',
          'src/styles/fonts/**'
        ],
        tasks: ['copy']
      }
    },
    connect: {
      dist: {
        options: {
        port: 5455,
        hostname: '0.0.0.0',
          middleware: function (connect) {
            return [
              require('grunt-contrib-livereload/lib/utils').livereloadSnippet,
              connect.static(require('path').resolve('dist'))
            ];
          }
        }
      }
    },
    open: {
      dist: {
        path: 'http://localhost:5455'
      }
    },
    clean: {
      dist: 'dist'
    },
	'gh-pages': {
	  options: {
	    base: 'dist',
		branch: 'master'
      },
	  src: ['**']
	}
  });

  grunt.registerTask('build', function(target) {
    if (target === 'GHPages') {
      gruntPagesConfig.options.data.baseUrl = '/meip.github.io/';
    }

    grunt.task.run([
      'clean',
      'pages',
      'compass',
      'copy'
    ]);
  });
  
  grunt.registerTask('deploy', [
    'build:GHPages',
    'gh-pages'
  ]);

  grunt.registerTask('server', [
    'build',
    'connect',
    'open',
    'watch'
  ]);

  grunt.registerTask('default', 'server');

  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);
};
