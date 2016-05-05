'use strict';

module.exports = function () {
  var b = document.body || {};
  var d = document.documentElement || {};
  return {
    width: Math.max(
      b.offsetWidth, b.scrollWidth,
      d.clientWidth, d.scrollWidth, d.offsetWidth
    ),
    height: Math.max(b.offsetHeight, b.scrollHeight,
      d.clientHeight, d.scrollHeight, d.offsetHeight
    )
  };
};
