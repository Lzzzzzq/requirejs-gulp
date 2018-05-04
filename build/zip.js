// 插件依赖
const path = require('path');
const gulp = require('gulp');
const zip = require('gulp-zip');
const runSequence = require('run-sequence'); //异步处理
 
// 配置依赖
const filePath = require('../conf/path.conf');
const projectsConf = require('../conf/project.conf');

// 路径
const ROOT_PATH = path.join(__dirname).slice(0, -5); //项目根路径
const SRC_PATH = ROOT_PATH + '/src/'; //开发路径
const DEV_PATH = ROOT_PATH + '/dev/'; //开发环境编译路径
const DIST_PATH = ROOT_PATH + '/dist/'; //生产环境编译路径
const REV_PATH = ROOT_PATH + '/rev'; //映射文件路径
const PUBLIC_PATH = filePath.public;

gulp.task('zipjs', () =>
  gulp.src(DIST_PATH + 'js/*.js')
    .pipe(zip('js.zip'))
    .pipe(gulp.dest('dist/js'))
);

gulp.task('zipcss', () =>
  gulp.src(DIST_PATH + 'css/*.css')
    .pipe(zip('css.zip'))
    .pipe(gulp.dest('dist/css'))
);

gulp.task('zipimg', () =>
  gulp.src(DIST_PATH + filePath.img)
    .pipe(zip('img.zip'))
    .pipe(gulp.dest('dist/images'))
);

gulp.task('zip', () => {
  runSequence('zipjs', 'zipcss', 'zipimg');
})
