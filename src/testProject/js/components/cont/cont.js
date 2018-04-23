define(['getters', 'actions', 'store'], function (getters, actions, store) {
  var cont = {
    init: function () {
      var _this = this;
      // 初始化
      this.bindEvent();
      // 获取列表数据
      this.getData.list(function cb() {
        _this.render.list(getters.getReportList());
      })
    },
    getData: {
      list: function (cb) {
        actions.getReportList(function () {
          if(cb) cb();
        })
      },
    },
    render: {
      list: function (list) {
        // 渲染列表
        var html = template('contTemplate', {
          list: list,
        });
        document.getElementById('contWrap').innerHTML = html;
      },
    },
    bindEvent: function () {
      // 绑定事件
      $('.app-wrap').on('click', '.listItem', function () {
        console.log($(this).index());
      })
    },
  }

  return cont
})
