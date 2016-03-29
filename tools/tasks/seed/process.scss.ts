import * as gulp from 'gulp';
import * as gulpLoadPlugins from 'gulp-load-plugins';
import {join} from 'path';
import {APP_SRC, DEV_DEST, PROD_DEST, ENV} from './../../config';
const plugins = <any>gulpLoadPlugins();
const isProd = ENV === 'prod';

export = () => {
  return gulp.src(join(APP_SRC, '**', '*.scss'))
    .pipe(plugins.sass())
    .pipe(gulp.dest(isProd ? PROD_DEST : DEV_DEST));
}
