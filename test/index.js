'use strict';

const test = require('tape');
const fs = require('fs');
const printscreen = require('../lib');

test('Should grab from Google', test => {
  test.plan(3);

  printscreen('http://google.com', {

    page: {
      viewportSize: {
        width: 1650,
        height: 1060
      }
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
    test.equals(data.dimensions.width, 1650, 'Width property matches');
    fs.stat(data.file, (err, stats) =>
      test.ok(stats && stats.size > 50000, 'Screenshot is at least 50000 bytes'));

  });
});

test('Low quality', test => {
  test.plan(1);

  printscreen('http://google.com', {
    timeout: 1000,
    format: 'jpeg',
    quality: 0
  }, (err, data) => {
    fs.stat(data.file, (err, stats) =>
      test.ok(stats && stats.size < 20000, 'Screenshot is maximum 20000 bytes'));

  });
});
