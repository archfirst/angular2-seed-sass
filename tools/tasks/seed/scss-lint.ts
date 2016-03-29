import * as gulp from 'gulp';
import * as gulpLoadPlugins from 'gulp-load-plugins';
import * as merge from 'merge-stream';
import * as reporter from 'postcss-reporter';
import * as stylelint from 'stylelint';
import * as doiuse from 'doiuse';
import * as colorguard from 'colorguard';
import {join} from 'path';
import {APP_SRC, APP_ASSETS, BROWSER_LIST, ENV} from '../../config';
const plugins = <any>gulpLoadPlugins();
var scsslint = require('gulp-scss-lint');


const isProd = ENV === 'prod';

const processors = [
  doiuse({
    browsers: BROWSER_LIST,
  }),
  colorguard(),
  stylelint(),
  reporter({clearMessages: true})
];

function lintComponentCss() {
  return gulp.src([
      join(APP_SRC, '**', '*.scss'),
      '!' + join(APP_SRC, 'assets', '**', '*.scss')
    ])
    .pipe(isProd ? plugins.cached('scss-lint') : plugins.util.noop())
    .pipe(scsslint(processors));
}

function lintExternalCss() {
  return gulp.src(getExternalCss().map(r => r.src))
    .pipe(isProd ? plugins.cached('scss-lint') : plugins.util.noop())
    .pipe(scsslint(processors));
}

function getExternalCss() {
  return APP_ASSETS.filter(d => /\.scss$/.test(d.src) && !d.vendor);
}


export = () => merge(lintComponentCss(), lintExternalCss());
