define(['store'], function(store){
  var actions = {
    getReportList: function (cb) {
      // 获取研报列表信息
      $.ajax({
        url: '//mock.cuidmm.cn/mock/5a657603213a456a057bfd43/complex/model',
        type: 'GET',
        dataType: 'json',
        success: function (data) {
          store.reportList = data.data || [];
          if(cb) cb();
        },
        error: function (err) {
          console.warn(err);
        },
      })
    },
  }

  return actions
})
