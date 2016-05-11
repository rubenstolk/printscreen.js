'use strict';

const os = require('os');
const phantom = require('node-phantom-simple');
const path = require('phantomjs-prebuilt').path;
const captureDimensions = require('./capture-dimensions');
const generate = require('./generate');

module.exports = (url, opts, cb) => {
  opts = opts || {};


  opts.page = opts.page || {};
  opts.page.viewportSize = opts.page.viewportSize || opts.viewport || { width: 1024, height: 768 };

  if (opts.page.settings) {
    if (opts.capture) {
      delete opts.page.settings.javascriptEnabled;
    }

    for (let key of Object.keys(opts.page.settings)) {
      opts.page[`settings.${key}`] = opts.page.settings[key];
    }

    delete opts.page.settings;
  }

  opts.timeout = typeof opts.timeout === 'undefined' ? 5000 : Number(opts.timeout);
  opts.format = opts.format || 'png';
  opts.quality = typeof opts.quality === 'undefined' ? 75 : Number(opts.quality);
  opts.capture = opts.capture || function () {};

  let result = { file: `${os.tmpdir()}/${Number(new Date())}.png` };

  return new generate(this, cb, function * (next) {
    let browser = yield phantom.create({ path }, next);
    let page = yield browser.createPage(next);

    for (let op of Object.keys(opts.page)) {
      yield page.set(op, opts.page[op], next);
    }

    yield page.open(url, next);
    yield setTimeout(next, opts.timeout);

    result.dimensions = yield page.evaluate(captureDimensions, next);
    result.output = yield page.evaluate(opts.capture, next);

    page.render(result.file, opts);

    yield setTimeout(next, 1000);

    browser.exit();

    return cb(null, result);
  }, cb);
};
