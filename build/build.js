// 插件依赖
var path = require('path');
var del = require('del');
var gulp = require('gulp');
var plumber = require('gulp-plumber'); //gulp运行出错时不退出进程
var sourcemaps = require('gulp-sourcemaps'); //生成sourcemap文件
var less = require('gulp-less'); //编译less
var debug = require('gulp-debug'); //To see what files are run through your Gulp pipeline
var fileInclude = require('gulp-file-include'); //合并html
var jshint = require('gulp-jshint'); //校验js
var requirejsOptimize = require('gulp-requirejs-optimize'); //编译合并requirejs
var htmlreplace = require('gulp-html-replace'); // 修改html内容
var rename = require('gulp-rename'); //重命名文件
var cssMinify = require('gulp-clean-css'); //压缩css
var rev = require('gulp-rev'); //对文件名加MD5后缀
var revCollector = require('gulp-rev-collector'); //路径替换

// 配置依赖
var filePath = require('../conf/path.conf');
var projectsConf = require('../conf/project.conf');

// 路径
var ROOT_PATH = path.join(__dirname).slice(0, -5); //项目根路径
var SRC_PATH = ROOT_PATH + '/src/'; //开发路径
var DEV_PATH = ROOT_PATH + '/dev/'; //开发环境编译路径
var DIST_PATH = ROOT_PATH + '/dist/'; //生产环境编译路径
var REV_PATH = ROOT_PATH + '/rev'; //映射文件路径

// 生产环境less编译
gulp.task('proLess', function() {
  projectsConf.projects.map(item => {
    let devPath = SRC_PATH + item + filePath.less;
    let distPath = DIST_PATH + '/css';
    gulp
      .src(devPath)
      .pipe(debug({ title: '编译' }))
      .pipe(less())
      .pipe(rename(item + '.css'))
      .pipe(rev())
      .pipe(gulp.dest(distPath))
      .pipe(rev.manifest())
      .pipe(gulp.dest(REV_PATH + '/' + item));
  });
});

// 生产环境html合并
gulp.task('proHtml', function() {
  projectsConf.projects.map(item => {
    let devPath = SRC_PATH + item + filePath.html;
    let distPath = DIST_PATH;
    gulp
      .src([REV_PATH + '/' + item + '/*.json', devPath])
      .pipe(debug({ title: '编译' }))
      .pipe(
        fileInclude({
          prefix: '@@',
          basepath: '@file'
        })
      )
      .pipe(
        htmlreplace({
          css: filePath.public + '/css/' + item + '.css',
          js: {
            src: filePath.public + '/js/' + item + '.js',
            tpl: '<script src="//s.thsi.cn/cb?js/require.min.js" data-main="%s"></script>'
          }
        })
      )
      .pipe(rename(item + '.html'))
      .pipe(revCollector())
      .pipe(gulp.dest(distPath));
  });
});

// 生产环境js合并
gulp.task('proJs', function() {
  projectsConf.projects.map(item => {
    let devPath = SRC_PATH + item + filePath.js;
    let distPath = DIST_PATH + '/js';
    let requirePath = require(SRC_PATH + item + '/js/require.config.js');
    gulp
      .src(devPath)
      .pipe(debug({ title: '编译' }))
      .pipe(requirejsOptimize(requirePath))
      .pipe(rename(item + '.js'))
      .pipe(gulp.dest(distPath));
  });
});

// 生产环境img处理
gulp.task('proImg', function() {
  projectsConf.projects.map(item => {
    let devPath = SRC_PATH + item + filePath.img;
    let distPath = DIST_PATH + '/images';
    gulp
      .src(devPath)
      .pipe(debug({ title: '编译' }))
      .pipe(gulp.dest(distPath));
  });
});

// 生产环境清理dev文件夹并构建
gulp.task('build', function() {
  del(DIST_PATH).then(() => {
    gulp.start('proLess');
    gulp.start('proHtml');
    gulp.start('proJs');
    gulp.start('proImg');
  });
});
