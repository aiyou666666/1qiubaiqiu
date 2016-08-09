//载入插件
var gulp = require('gulp'), 
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    minifycss = require('gulp-minify-css'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    rename = require('gulp-rename'),
    clean = require('gulp-clean'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    cache = require('gulp-cache'),
    livereload = require('gulp-livereload');
   spritesmith=require("gulp.spritesmith");
 
// 样式
gulp.task('css', function() { 
  return gulp.src('src/scss/*.scss')
    .pipe(sass({ style: 'expanded', }))
    .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
    .pipe(gulp.dest('release/css'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(minifycss())
    .pipe(gulp.dest('release/css'))
    .pipe(notify({ message: '样式压缩完成' }));
});
 
// 脚本
gulp.task('js', function() { 
  return gulp.src('src/js/**/*.js')
    /*.pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter('default'))*/
    .pipe(concat('main.js'))
    .pipe(gulp.dest('release/js'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(uglify())
    .pipe(gulp.dest('release/js'))
    .pipe(notify({ message: 'js压缩成功' }));
});
 
// 图片
gulp.task('img', function() { 
  return gulp.src('src/img/**/*')
    .pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
    .pipe(gulp.dest('release/img'))
    .pipe(notify({ message: '图片压缩成功' }));
});
 
// 清理
gulp.task('clean', function() { 
  return gulp.src(['release/css', 'release/js', 'release/js'], {read: false})
    .pipe(clean());
});

gulp.task('spriteIcon', function () {
    var spriteData = gulp.src('src/img/icon/*.png').pipe(spritesmith({
        imgName: 'icon.png',
        cssName: 'g_icon.css'
    }));
    spriteData.pipe(gulp.dest('src/img'));
    spriteData.pipe(gulp.dest('src/css'));
});

gulp.task("scss",function(){
	 return gulp.src('src/modules/**/*.scss')
    .pipe(sass({ style: 'expanded', }))
    .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
    .pipe(gulp.dest('src/modules/'))
    .pipe(notify({ message: '解析scss' }));
    
    
});
 
// 预设任务
gulp.task('bulid', ['clean'], function() { 
    gulp.start('css', 'js', 'img');
});
gulp.task("watchScss",function(){
 	 //看守.scss
 	 console.log("看守scss");
 	 gulp.watch("src/scss/*.scss",['scss']);
 	 gulp.watch("src/modules/**/*.scss",['scss']);
 });
 
// 看守
gulp.task('watch', function() {
 
  // 看守所有.scss档
  gulp.watch('src/styles/**/*.scss', ['css']);
  gulp.watch('src/modules/**/*.scss', ['css']);
 
  // 看守所有.js档
  gulp.watch('src/scripts/**/*.js', ['js']);
 
  // 看守所有图片档
  gulp.watch('src/images/**/*', ['img']);
 
  // 建立即时重整伺服器
  var server = livereload();
 
  // 看守所有位在 dist/  目录下的档案，一旦有更动，便进行重整
  gulp.watch(['release/**']).on('change', function(file) {
    server.changed(file.path);
  });
 
 
});
