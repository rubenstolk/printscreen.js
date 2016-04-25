'use strict';

const os = require('os');
const phantom = require('node-phantom-simple');
const path = require('phantomjs-prebuilt').path;

module.exports = (url, options, cb) => {
  options = options || {};

  options.capture = options.capture || function () {};
  options.viewport = options.viewport || { width: 1024, height: 768 };
  options.timeout = typeof options.timeout === 'undefined' ? 5000 : Number(options.timeout);
  options.format = options.format || 'png';
  options.quality = typeof options.quality === 'undefined' ? 75 : Number(options.quality);

  const file = os.tmpdir().concat('/', Number(new Date()), '.png');

  phantom.create({ path }, (err, browser) => {
    if (err) {
      return cb(err);
    }

    browser.createPage((err, page) => {
      if (err) {
        return cb(err);
      }

      page.set('viewportSize', options.viewport, () => page.open(url, () => setTimeout(() => {
        page.evaluate(function () {
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
        }, (err, dimensions) => {
          page.render(file, options);

          // Capture stuff inside the page
          page.evaluate(options.capture, (err, output) => {
            browser.exit();
            return cb(err, {
              file: file,
              dimensions: dimensions,
              output: output
            });
          });
        });
      }, options.timeout)));
    });
  });
};
