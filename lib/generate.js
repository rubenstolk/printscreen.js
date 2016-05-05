'use strict';

module.exports = function (generator) {
  this.generator = generator.bind(this)();

  this.next = function () {
    return this.generator.next();
  }.bind(this);

  this.next();
};
