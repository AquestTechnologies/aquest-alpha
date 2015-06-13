var gulp          = require('gulp');
var gutil         = require('gulp-util');
var less          = require('gulp-less');
var shell         = require('gulp-shell');
var htmlmin       = require('gulp-htmlmin');
var browserify    = require('browserify');
var babel         = require('babelify');
var source        = require('vinyl-source-stream'); // Use conventional text streams at the start of your gulp or vinyl pipelines, making for nicer interoperability with the existing npm stream ecosystem.
var del           = require('del');  // Deletes files.
var flo           = require('fb-flo');
var fs            = require('fs');

// Quelques variables pour modifier la structure des fichiers facilement
var paths = {
  dist:       'dist/',
  server:     'src/server/index.js',
  client:     'src/client/app.jsx',
  index_html: 'src/shared/index.html',
  app_less:   'src/client/less/app.less',
  es6_files:  'src/shared/**/*.js*',
  less_files: 'src/client/less/**/*.less'
};
 
gulp.task('default', ['serve']); 

// reset le build en le supprimant
gulp.task('clean', function(done) {

  //del([paths.dist], done); //ATTENTION ce truc supprime le dossier img
  del(['riendutout'], done);
});


// Compile le less
gulp.task('less', ['clean'], function() {
  
  gulp.src(paths.app_less)
    .pipe(less())
    .pipe(gulp.dest(paths.dist));
});


// ES6 jsx -> ES5 js puis browserify app.js
gulp.task('scripts', ['clean'], function() {
  
  browserify(paths.client)
    .transform(babel.configure({
      stage: 1, //ES7 async wait
      optional: ['runtime'] //Regenerator en runtime et d'autre petites choses https://babeljs.io/docs/usage/runtime/
    }))
    .bundle()
    .pipe(source('app.js'))
    .pipe(gulp.dest(paths.dist));
});


gulp.task('html', ['clean'], function() {

  return gulp.src(paths.index_html)
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest(paths.dist));
});


gulp.task('build', ['less','scripts','html'], function() {
  
  gutil.log(gutil.colors.bgBlue('Build complete!'));
});


gulp.task('watch', function() {
  
    gulp.watch(paths.client, ['scripts']);
    gulp.watch(paths.es6_files, ['scripts']);
    gulp.watch(paths.less_files, ['less']);
});


gulp.task('devServer', shell.task([
  //On a besoin de async await coté server alors on utilise node à la sauce babel
  'node_modules/babel/bin/babel-node --stage 1 src/server/index.js'
]));


gulp.task('serve', ['build', 'watch'], function() {
  
  gulp.start('fb-flo');
  gulp.start('devServer');
});


gulp.task('fb-flo', function (done) {
  
  flo(
    './dist', {
      port: 8888,
      host: 'localhost',
      verbose: false,
      glob: [
        '**/*.{js,css}',
        '!**/*.{tmp,log,jpg,png,gif}'
      ]
    },
    resolver
  ).once('ready', done);
});


function resolver(filepath, callback) {
  gutil.log('Reloading "', filepath, '" with flo...');
  callback({
    resourceURL: filepath,
    contents: fs.readFileSync('./dist/' + filepath),
    update: function (_window, _resourceURL) {
      console.log('Resource ' + _resourceURL + ' has just been updated with new content');
    }
  });
}