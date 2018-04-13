define(function() {
  function init() {
    console.log('inner init1');
  }

  return {
    init: init,
  };
});
