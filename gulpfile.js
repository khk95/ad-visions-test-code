const gulp = require('gulp');

const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
const concat = require('gulp-concat');
const notify = require('gulp-notify');
const uglify = require('gulp-uglify-es').default;
const strip = require('gulp-strip-comments');
const stripDebug = require('gulp-strip-debug');
const imagemin = require('gulp-imagemin');
const imageminMozjpeg = require('imagemin-mozjpeg');
const newer = require('gulp-newer');

const dirs = {
    dev: {
        scss: './dev/scss',
        js: './dev/js',
        img: './dev/img'
    },
    dist: {
        css: './dist/css/',
        js: './dist/js/',
        img: './dist/img/'
    }
}

// TASKS

// -- dev
// ---- styles
gulp.task('styles-dev', () => {
    return gulp.src(`${dirs.dev.scss}/style.scss`)
        .pipe(sourcemaps.init())
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(sass().on('error', sass.logError))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(dirs.dist.css))
        .pipe(notify({
            title: 'Gulp styles: dev.',
            message: 'Styles compilled successfully.'
        }));
});

// ---- scripts
gulp.task('scripts-dev', () => {
    return gulp.src(`${dirs.dev.js}/**/*.js`)
        .pipe(sourcemaps.init())
        .pipe(concat('scripts.js'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(dirs.dist.js))
        .pipe(notify({
            title: 'Gulp scripts: dev.',
            message: "Scripts compilled successfully.",
        }));
});

// -- dist
// ---- styles
gulp.task('styles-dist', () => {
    return gulp.src(`${dirs.dev.scss}/style.scss`)
        .pipe(sourcemaps.init())
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(dirs.dist.css))
        .pipe(notify({
            title: 'Gulp styles: dist',
            message: 'Styles compilled successfully.'
        }));
});

// ---- scripts
gulp.task('scripts-dist', () => {
    return gulp.src(`${dirs.dev.js}/**/*.js`)
        .pipe(concat('scripts.js'))
        .pipe(uglify())
        .pipe(strip())
        .pipe(stripDebug())
        .pipe(gulp.dest(dirs.dist.js))
        .pipe(notify({
            title: 'Gulp scripts: dist',
            message: 'Scripts compilled successfully.',
        }));
});

// -- images
gulp.task('images', () => {
    return gulp.src(`${dirs.dev.img}/**/*`)
        .pipe(newer(dirs.dist.img))
        .pipe(imagemin([
            imageminMozjpeg({
                quality: 80
            })
        ]))
        .pipe(gulp.dest(dirs.dist.img))
        .pipe(notify({
            title: 'Gulp images',
            message: 'Images optimized successfully'
        }))
});

// -- watch tasks
gulp.task('watch:styles', () => {
    gulp.watch(`${dirs.dev.scss}/**/*.scss`,
    gulp.series('styles-dev'));
});

gulp.task('watch:scripts', () => {
    gulp.watch(`${dirs.dev.js}/**/*.js`,
    gulp.series('scripts-dev'));
});

gulp.task('watch:images', () => {
    gulp.watch(`${dirs.dev.img}/**/*`,
    gulp.series('images'));
});

// ----

gulp.task('default', gulp.parallel(
    'watch:styles',
    'watch:scripts',
    'watch:images'
));

gulp.task('dist', gulp.parallel(
    'styles-dist',
    'scripts-dist',
    'images'
));