'use strict';

const os = require('os');
const phantom = require('node-phantom-simple');
const path = require('phantomjs-prebuilt').path;

module.exports = (url, options, cb) => {
  const file = os.tmpdir().concat('/', Number(new Date()), '.png');

  options.capture = options.capture || function () {};
  options.viewport = options.viewport || { width: 1024, height: 768 };
  options.timeout = typeof options.timeout === 'undefined' ? 5000 : Number(options.timeout);

  phantom.create({ path }, (err, browser) => {
    if (err) {
      return cb(err);
    }

    browser.createPage((err, page) => {
      if (err) {
        return cb(err);
      }

      page.set('viewportSize', options.viewport, () => page.open(url, () => setTimeout(() => {

        // Save the screenshot
        page.render(file);

        // Capture stuff inside the page
        page.evaluate(options.capture, (err, output) => {
          browser.exit();
          return cb(err, { file: file, output: output });
        });
      }, options.timeout)));
    });
  });
};
