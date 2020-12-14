import gulp from 'gulp';
import babel from 'gulp-babel';
import postcss from 'gulp-postcss';
import htmlmin from 'gulp-htmlmin';
import sync from 'browser-sync';
import replace from 'gulp-replace';
import autoprefixer from 'autoprefixer';
import pimport from 'postcss-import';
import minmax from 'postcss-media-minmax';
import terser from 'gulp-terser';
import csso from 'postcss-csso';
import pug from 'gulp-pug';

export const html = () => {
  return gulp
    .src('src/*.pug')
    .pipe(pug())
    .pipe(
      htmlmin({
        removeComments: true,
        collapseWhitespace: true,
      })
    )
    .pipe(gulp.dest('dist'))
    .pipe(sync.stream());
};

export const styles = () => {
  return gulp
    .src('src/styles/index.css')
    .pipe(postcss([autoprefixer(), pimport, minmax, csso]))
    .pipe(replace('/..//g', ''))
    .pipe(gulp.dest('dist'))
    .pipe(sync.stream());
};

export const scripts = () => {
  return gulp
    .src('src/scripts/index.js')
    .pipe(
      babel({
        presets: ['@babel/preset-env'],
      })
    )
    .pipe(terser())
    .pipe(gulp.dest('dist'))
    .pipe(sync.stream());
};

export const copy = () => {
  return gulp
    .src(['src/fonts/**/*', 'src/images/**/*'], {
      base: 'src',
    })
    .pipe(gulp.dest('dist'))
    .pipe(
      sync.stream({
        once: true,
      })
    );
};

export const paths = () => {
  return gulp
    .src('dist/*.html')
    .pipe(replace(/(link\(rel="stylesheet", href=")styles\/(index.css"\))/, '$1$2'))
    .pipe(replace(/(script\(src=")scripts\/(index.js"\))/, '$1$2'))
    .pipe(gulp.dest('dist'));
};

export const server = () => {
  sync.init({
    ui: false,
    notify: false,
    server: {
      baseDir: 'dist',
    },
  });
};

export const watch = () => {
  gulp.watch(['src/*.pug', 'src/components/*.pug'], gulp.series(html, paths));
  gulp.watch('src/styles/**/*.css', gulp.series(styles));
  gulp.watch('src/scripts/**/*.js', gulp.series(scripts));
  gulp.watch(['src/fonts/**/*', 'src/images/**/*'], gulp.series(copy));
};

export default gulp.series(gulp.parallel(html, styles, scripts, copy), paths, gulp.parallel(watch, server));
