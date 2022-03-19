var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var ngAnnotate = require('gulp-ng-annotate');
var sourcemaps = require('gulp-sourcemaps');
const sass = require('gulp-sass')(require('sass'));
var notify = require('gulp-notify');
var templateCache = require('gulp-angular-templatecache');

gulp.task('js', function (cb) {
    gulp.src(['public/js/**/*.js'])
    .pipe(sourcemaps.init())
        .pipe(concat('app.js'))
        .pipe(ngAnnotate())
        .on('error', notify.onError(function (error) {
            return error.message;
        }))
        .pipe(uglify())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('public/build'))
    .pipe(notify({"title":"gulp status","message":"Javascript compiled!"}))
    .on('end', cb)
});

gulp.task('sass', function(cb){
    gulp.src('public/scss/*.scss')
    .pipe(sourcemaps.init())
        .pipe(sass({outputStyle:'compressed'}))
        .on('error', notify.onError(function (error) {
            return error.message;
        }))
    .pipe(sourcemaps.write('.'))
    .pipe(notify({"title":"gulp status","message":"CSS compiled!", "sound": "Pop" }))
    .pipe(gulp.dest('public/css'))
    .on('end', cb)
});

gulp.task('templates', function(cb){
    gulp.src('public/templates/**/*.html')
        .pipe(templateCache({
            module : 'rallly',
            root : 'templates'
        }))
        .pipe(gulp.dest('public/js'))
        .pipe(notify({"title":"gulp status","message":"Templates compiled!"}))
        .on('end', cb)
});

gulp.task('watch', gulp.series(['js','sass']), function () {
    gulp.watch('public/scss/**/*.scss', ['sass'])
    gulp.watch('public/templates/**/*.html', ['templates'])
    gulp.watch('public/js/**/*.js', ['js']);
});
