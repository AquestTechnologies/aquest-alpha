
// Charge des dependances en provenance de npm
var gulp = require('gulp');
var del = require('del');  // Deletes files.
var browserify = require('browserify');
var babel = require('babelify');
var source = require('vinyl-source-stream'); // Use conventional text streams at the start of your gulp or vinyl pipelines, making for nicer interoperability with the existing npm stream ecosystem.
var less = require('gulp-less');

// Quelques variables pour modifier la structure des fichiers facilement
var paths = {
  app_jsx: ['./src/app.jsx'],
  jsx: ['src/**/*.jsx'],
  app_less: ['src/less/styles.less'],
  less: ['src/less/*.less']
};
 
// Une tache qui sera appellée par les autres taches
// reset le build en le supprimant
gulp.task('clean', function(done) {
  del(['build'], done);
});

// Compile le less
gulp.task('less', ['clean'], function() {
  gulp.src(paths.app_less)
    .pipe(less())
    .pipe(gulp.dest('./src/'));
});

// ES6 jsx -> ES5 js puis browserify app.js
gulp.task('js', ['clean'], function() {
  // Browserify/bundle the JS.
        
 browserify(paths.app_jsx)
    .transform(babel)
    .bundle()
    .pipe(source('bundle.js'))
    .pipe(gulp.dest('./src/'));
});


// Rerun tasks whenever a file changes.
gulp.task('watch', function() {
  gulp.watch(paths.jsx, ['js']);
  gulp.watch(paths.less, ['less']);
});
 
// The default task (called when we run `gulp` from cli)
gulp.task('default', ['watch','js', 'less']);