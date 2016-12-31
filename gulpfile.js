const gulp = require('gulp');
const del = require('del');
const typescript = require('gulp-typescript');
const tscConfig = require('./tsconfig.json');
const sourcemaps = require('gulp-sourcemaps');

// clean the contents of the distribution directory
gulp.task('clean', function () {
  return del('dist/**/*');
});

// TypeScript compile
gulp.task('compile', ['clean'], function () {
  return gulp
    .src(tscConfig.files)
    .pipe(sourcemaps.init())          // <--- sourcemaps for npm start
    .pipe(typescript(tscConfig.compilerOptions))
    .pipe(sourcemaps.write('.'))      // <--- sourcemaps for npm start
    .pipe(gulp.dest('dist/app'));
});

// copy libs
gulp.task('copy:libs', ['clean'], function() {
  return gulp.src([
      'node_modules/core-js/client/shim.min.js',
      'node_modules/zone.js/dist/zone.js',
      'node_modules/reflect-metadata/Reflect.js',
      'node_modules/systemjs/dist/system.src.js',
      'node_modules/angular2/bundles/router.dev.js'
    ])
    .pipe(gulp.dest('dist/lib'))
});

// copy static assets - i.e. non TypeScript compiled source
gulp.task('copy:assets', ['copy:libs'], function() {
  return gulp.src(['app/**/*', '!app/**/*.ts'], { base : './' })
    .pipe(gulp.dest('dist'))
});

gulp.task('copyAssets', function() {
  return gulp.src(['app/**/*', '!app/**/*.ts'], { base : './' })
    .pipe(gulp.dest('dist'))
});

gulp.task('build', ['compile']);
gulp.task('default', ['build']);
gulp.task('refresh', ['copy:assets']);