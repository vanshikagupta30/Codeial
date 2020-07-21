// we used gulp bcoz like if we go through the link which is in our webpage now, every time our css or scss file will render again and 
// again it takes a lot of memory or storage that's why we use gulp now, if we start our server that time gulp will store the compressed 
// file(which takes less memory)this will do like if we go to the link then our scss or css files stored in the cashe(kyuki hmne apna
//  plha page bhi to render kiya tha usme usne store krli thi usse use bar bar krne ki zarurt ni pdegi)
const gulp = require('gulp');

const sass = require('gulp-sass');
const cssnano = require('gulp-cssnano');
const rev = require('gulp-rev');
const uglify = require('gulp-uglify-es').default;
const imagemin = require('gulp-imagemin');
const del = require('del');


gulp.task('css', function(done){
    console.log('minifying css...');
    // ** means any folder and every folder or subfolder inside it and any file name .scss
    gulp.src('./assets/scss/**/*.scss')
    // pipe is the function which is calling all sub-middlewares which are in gulp
    .pipe(sass())
    .pipe(cssnano())
    .pipe(gulp.dest('./assets.css'));

    return gulp.src('./assets/**/*.css')
    .pipe(rev())
    .pipe(gulp.dest('./public/assets'))
    .pipe(rev.manifest({
        // cwd = current working directory
        cwd: 'public',
        // if a name is already exist then it will not change it, it will merge it with the originally existing files 
        merge: true
    }))
    .pipe(gulp.dest('./public/assets'));
    done();
});

gulp.task('js', function(done){
    console.log('minifying js...');
    gulp.src('./assets/**/*.js')
    .pipe(uglify())
    .pipe(rev())
    .pipe(gulp.dest('./public/assets'))
    .pipe(rev.manifest({
        cwd: 'public',
        merge: true
    }))
    .pipe(gulp.dest('./public/assets'));
    done();
});

gulp.task('images', function(done){
    console.log('minifying images...');
    gulp.src('./assets/**/*.+(png|jpg|gif|svg|jpeg)')
    .pipe(imagemin())
    .pipe(rev())
    .pipe(gulp.dest('./public/assets'))
    .pipe(rev.manifest({
        cwd: 'public',
        merge: true
    }))
    .pipe(gulp.dest('./public/assets'));
    done();
});


// empty the public/assets directory
gulp.task('clear:assets', function(done){
    del.sync('./public/assets');
    done();
});

// with the help of this function we can run the above 4 tasks after that a callback done will be called
gulp.task('build', gulp.series('clear:assets', 'css', 'js', 'images'), function(done){
    console.log('Building assets');
    done();
})