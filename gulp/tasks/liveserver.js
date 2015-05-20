var gulp = require('gulp');
var nodemon = require('gulp-nodemon');

// Starts webserver
gulp.task('liveserver', ['browserify','less','minifyhtml'], function() {
  nodemon({
    script: 'app/server/index.js', 
    tasks: ['watch']
  });
});