define(['store'], function(store){
  var getters = {
    getReportList: function () {
      // 获取研报列表数据
      return store.reportList
    },
  }

  return getters
})
