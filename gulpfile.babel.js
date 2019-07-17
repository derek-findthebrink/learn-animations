// css pipeline

const gulp = require('gulp');
const sass = require('gulp-sass');
const babel = require('gulp-babel');
const browserSync = require('browser-sync');

sass.compiler = require('node-sass');

const server = browserSync.create();
const browserSyncReload = browserSync.reload;

const scssGlob = './src/sass/**/*.scss';
const jsGlob = './src/js/**/*.js';
const htmlGlob = './src/**/*.html';

// browser-sync server

function reload(done) {
  server.reload();
  done();
}

function browserSyncServe(done) {
  server.init({
    server: './_site',
    watch: true,
  });
  done();
}

// html pipeline
function html() {
  return gulp.src(htmlGlob)
    .pipe(gulp.dest('./_site/'));
}

function watchHtml() {
  return gulp.watch(htmlGlob, gulp.series(html, reload));
}


// scss pipeline


function scss() {
  return gulp.src(scssGlob, { sourcemaps: true })
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./_site/css'));
}

function scssWithStream() {
  return scss().pipe(browserSyncReload({ stream: true }));
}

const watchScss = () => gulp.watch(
  scssGlob,
  scssWithStream,
);

// gulp.task('sass:watch', () => {
//   gulp.watch(scssGlob, gulp.series('sass'));
// });


// js pipeline

function js() {
  return gulp.src(jsGlob, { sourcemaps: true })
    .pipe(babel())
    .pipe(gulp.dest('./_site/js'));
}

const watchJs = () => gulp.watch(
  jsGlob,
  gulp.series(js, reload),
);


const development = gulp.series(
  gulp.parallel(scss, html, js),
  browserSyncServe,
  gulp.parallel(watchScss, watchJs, watchHtml),
);

exports.serve = development;
exports.scss = scss;
// default task
exports.default = development;
