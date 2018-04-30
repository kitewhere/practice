/**
 *  @fileOverview numToChinese
 */

import Maybe from "./maybe";
import ChineseDict from './dict/Chinese';
import {isNumber, pairMap, reduce, join, reverse, map} from './lib';

/**
 *  从右向左计算下标
 *
 *  @param  {number} length 总长度
 *  @param  {number} index  正序下标
 *  @return {number}        倒序下标
 */
const reverseIndex = (length, index) => length - index - 1;


const matrixe = index => ({
  num, index, queue,
  row: Math.trunc(newIndex / cols),
  col: newIndex % cols,
});

/**
 *  将队列的下标转换为矩阵的行列坐标
 *
 *  @param  {number}     cols          矩阵的列数
 *  @param  {function}   indexChanger  坐标转换函数,决定矩阵如何排列
 *  @return {function} 根据下标技术含量坐标的函数
 */
const matrixer = (cols, indexChanger) => ([num, index, queue]) => 
  matrixe(indexChanger ? indexChanger(num.length, index) : index)

/**
 *  验证权位是否都是0
 *
 *  @param  {number} length 权位的个数
 *  @return {function}      验证函数如果成功返回 maybe.just, 否则返回 maybe.nothing
 */
const checkSection = length => ({ num, index, row, col, queue }) =>
  (
    num === "0" && col === 0 &&
    compose(
      slice((start = index - length + 1) < 0 ? 0 : start, index),
      some(x => x !== 0)
    )(queue)
  ) 
    ? Maybe.Just({ num, index, row, col }) 
    : Maybe.Nothing();

/**
 *  根据字典翻译数字
 *
 *  @param  {array} options.digits 数字
 *  @param  {array} options.units  权位
 *  @param  {array} options.quots  节权位
 *  @return {function}    根据数字,下标,矩阵坐标翻译中文
 */
const translator = ({ digits, units, quots }) => data =>
  data.map(({ num, index, row, col }) => {
    let piece =
      num === "0" || (num === "1" && index === 0 && col === 1)
        ? ""
        : digits[num];
    piece +=
      col === 0 ? quots[row - 1] || "" : num === "0" ? "" : units[col - 1];

    return { num, piece };
  });

/**
 *  组装每个数字对应的中文
 *  连续出现多个0 只保留一个‘零’
 *  十百千都为`0` 则丢弃`piece`
 *
 *  @param  {string} options.text  累加的中文
 *  @param  {bool}   options.zero  上一位是否为0
 *  @param  {number} options.num   当前的数字
 *  @param  {string} options.piece 当前的中文
 *  @return {object}              text 中文结果
 */
const assembler = zeroChar => ({ text, zero }, data) => {
  if (data.isNothing()) return { text, zero };

  const { num, piece } = data.get();
  return {
    text: (num === "0" ? (zero ? piece : piece || zeroChar) : piece) + text,
    zero: num === "0" ? true : false
  };
};

/**
 *  处理整数部分
 *
 *  @param  {string} dict   转换字典
 *  @return {string}        结果中文
 */
const handleInteger = dict => compose(
  map(compose(
    matrixer(4, reverseIndex),
    checkSection(4),
    translator(dict)
  )),
  reverse,
  reduce(assembler(dict.zero), { text: "", zero: true }),
  result => result.text || dict.zero
);

/**
 *  处理小数部分
 *
 *  @param  {number} numbers 小数部分的数字
 *  @return {string}         字符串
 */
const handleDecimal = dict => numbers => numbers === undefined
    ? ''
    : dict.point + map(numbers)(num => dict.digits[num]);

/**
 *  处理负号
 *
 *  @param  {bool} minus 是否是负号
 *  @return {string}       字符串
 */
const handleMinus = dict => isMinus => isMinus ? dict.minus : '';

/**
 *  把字符串解析为 符号 整数 小数 三个部分
 *
 *  @param  {string} numbers 数字字符串
 *  @return {array}       
 */
const parserNumbers = numbers => {
  const isMinus = numbers.indexOf('-') !== 0 
    ? false
    : +(numbers = numbers.slice(1)) || true

  const [integer, decimal] = numbers.split('.');

  return [ isMinus, integer, decimal ];
}

/**
  *  阿拉伯数字转中文 支持小数和负数
  *
  *  @param  {string} numbers 数字
  *  @param  {object} dict    转换字典
  *  @return {string}         中文数字
  */ 
const numToChinese = (numbers, dict=Dictionary) => compose(
  parserNumbers, 
  pairMap([ 
    handleMinus, 
    handleInteger, 
    handleDecimal 
  ])(dict), 
  join
)(numbers);


