// 插件依赖
const path = require('path');
const del = require('del');
const gulp = require('gulp');
const plumber = require('gulp-plumber'); //gulp运行出错时不退出进程
const sourcemaps = require('gulp-sourcemaps'); //生成sourcemap文件
const less = require('gulp-less'); //编译less
const debug = require('gulp-debug'); //To see what files are run through your Gulp pipeline
const fileInclude = require('gulp-file-include'); //合并html
const jshint = require('gulp-jshint'); //校验js
const requirejsOptimize = require('gulp-requirejs-optimize'); //编译合并requirejs
const browserSync = require('browser-sync').create(); //本地服务
const watch = require('gulp-watch'); //监听文件改动

/**
 * 相关配置
 * filePath 为文件匹配路径
 * projectsConf 为项目匹配路径
 */
const filePath = require('../conf/path.conf');
const projectsConf = require('../conf/project.conf');

/**
 * 相关路径
 * ROOT_PATH 为根路径
 * SRC_PATH 为开发路径
 * DEV_PATH 为开发环境下实时编译路径
 * DIST_PATH 为生产环境下编译生成路径
 */
const ROOT_PATH = path.join(__dirname).slice(0, -5);
const SRC_PATH = ROOT_PATH + '/src/';
const DEV_PATH = ROOT_PATH + '/dev/';
const DIST_PATH = ROOT_PATH + '/dist/';

// 开发环境less编译
gulp.task('devLess', function() {
  projectsConf.projects.map(item => {
    let devPath = SRC_PATH + item + filePath.less;
    let distPath = DEV_PATH + item + '/css';
    gulp
      .src(devPath)
      .pipe(plumber())
      .pipe(sourcemaps.init())
      .pipe(debug({ title: '编译' }))
      .pipe(less())
      .pipe(sourcemaps.write())
      .pipe(gulp.dest(distPath));
  });
});

// 开发环境html合并
gulp.task('devHtml', function() {
  projectsConf.projects.map(item => {
    let devPath = SRC_PATH + item + filePath.html;
    let distPath = DEV_PATH + item;
    gulp
      .src(devPath)
      .pipe(plumber())
      .pipe(sourcemaps.init())
      .pipe(debug({ title: '编译' }))
      .pipe(
        fileInclude({
          prefix: '@@',
          basepath: '@file',
        })
      )
      .pipe(sourcemaps.write())
      .pipe(gulp.dest(distPath));
  });
});

// 开发环境js合并
gulp.task('devJs', function() {
  projectsConf.projects.map(item => {
    let devPath = SRC_PATH + item + filePath.js;
    let distPath = DEV_PATH + item + '/js';
    let requirePath = require(SRC_PATH + item + '/js/require.config.js');
    gulp
      .src(devPath)
      .pipe(plumber())
      .pipe(sourcemaps.init())
      .pipe(debug({ title: '编译' }))
      .pipe(requirejsOptimize(requirePath))
      .pipe(sourcemaps.write())
      .pipe(gulp.dest(distPath));
  });
});

// 开发环境img处理
gulp.task('devImg', function() {
  projectsConf.projects.map(item => {
    let devPath = SRC_PATH + item + filePath.img;
    let distPath = DEV_PATH + item + '/images';
    gulp
      .src(devPath)
      .pipe(plumber())
      .pipe(debug({ title: '编译' }))
      .pipe(gulp.dest(distPath));
  });
});

// 开发环境清理dev文件夹并构建
gulp.task('devBuild', function() {
  del(DEV_PATH).then(() => {
    gulp.start('devLess');
    gulp.start('devHtml');
    gulp.start('devJs');
    gulp.start('devImg');
  });
});

// 重加载require.config.js
gulp.task('auto-reload', function () {
  watch(SRC_PATH + '**/require.config.js', function () {
    console.log('|--------------------|');
    console.log('|  require 文件修改  |');
    console.log('|   server 重启中    |');
    console.log('|--------------------|');
    process.exit();
  })
})

// 开发环境监听
gulp.task('devWatch', function() {
  // 监听html文件改动
  watch(SRC_PATH + '**/*.html', function() {
    gulp.start('devHtml');
  });
  // 监听less文件改动
  watch(SRC_PATH + '**/*.less', function() {
    gulp.start('devLess');
  });
  // 监听js文件改动
  watch(SRC_PATH + '**/*.js', function() {
    gulp.start('lint');
    gulp.start('devJs');
  });
  // 监听img文件改动
  watch(SRC_PATH + '**/*.+(jpeg|jpg|png|gif)', function() {
    gulp.start('devImg');
  });
  browserSync.reload();
});

// 开发环境本地服务
gulp.task('dev', ['lint', 'devBuild', 'devWatch', 'auto-reload'], function() {
  browserSync.init({
    // open: 'ui',
    open: false,
    browser: ['chrome'],
    files: ['./dev/**'],
    server: {
      baseDir: './dev',
    },
    notify: false,
    reloadDebounce: 200,
  });
});
