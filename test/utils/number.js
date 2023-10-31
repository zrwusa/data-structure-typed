'use strict';
Object.defineProperty(exports, '__esModule', {value: true});
exports.getMSB = exports.getRandomInt = void 0;
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
exports.getRandomInt = getRandomInt;
var getMSB = function (value) {
  if (value <= 0) {
    return 0;
  }
  return 1 << (31 - Math.clz32(value));
};
exports.getMSB = getMSB;
