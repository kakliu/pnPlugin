// Include gulp
var gulp = require('gulp');
var livereload = require('gulp-livereload');
var webserver = require('gulp-webserver');
var concat = require('gulp-concat');

gulp.task('concat', function () {
    gulp.src(['jQuery.js','require.js'])
        .pipe(concat('all.js'))//合并后的文件名
        .pipe(gulp.dest('dist'));
});

gulp.task('webserver', function() {
    gulp.src('./') // 服务器目录（./代表根目录）
        .pipe(webserver({ // 运行gulp-webserver
            livereload: true, // 启用LiveReload
            open: true // 服务器启动时自动打开网页
        }));
});

// Default Task
gulp.task('default', ['webserver']);
