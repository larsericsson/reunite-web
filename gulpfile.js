// jshint esversion: 6

const $ = require('gulp-load-plugins')();
const gulp = require('gulp');
const merge = require('merge-stream');
const imagemin = require('gulp-imagemin');
const runSequence = require('gulp-sequence');
const uglify = require('gulp-uglify');
require('colors');

const COMPATIBILITY = ['last 2 versions', 'ie >= 9'];
let isProduction = process.env.NODE_ENV === 'production';

const PATHS = {
  tempDir: '.tmp',
  stylesMainFile: 'src/scss/style.scss',
  styles: [
    'src/scss/**/*.scss'
  ],
  javascriptAll: 'src/js/**/*.js',
  javascriptBody: [
    'src/js/main.js'
  ],
  images: 'src/img/**/*',
  public: 'public'
};

const logFileChange = event => {
  const filename = require('path').relative(__dirname, event.path);
  console.log('[' + 'WATCH'.green + '] ' + filename.magenta + ' was ' + event.type + ', running tasks...');
};

// compile SCSS
gulp.task('styles', () => {
  const minifycss = $.if(isProduction, $.minifyCss());

  return gulp.src(PATHS.stylesMainFile)
    .pipe($.if(!isProduction, $.sourcemaps.init()))
    .pipe($.sass())
    .on('error', $.notify.onError({
        message: '<%= error.message %>',
        title: 'SCSS Error'
    }))
    .pipe($.autoprefixer({
      browsers: COMPATIBILITY
    }))
    .pipe(minifycss)
    .pipe($.sourcemaps.write('.'))
    .pipe(gulp.dest('public/css'));
});

gulp.task('javascript', () => {
  const body = gulp.src(PATHS.javascriptBody)
    .pipe($.if(!isProduction, $.sourcemaps.init()))
    .pipe($.concat('main.js', {
      newLine:'\n;'
    }))
    .pipe(uglify())
    .pipe($.sourcemaps.write())
    .pipe(gulp.dest('public/js'));

  return merge(body);
});

gulp.task('images', () => {
  gulp.src(PATHS.images)
    .pipe(imagemin())
    .pipe(gulp.dest('public/img'));
});

gulp.task('watch-styles', () => {
  gulp.watch([PATHS.stylesMainFile, PATHS.styles], ['styles'])
    .on('change', logFileChange);
});

gulp.task('watch-javascript', () => {
  gulp.watch(PATHS.javascriptAll, ['javascript'])
    .on('change', logFileChange);
});

// build for development and watch for changes
gulp.task('build-dev', cb => {
  runSequence(
    ['styles'],
    'javascript',
    'images',
    ['watch-styles', 'watch-javascript']
  )(cb);
});

// build for production
gulp.task('build', cb => {
  isProduction = true;

  runSequence(
    ['styles'],
    'javascript',
    'images'
  )(cb);
});

gulp.task('default', ['build-dev']);
