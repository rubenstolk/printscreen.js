'use strict';

module.exports = function (context, done, generator) {
  if (!(this instanceof module.exports)) {
    return new module.exports(context, done, generator);
  }

  done = done || ((err) => err && $.logging.error(err));

  const next = function (err, result) {
    if (err) {
      return this.done(err);
    }

    return this.generator.next(result);
  }.bind(this);

  this.generator = generator.bind(context || {})(next, done);

  next();
};
