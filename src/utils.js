export const isPlainObject = (obj) => {
  return 'isPrototypeOf' in obj && Object.prototype.toString.call(obj) === '[object Object]';
}  