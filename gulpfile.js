const gulp = require('gulp');
const gutil = require('gulp-util');
const source = require('vinyl-source-stream');
const buffer = require('gulp-buffer');
const babelify = require('babelify');
const Browserify = require('browserify');
const nodemon = require('gulp-nodemon');
const path = require('path');
const rev = require('gulp-rev');
const revDel = require('rev-del');
const derequire = require('gulp-derequire');
const gulpif = require('gulp-if');
const shim = require('browserify-shim');
const isProduction = process.env.NODE_ENV === 'production';

const bundler = new Browserify({
  debug: true,
  fullPaths: !isProduction,
  extensions: ['.jsx', '.js', '.json'],
})
.transform(shim, { global: true })
.transform(babelify.configure({
  extensions: ['.jsx', '.js', '.json'],
  sourceMapRelative: 'public/js',
  optional: ['es7.objectRestSpread', 'es7.classProperties', 'es7.decorators'],
}))
.require('./src/browser.jsx', { entry: true });

// optional minification
if (isProduction) {
  bundler.plugin('bundle-collapser/plugin');
  bundler.plugin('minifyify', { map: '/public/js/browser.js.map', output: 'assets/browser.js.map' });
}

function error(err) {
  gutil.log(err.stack || err);
  this.emit('end');
}

function bundle() {
  gutil.log('Compiling JS...');

  return bundler.bundle()
    .on('error', error)
    .pipe(source('browser.js'))
    .pipe(gulpif(isProduction, derequire()))
    .pipe(buffer())
    .pipe(rev())
    .pipe(gulp.dest('./assets'))
    .pipe(rev.manifest())
    .pipe(revDel({ dest: './assets' }))
    .pipe(gulp.dest('./assets'));
}

/**
 * Gulp task alias
 */
gulp.task('bundle', function bundleTask() {
  return bundle();
});

/**
 * Gulp task alias
 */
gulp.task('default', ['bundle']);

// nodemon --watch ./src -e js,jsx,html ./bin/server.js | ./node_modules/.bin/bunyan -o short
gulp.task('watch', ['bundle'], function watcher() {
  nodemon({
    script: './bin/restify.js',
    execMap: {
      js: './node_modules/.bin/babel-node',
    },
    ext: 'js html jsx css',
    watch: './src',
    env: {
      'NODE_ENV': 'development',
    },
    tasks: function onFileChange(changedFiles) {
      const tasks = [];
      changedFiles.forEach(file => {
        if (path.extname(file) === '.jsx' && !~tasks.indexOf('bundle')) {
          tasks.push('bundle');
        }
      });
      return tasks;
    },
  });
});
