"use Strict";

/**
 *  中文字典
 *
 *  @type {Object}
 */
const Dictionary = {
  digits: ["零", "一", "二", "三", "四", "五", "六", "七", "八", "九"],
  units: ["十", "百", "千"],
  quots: [
    "万",
    "亿",
    "兆",
    "京",
    "垓",
    "秭",
    "穰",
    "沟",
    "涧",
    "正",
    "载",
    "极",
    "恒河沙",
    "阿僧祗",
    "那由他",
    "不可思议",
    "无量",
    "大数"
  ]
};

/**
 *  将函数绑定到对象上
 *
 *  @param  {*} obj 调用函数的对象
 *  @param  {function} func 被对象调用的函数
 *  @return {function}     绑定了对象的新函数
 */
const bindTo = obj => func => func.bind(obj);

/**
 *  组合函数
 *
 *  @param  {...[function]} funcs) 函数
 *  @return {[type]}           [description]
 */
const compose = (...funcs) => (...args) =>
  funcs.reduce((ret, func) => func(ret), args);

/**
 *  从右向左计算下标
 *
 *  @param  {number} length 总长度
 *  @param  {number} index  正序下标
 *  @return {number}        倒序下标
 */
const reverseIndex = length => index => length - index - 1;

/**
 *  将队列的下标转换为矩阵的行列坐标
 *
 *  @param  {number}     cols          矩阵的列数
 *  @param  {function}   indexChanger  坐标转换函数,决定矩阵如何排列
 *  @return {function} 根据下标技术含量坐标的函数
 */
const matrixer = (cols, indexChanger) => ([num, index]) => {
  const newIndex = indexChanger ? indexChanger(index) : index;
  return {
    num,
    index,
    row: Math.trunc(newIndex / cols),
    col: newIndex % cols
  };
};

/**
 *  根据字典翻译数字
 *
 *  @param  {array} options.digits 数字
 *  @param  {array} options.units  权位
 *  @param  {array} options.quots  节权位
 *  @return {function}    根据数字,下标,矩阵坐标翻译中文
 */
const translator = ({ digits, units, quots }) => ({ num, index, row, col }) => {
  const digit =
    num === "0" || (num === "1" && index === 0 && col === 1) ? "" : digits[num];
  const unit =
    col === 0 ? quots[row - 1] || "" : num === "0" ? "" : units[col - 1];
  return {
    num,
    text: digit + unit
  };
};

/**
 *  组装每个数字对应的中文
 *  连续出现多个0 只保留一个‘零’
 *  十百千都为`0` 则丢弃`text`
 *
 *  @param  {string} options.text 累加的中文
 *  @param  {bool}   options.zero 上一位是否为0
 *  @param  {number} options.num  当前的数字
 *  @param  {string} options.text 当前的中文
 *  @return {object}              text 中文结果
 */
const assembler = zeroChar => ({ total, zero }, { num, text }) => ({
  total: (num === "0" ? (zero ? text : text || zeroChar) : text) + total,
  zero: num === "0" ? zero || true : false
});

/**
 * 转换阿拉伯数字到中文
 *
 *  @param  {mixed} numbers 阿拉伯数字 可以是数字或字符串
 *  @return {string}        结果中文
 *
 *  @example
 *    console.log(numToChinese("10010010011"));  // 十亿零二百万零三百零四
 */
const numToChinese = numbers =>
  bindTo(numbers)(Array.prototype.map)(
    compose(matrixer(4, reverseIndex(numbers.length)), translator(Dictionary))
  )
    .reverse()
    .reduce(assembler(Dictionary["digits"][0]), { total: "", zero: true })
    .total;

export default numToChinese;
