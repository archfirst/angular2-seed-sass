import * as gulp from 'gulp';
import * as gulpLoadPlugins from 'gulp-load-plugins';
import * as merge from 'merge-stream';
import {join} from 'path';
import {APP_SRC, APP_ASSETS, ENV} from '../../config';
const plugins = <any>gulpLoadPlugins();
var sasslint = require('gulp-sass-lint');

const isProd = ENV === 'prod';

function lintComponentCss() {
  return gulp.src([
      join(APP_SRC, '**', '*.scss'),
      '!' + join(APP_SRC, 'assets', '**', '*.scss')
    ])
    .pipe(isProd ? plugins.cached('sass-lint') : plugins.util.noop())
    .pipe(sasslint())
    .pipe(sasslint.format())
    .pipe(sasslint.failOnError());
}

function lintExternalCss() {
  return gulp.src(getExternalCss().map(r => r.src))
    .pipe(isProd ? plugins.cached('sass-lint') : plugins.util.noop())
    .pipe(sasslint())
    .pipe(sasslint.format())
    .pipe(sasslint.failOnError());
}

function getExternalCss() {
  return APP_ASSETS.filter(d => /\.scss$/.test(d.src) && !d.vendor);
}

export = () => merge(lintComponentCss(), lintExternalCss());
