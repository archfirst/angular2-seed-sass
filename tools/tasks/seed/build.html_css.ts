import * as gulp from 'gulp';
import * as gulpLoadPlugins from 'gulp-load-plugins';
import * as merge from 'merge-stream';
import * as autoprefixer from 'autoprefixer';
import * as cssnano from 'cssnano';
import {join} from 'path';
import {APP_SRC, TMP_DIR, CSS_PROD_BUNDLE, CSS_DEST, APP_DEST, BROWSER_LIST, ENV, DEPENDENCIES} from '../../config';
const plugins = <any>gulpLoadPlugins();

const processors = [
  autoprefixer({
    browsers: BROWSER_LIST
  })
];

const isProd = ENV === 'prod';

if (isProd) {
  processors.push(
    cssnano({
      discardComments: {removeAll: true}
    })
  );
}

function prepareTemplates() {
  return gulp.src(join(APP_SRC, '**', '*.html'))
    .pipe(gulp.dest(TMP_DIR));
}


function processCss() {
  return merge(processComponentCss(), processExternalCss())
    .pipe(plugins.postcss(processors))
    .pipe(isProd ? plugins.concat(CSS_PROD_BUNDLE) : plugins.util.noop())
    .pipe(gulp.dest(isProd ? CSS_DEST : APP_DEST));
}

function processComponentCss() {
  return gulp.src(join(TMP_DIR, '**', '*.css'))
    .pipe(isProd ? plugins.cached('process-component-css') : plugins.util.noop());
}

function processExternalCss() {
  return gulp.src(getExternalCss().map(r => r.src))
    .pipe(isProd ? plugins.cached('process-external-css') : plugins.util.noop());
}

function getExternalCss() {
  return DEPENDENCIES.filter(d => /\.css$/.test(d.src));
}


export = () => merge(processCss(), prepareTemplates());
