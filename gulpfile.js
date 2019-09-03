const gulp = require('gulp');
const browsersync = require('browser-sync').create();
const sass = require('gulp-sass');
const nunjucksRender = require('gulp-nunjucks-render');
const htmlmin = require('gulp-htmlmin');
const babel = require('gulp-babel');
const minify = require('gulp-minify');
const cleanCSS = require('gulp-clean-css');
const concat = require('gulp-concat');
const del = require('del');
const raster = require('gulp-raster');
const rename = require('gulp-rename');

const jsLocations = ['node_modules/bootstrap/dist/js/bootstrap.min.js',
  'node_modules/popper.js/dist/popper.min.js',
  'node_modules/jquery/dist/jquery.min.js'];

const cssLocations = ['node_modules/bootstrap/scss/bootstrap.scss'];

function browserSync(done) {
  browsersync.init({
    server: {
      baseDir: './public',
    },
    port: 3000,
  });
  done();
}

function browserSyncReload(done) {
  browsersync.reload();
  done();
}

function clean() {
  return del(['public/assets/']);
}

function prePackagedCss() {
  return gulp
    .src(cssLocations)
    .pipe(sass())
    .pipe(cleanCSS())
    .pipe(gulp.dest('public/assets/css'))
    .pipe(browsersync.stream());
}

function customCss() {
  return gulp
    .src('src/css/**/**.+(css|scss)')
    .pipe(concat('style.scss'))
    .pipe(sass())
    .pipe(cleanCSS())
    .pipe(gulp.dest('public/assets/css'))
    .pipe(browsersync.stream());
}

function prePackagedJs() {
  return gulp
    .src(jsLocations)
    .pipe(gulp.dest('public/assets/js'))
    .pipe(browsersync.stream());
}

function customJs() {
  return gulp
    .src('src/js/**/*.js')
    .pipe(babel({
      presets: ['@babel/env'],
    }))
    .pipe(minify({ noSource: true, ext: { min: '.js' } }))
    .pipe(gulp.dest('public/assets/js'))
    .pipe(browsersync.stream());
}

function nunjucks() {
  return gulp
    .src(['src/pages/**/*.+(html|njk)'])
    .pipe(nunjucksRender({
      path: ['src/templates'],
    }))
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest('public'))
    .pipe(browsersync.stream());
}

function rasterizeSvg() {
  return gulp
    .src('src/images/**/*.svg')
    .pipe(raster({ format: 'png', scale: 0.5 }))
    .pipe(rename({ extname: '.png' }))
    .pipe(gulp.dest('public/img'))
    .pipe(browsersync.stream());
}

function moveImages() {
  return gulp
    .src('src/images/**/*.+(jpg|png|jp2)')
    .pipe(gulp.dest('public/img'))
    .pipe(browsersync.stream());
}

function watchFiles() {
  gulp.watch(cssLocations, prePackagedCss);
  gulp.watch(jsLocations, prePackagedJs);
  gulp.watch('src/css/**/**.+(css|scss)', customCss);
  gulp.watch('src/js/**/*.js', customJs);
  gulp.watch('src/images/**/*.svg', rasterizeSvg);
  gulp.watch('src/images/**/*.+(jpg|png|jp2)', moveImages);
  gulp.watch(['src/pages/**/*.+(html|njk)', 'src/templates/**/*.+(html|njk)'], gulp.series(nunjucks, browserSyncReload));
}

const build = gulp.series(clean, gulp.parallel(prePackagedCss, customCss,
  prePackagedJs, customJs, rasterizeSvg, moveImages, nunjucks));
const watch = gulp.parallel(watchFiles, browserSync);
const run = gulp.series(build, watch);

exports.build = build;
exports.watch = watch;
exports.run = run;
