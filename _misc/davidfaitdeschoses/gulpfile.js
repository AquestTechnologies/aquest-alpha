var gulp          = require('gulp');
var browserify    = require('browserify');
var babel         = require('babelify');
var source        = require('vinyl-source-stream'); // Use conventional text streams at the start of your gulp or vinyl pipelines, making for nicer interoperability with the existing npm stream ecosystem.

gulp.task('default', ['serve']); 

// ES6 jsx -> ES5 js puis browserify app.js
gulp.task('s', function() {
  
  browserify('./client.js')
    .transform(babel)
    .bundle()
    .pipe(source('app.js'))
    .pipe(gulp.dest('bundle/'));
});
