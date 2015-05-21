var gulp          = require('gulp');
var gutil         = require('gulp-util');
var less          = require('gulp-less');
var htmlmin       = require('gulp-htmlmin');
var nodemon       = require('gulp-nodemon');
var browserify    = require('browserify');
var babel         = require('babelify');
var del           = require('del');  // Deletes files.
var source        = require('vinyl-source-stream'); // Use conventional text streams at the start of your gulp or vinyl pipelines, making for nicer interoperability with the existing npm stream ecosystem.

// Quelques variables pour modifier la structure des fichiers facilement
var paths = {
  dist:       'dist/',
  server:     'src/server/index.js',
  index_html: ['src/shared/index.html'],
  app_jsx:    ['src/shared/app.jsx'],
  es6_files:  ['src/**/*.js*'],
  app_less:   ['src/client/less/app.less'],
  less_files: ['src/client/less/*.less']
};
 
 
// Une tache qui sera appellée par les autres taches
// reset le build en le supprimant
gulp.task('clean', function(done) {
  
  del(['build'], done);
  gutil.log(gutil.colors.inverse('Build deleted.'));
});


// Compile le less
gulp.task('compileless', ['clean'], function() {
  
  gulp.src(paths.app_less)
    .pipe(less())
    .pipe(gulp.dest(paths.dist));
    
  gutil.log(gutil.colors.bgGreen('We have CSS!'));
});


// ES6 jsx -> ES5 js puis browserify app.js
gulp.task('bundlejs', ['clean'], function() {
  
  browserify(paths.app_jsx)
    .transform(babel)
    .bundle()
    .pipe(source('app.js'))
    .pipe(gulp.dest(paths.dist));
    
  gutil.log(gutil.colors.bgGreen('JS bundled!'));
});


gulp.task('minifyhtml', ['clean'], function() {
  gutil.log(gutil.colors.bgGreen('index.html looks so small!'));
  
  return gulp.src(paths.index_html)
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest(paths.dist));
});


gulp.task('build', ['compileless','bundlejs','minifyhtml'], function() {
  gutil.log(gutil.colors.bgBlue('Build complete!'));
});


gulp.task('default', ['build'], function() {
  
  nodemon({
    script:   paths.server, 
    delay:    '500ms',
    ext:      'jsx js less',
    env:      { 'NODE_ENV': 'development' },
    ignore:   ["_misc", "node_modules", "dist"],
    tasks:    ['compileless','bundlejs'],
  });
});