// 插件依赖
var path = require('path');
var gulp = require('gulp');
var plumber = require('gulp-plumber'); //gulp运行出错时不退出进程
var watch = require('gulp-watch'); //监听文件改动
var eslint = require('gulp-eslint'); // 校验js
var colors = require('colors'); // 控制台彩色文字

/**
 * 相关配置
 * filePath 为文件匹配路径
 * projectsConf 为项目匹配路径
 */
var filePath = require('../conf/path.conf');
var projectsConf = require('../conf/project.conf');

/**
 * 相关路径
 * ROOT_PATH 为根路径
 * SRC_PATH 为开发路径
 * DEV_PATH 为开发环境下实时编译路径
 * DIST_PATH 为生产环境下编译生成路径
 */
var ROOT_PATH = path.join(__dirname).slice(0, -5);
var SRC_PATH = ROOT_PATH + '/src/';
var DEV_PATH = ROOT_PATH + '/dev/';
var DIST_PATH = ROOT_PATH + '/dist/';

// eslint检查
gulp.task('lint', function() {
  projectsConf.projects.map(item => {
    let devPath = SRC_PATH + item + '/js/**/*.js';
    gulp
      .src(devPath)
      .pipe(eslint({ configFile: './.eslintrc' }))
      // .pipe(eslint.format())
      .pipe(
        eslint.result(function(result) {
          if (result.errorCount > 0) {
            console.log('Eslint Error!'.red);
            console.log(colors.red('Error path ：' + result.filePath));
            console.log(colors.red('Error count ：' + result.errorCount));
            for (let i = 0; i < result.messages.length; i++) {
              let msg = result.messages[i];
              console.log(colors.cyan('Index ：' + i));
              console.log(colors.magenta('Error message ：' + msg.message));
              console.log(colors.magenta('Error ruleId ：' + msg.ruleId));
              console.log(colors.magenta('Error line ：' + msg.line));
              console.log(colors.magenta('Error column ：' + msg.column));
            }
          }
        })
      );
  });
});