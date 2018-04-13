define(function() {
  function init() {
    console.log('inner init');
  }

  return {
    init: init,
  };
});
