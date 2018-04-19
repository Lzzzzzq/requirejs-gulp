define(function () {
  var cont = {
    init: function () {
      // 初始化
      this.bindEvent();
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
