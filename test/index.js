'use strict';

const test = require('tape');
const printscreen = require('../lib');

test('Should grab from Google', test => {
  test.plan(2);

  printscreen('http://google.com', {

    viewport: {
      width: 1650,
      height: 1060
    },

    timeout: 1000,

    capture: function () {

      var divs = document.querySelectorAll('div').length;

      return {
        divs: divs
      };
    }
  }, (err, data) => {

    test.ok(data.output.divs > 10, 'Google.com has at least 10 divs');
    require('fs').stat(data.file, (err, stats) =>
      test.ok(stats.size > 1000, 'Screenshot has at least 1000 bytes'));

  });
});
