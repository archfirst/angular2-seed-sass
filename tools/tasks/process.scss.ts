import {join} from 'path';
import {APP_SRC} from '../config';

export = function processScss(gulp, plugins) {
    return function () {
        return gulp.src(join(APP_SRC, '**', '*.scss'))
            .pipe(plugins.sass().on('error', plugins.sass.logError))
            .pipe(gulp.dest(APP_SRC));
    };
}
