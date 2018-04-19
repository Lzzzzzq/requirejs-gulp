define(function(){
  var actions = {
    getReportList: function (cb) {
      // 获取研报列表信息
      $.ajax({
        url: '//mock.cuidmm.cn/project/5a657603213a456a057bfd43',
        type: 'GET',
        dataType: 'json',
        success: function (data) {
          if(cb) cb();
        },
        error: function (err) {
          console.log(err);
        },
      })
    },
  }

  return actions
})
