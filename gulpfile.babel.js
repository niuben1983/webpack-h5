/**
 * Created by jiaguoquan on 12/09/16.
 */
'use strict';

import yargs from 'yargs';

import gulp from 'gulp';
import gutil from 'gulp-util';
import imagemin from 'gulp-imagemin';
import pngquant from 'imagemin-pngquant';
import cache from 'gulp-cache';

import webpack from 'webpack';

let args = yargs.argv;
let prefix = args._.length === 0 ? 'dev' : args._[0];

gulp.task('copyimgs', ['webpack'], () => {
    let files = ['./src/img/**'];
    return gulp.src(files)
        .pipe(cache(imagemin({
            progressive: true,
            svgoPlugins: [{ removeViewBox: false }],
            use: [pngquant()]
        })))
        .pipe(gulp.dest('./' + prefix + '/img'));
});

gulp.task('copyfiles', () => {
    return gulp.src('./src/lib/*')
        .pipe(gulp.dest('./' + prefix + '/lib'));
});

gulp.task('webpack', (callback) => {
    let prefix = args._.length === 0 ? '' : '.' + args._[0];
    if (prefix == '.webpack') {
        prefix = '';
    }

    var cfg = require('./webpack' + prefix + '.config');
    webpack(cfg, function (err, stats) {
        if (err) {
            throw new gutil.PluginError("webpack", err);
        }

        callback();
    });
});

gulp.task('default', ['copyfiles', 'copyimgs'], () => { });

gulp.task('pre', ['copyimgs', 'copyfiles'], () => { });

gulp.task('prod', ['copyimgs', 'copyfiles'], () => { });