const del = require('del');
const gulp = require('gulp');
const rimraf = require('gulp-rimraf');
const concat = require('gulp-concat');  
const rename = require('gulp-rename');  
const uglify = require('gulp-uglify'); 
const runSequence = require('run-sequence');
const typescript = require('gulp-typescript');
const sourcemaps = require('gulp-sourcemaps');

const tscConfig = require('./tsconfig.json');

var paths = {
    dist: './dist',
};

// Clean the contents of the distribution directory
gulp.task('clean', function () {
  return gulp.src(paths.dist, { read: false }).pipe(rimraf({ force: true }));
});

// Copy library css files.
gulp.task('copy:cssLibs', function() {
  return gulp.src([
      'node_modules/materialize-css/dist/css/materialize.min.css'
    ])
    .pipe(concat('libs.min.css'))
    .pipe(gulp.dest('dist/lib'))
});

// Copy library js files.
gulp.task('copy:jsLibs', function() {
  return gulp.src([
      'node_modules/jquery/dist/jquery.min.js',
      'node_modules/materialize-css/dist/js/materialize.min.js',
      'node_modules/core-js/client/shim.min.js',
      'node_modules/zone.js/dist/zone.js',
      'node_modules/reflect-metadata/Reflect.js',
      'node_modules/systemjs/dist/system.src.js',
      'node_modules/angular2/bundles/router.dev.js'
    ])
    .pipe(concat('libs.js'))
    .pipe(gulp.dest('dist/lib'))
    .pipe(rename('libs.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('dist/lib'));
});

// Clean imterim library files.
gulp.task('remove:interimLibs', function() {
  return del(['dist/lib/*', '!dist/lib/libs.min.*'])
});

// TypeScript compile
gulp.task('compile', function () {
  var tsProject = typescript.createProject('tsconfig.json', { outDir: "dist", declaration: true });
  var tsResult = tsProject.src().pipe(tsProject());
  tsResult.pipe(gulp.dest(paths.dist));
  return tsResult.dts.pipe(gulp.dest(paths.dist));
});

// copy static assets - i.e. non TypeScript compiled source
gulp.task('copy:assets', function() {
  return gulp.src(['app/**/*', '!app/**/*.ts'], { base : './' })
    .pipe(gulp.dest('dist'))
});

gulp.task('default', function (callback) {
    runSequence(
        'clean',
        'copy:cssLibs',
        'copy:jsLibs',
        'remove:interimLibs',
        'compile',
        'copy:assets',
        function (error) {
            if (error) {
                console.log(error.message);
            } else {
                console.log('FINISHED SUCCESSFULLY');
            }
            callback(error);
        });
});
