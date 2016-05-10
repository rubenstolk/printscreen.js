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

  let browser;
  let page;
  let result = { file: `${os.tmpdir()}/${Number(new Date())}.png` };

  return new generate(function * () {
    this.wrap = fn => (err, data) => !fn(data) && err ? cb(err) : this.next();

    yield phantom.create({ path }, this.wrap(data => browser = data));
    yield browser.createPage(this.wrap(data => page = data));

    for (let op of Object.keys(opts.page)) {
      yield page.set(op, opts.page[op], this.next);
    }

    yield page.open(url, this.next);
    yield setTimeout(this.next, opts.timeout);
    yield page.evaluate(captureDimensions, this.wrap(data => result.dimensions = data));
    yield page.evaluate(opts.capture, this.wrap(data => result.output = data));

    page.render(result.file, opts);

    yield setTimeout(this.next, 1000);

    browser.exit();

    return cb(null, result);
  }, cb);
};
