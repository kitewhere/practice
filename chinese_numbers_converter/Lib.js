/**
 *  将函数绑定到对象上
 *
 *  @param  {*} obj 调用函数的对象
 *  @param  {function} func 被对象调用的函数
 *  @return {function}     绑定了对象的新函数
 */
const bind = func => (...args) => obj => func.bind(obj, ...args);

const map = bind(Array.prototype.map)();
const reverse = bind(Array.prototype.reverse)();
const join = bind(Array.prototype.join)('');
const reduce = bind(Array.prototype.reduce);
const regTest = bind(RegExp.prototype.test);

/**
 *  判断是否合法数字
 *
 *  @param  {string} numbers 数字字符串
 *  @return {bool}         
 */
const isNumber = regTest(/^-?[0-9]+(\.[0-9]*)?$/);

/**
 *  配对处理 map 
 *
 *  @param  {function} funcs 处理函数
 *  @return {array}       结果
 */
const pairMap = funcs => arr => map(funcs)(i => func(arr[i]))

/**
 *  组合函数
 *
 *  @param  {...[function]} funcs) 函数
 *  @return {[type]}           [description]
 */
const compose = (...funcs) => (...args) => reduce((ret, func) => func(ret), args)(funcs);
