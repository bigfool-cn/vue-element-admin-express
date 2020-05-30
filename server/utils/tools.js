'use strict'

/**
 * 获取树形结构数据
 * @param data 数据
 * @param level 节点
 * @param idFeild 字段名
 * @param pidFeild 上一级字段名
 * @returns {null|[]}
 */
const getTreeData = function(data, level = null, idFeild = 'id', pidFeild = 'parent_id') {
  const tree = []
  const _level = []
  if (level === null) {
    data.forEach(function(item) {
      _level.push(item[pidFeild])
    })
    level = Math.min(..._level)
  }
  data.forEach(function(item) {
    if (item[pidFeild] === level) {
      tree.push(item)
    }
  })
  if (tree.length === 0) {
    return null
  }

  // 对于父节点为0的进行循环，然后查出父节点为上面结果id的节点内容
  tree.forEach(function(item) {
    const childData = getTreeData(data, item[idFeild], idFeild, pidFeild)
    if (childData != null) {
      item['children'] = childData
    }
  })
  return tree
}

/**
 * 获取两个数组交集
 * @param arr1
 * @param arr2
 * @returns {*[]}
 */
const intersectArr = function(arr1 = [], arr2 = []) {
  return arr1.filter(function(v) { return arr2.indexOf(v) > -1 })
}

/**
 * 获取两个数组差集
 * @param arr1
 * @param arr2
 * @returns {*[]}
 */
const minustArr = function(arr1 = [], arr2 = []) {
  return arr1.filter(function(v) { return arr2.indexOf(v) === -1 })
}

module.exports = {
  getTreeData: getTreeData,
  intersectArr: intersectArr,
  minustArr: minustArr
}
