'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var isPlainObject = exports.isPlainObject = function isPlainObject(obj) {
  return 'isPrototypeOf' in obj && Object.prototype.toString.call(obj) === '[object Object]';
};