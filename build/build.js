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
var revReplace = require('gulp-rev-replace'); //路径替换
var base64 = require('gulp-base64'); //base64
var cache = require('gulp-cache'); //gulp缓存配置，增量编译图片
var imagemin = require('gulp-imagemin'); //压缩img
var pngquant = require('imagemin-pngquant'); //处理img
var runSequence = require('run-sequence'); //异步处理
var md5 = require('gulp-md5-plus'); //md5
var through = require('through2');
var fs = require('fs');

// 读取文件
function readFile (path) {
  return new Promise((resolve, reject) => {
    fs.readFile(path, function(err, data) {
      if (err) {
        reject({
          state: 0,
          msg: err
        });
      }
      resolve({
        state: 1,
        data: JSON.parse(data.toString())
      })
    });
  })
}

// 配置依赖
var filePath = require('../conf/path.conf');
var projectsConf = require('../conf/project.conf');

// 路径
var ROOT_PATH = path.join(__dirname).slice(0, -5); //项目根路径
var SRC_PATH = ROOT_PATH + '/src/'; //开发路径
var DEV_PATH = ROOT_PATH + '/dev/'; //开发环境编译路径
var DIST_PATH = ROOT_PATH + '/dist/'; //生产环境编译路径
var REV_PATH = ROOT_PATH + '/rev'; //映射文件路径
var PUBLIC_PATH = filePath.public;

// 生产环境less编译
gulp.task('proLess', function() {
  projectsConf.projects.map(item => {
    let devPath = SRC_PATH + item + filePath.less;
    let distPath = DIST_PATH + '/css';
    return gulp
      .src(devPath)
      .pipe(debug({ title: '编译' }))
      .pipe(less())
      .pipe(
        base64({
          maxImageSize: 80 * 1024, // bytes
          debug: true,
        })
      )
      .pipe(cssMinify())
      .pipe(rev())
      .pipe(
        through.obj(async function(file, enc, cb) {
          let contents = file.contents.toString();
          file.path = file.path.replace('index', item);
          this.push(file);
          cb();
        })
      )
      .pipe(gulp.dest(distPath))
      .pipe(
        rev.manifest({
          path: REV_PATH + '/' + item,
          merge: true,
        })
      )
      .pipe(gulp.dest('./'));
  });
});

// 生产环境js合并
gulp.task('proJs', function() {
  projectsConf.projects.map(item => {
    let devPath = SRC_PATH + item + filePath.js;
    let distPath = DIST_PATH + '/js';
    let requirePath = require(SRC_PATH + item + '/js/require.config.js');
    return gulp
      .src(devPath)
      .pipe(debug({ title: '编译' }))
      .pipe(requirejsOptimize(requirePath))
      .pipe(rev())
      .pipe(
        through.obj(async function(file, enc, cb) {
          let contents = file.contents.toString();
          file.path = file.path.replace('index', item);
          this.push(file);
          cb();
        })
      )
      .pipe(gulp.dest(distPath))
      .pipe(
        rev.manifest({
          path: REV_PATH + '/' + item,
          merge: true,
        })
      )
      .pipe(gulp.dest('./'));
  });
});

// 生产环境html合并
gulp.task('proHtml', function() {
  projectsConf.projects.map(item => {
    let devPath = SRC_PATH + item + filePath.html;
    let distPath = DIST_PATH;
    return (
      gulp
        .src(devPath)
        .pipe(debug({ title: '编译' }))
        .pipe(
          fileInclude({
            prefix: '@@',
            basepath: '@file',
          })
        )
        .pipe(rename(item + '.html'))
        .pipe(
          through.obj(async function(file, enc, cb) {
            if (file.isNull()) {
              this.push(file);
              return cb();
            }

            if (file.isStream()) {
              this.emit(
                'error',
                new gutil.PluginError(PLUGIN_NAME, 'Streaming not supported')
              );
              return cb();
            }

            let contents = file.contents.toString();

            try {
              let { data } = await readFile(REV_PATH + '/' + item);
              for(let item in data) {
                let reg = new RegExp('"(css|js)\/' + item + '"');
                if (contents.match(reg)) {
                  contents = contents.replace(reg, '"' + PUBLIC_PATH + '/' + data[item] + '"')
                }
              }
              file.contents = new Buffer(contents);
              this.push(file);
              cb();
            } catch (e) {
              console.log(e);
              this.push(file);
              cb();
            }
          })
        )
        .pipe(gulp.dest(distPath))
    );
  });
});

// 生产环境img处理
gulp.task('proImg', function() {
  projectsConf.projects.map(item => {
    let devPath = SRC_PATH + item + filePath.img;
    let distPath = DIST_PATH + '/images';
    return gulp
      .src(devPath)
      .pipe(debug({ title: '编译' }))
      .pipe(
        cache(
          imagemin({
            progressive: true,
            svgoPlugins: [{ removeViewBox: false }],
            use: [pngquant()],
          })
        )
      )
      .pipe(gulp.dest(distPath));
  });
});


// 生产环境清理dev文件夹并构建
gulp.task('build', function() {
  del([DIST_PATH, REV_PATH]).then(() => {
    runSequence('proLess', 'proImg');
  });
});
