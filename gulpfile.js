const gulp = require('gulp');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const ngAnnotate = require('gulp-ng-annotate');
const sourcemaps = require('gulp-sourcemaps');
const sass = require('gulp-sass')(require('sass'));
const notify = require('gulp-notify');
const batch = require('gulp-batch');
const templateCache = require('gulp-angular-templatecache');

gulp.task('templates', function(cb){
    return gulp.src('src/templates/**/*.html')
    .pipe(templateCache({
        module : 'rallly',
        root : 'templates'
    }))
    .pipe(gulp.dest('public/js'))
    .on('end', cb)
});


gulp.task('js', function (cb) {
    return gulp.src(['src/js/**/*.js', 'public/js/templates.js'])
    .pipe(sourcemaps.init())
    .pipe(concat('app.js'))
    .pipe(ngAnnotate())
    .on('error', notify.onError(function (error) {
        console.log(error)
        return error.message;
    }))
    .pipe(uglify())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./public/build'))
    .on('end', cb)
});

gulp.task('sass', function(){
    return gulp.src('src/scss/*.scss')
    .pipe(sourcemaps.init())
    .pipe(sass({outputStyle:'compressed'}))
    .on('error', notify.onError(function (error) {
        return error.message;
    }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('public/css'))
});

gulp.task('build', gulp.series(['js','sass'])) ;
gulp.task('default', gulp.series(['build'])) ;

gulp.task('watch', function () {
    // THIS FUNCTION IS NOT RIGHT YET.
    gulp.watch('src/scss/**/*.scss', batch(function (events, done) {
        console.log('Starting sass')
        gulp.start('sass', done);
    }));
    gulp.watch('src/templates/**/*.html', batch(function (events, done) {
        console.log('Starting templates')
        gulp.start('templates', done);
    }));
    gulp.watch('src/js/**/*.js',  batch(function (events, done) {
        console.log('Starting js')
        gulp.start('js', () => { console.log('JS Done') ; done()});
    }));
});
