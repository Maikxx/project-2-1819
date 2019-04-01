const gulp = require('gulp')
const cleanCSS = require('gulp-clean-css')
const autoprefixer = require('gulp-autoprefixer')
const uglify = require('gulp-uglify')
const babel = require('gulp-babel')
const ts = require('gulp-typescript')
const plumber = require('gulp-plumber')
const brotli = require('gulp-brotli')
const gzip = require('gulp-gzip')

gulp.task('minifyCss', () => {
    return gulp.src('./client/css/*.css')
        .pipe(autoprefixer())
        .pipe(cleanCSS({
            browsers: [
                'last 2 versions',
                '> 1%',
                'maintained node versions',
                'not dead'
            ],
        }))
        .pipe(gulp.dest('./server/public/css'))
})

gulp.task('minifyJs', () => {
    return gulp.src('./client/scripts/*.ts')
        .pipe(plumber({
            errorHandler: function (error) {
                console.error(error.message)
                this.emit('end')
            }
        }))
        .pipe(ts({
            noImplicitAny: true,
        }))
        .pipe(babel({
            presets: ['@babel/env'],
            plugins: ['@babel/transform-regenerator']
        }))
        .pipe(uglify())
        .pipe(gulp.dest('./server/public/scripts'))
})

gulp.task('precompress', () => {
    gulp.src('./server/public/**/*.{css,js}')
        .pipe(brotli.compress({
            extension: 'br',
            skipLarger: true,
            mode: 0,
            quality: 11,
            lgblock: 0
        }))
        .pipe(gulp.dest('./server/public'))

    return gulp.src('./server/public/**/*.{css,js}')
        .pipe(gzip({
            append: true,
            gzipOptions: {
                level: 9,
            }
        }))
        .pipe(gulp.dest('./server/public'))
})

if (process.env.NODE_ENV !== 'production') {
    gulp.watch(['./client/css/*.css'], gulp.series(['minifyCss', 'precompress']))
    gulp.watch(['./client/scripts/*.ts'], gulp.series(['minifyJs', 'precompress']))
}