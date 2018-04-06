/**
 *  @fileOverview Maybe 
 *
 */

function Maybe(value) {
  this.value = value;
}

Maybe.of = function(value) {
  return new Maybe(value);
};

Maybe.Just = function(value) {
  return Maybe.of(value);
};

Maybe.Nothing = function() {
  return Maybe.of(null);
};

Maybe.prototype.isNothing = function() {
  return this.value === null;
};

Maybe.prototype.map = function(f) {
  return this.isNothing() ? this : Maybe.of(f(this.value));
};

Maybe.prototype.toString = function() {
  return this.isNothing() ? 'Maybe.Nothing' : this.value;
};

Maybe.prototype.get = function() {
  return this.value;
};

Maybe.prototype.chain = function (f) {
  return this.isNothing() ? this : f(this.value);
};


export default Maybe;
