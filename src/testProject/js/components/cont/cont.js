define(['getters', 'actions', 'store'], function (getters, actions, store) {
  var cont = {
    init: function () {
      var that = this;
      // 初始化
      this.bindEvent();
      // 获取数据
      actions.getReportList(function cb() {
        that.render.list(getters.getReportList());
      })
    },
    render: {
      list: function (list) {
        // 渲染列表
        var html = template('contWrapTemplate', {
          list: list,
        });
        document.getElementById('contWrap').innerHTML = html;
      },
    },
    bindEvent: function () {
      // 绑定事件
      $('body').on('click', function () {
        console.log(123);
      })
    },
  }

  return cont
})
