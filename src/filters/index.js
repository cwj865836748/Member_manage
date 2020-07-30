// import parseTime, formatTime and set to filter
export {parseTime, formatTime} from '@/utils'
import {
  userStatus,
  booleanType,
  appVersionType,
  ruleType,
} from '@/config/base'

/**
 * Show plural label if time is plural number
 * @param {number} time
 * @param {string} label
 * @return {string}
 */
function pluralize(time, label) {
  if (time === 1) {
    return time + label
  }
  return time + label + 's'
}

/**
 * @param {number} time
 */
export function timeAgo(time) {
  const between = Date.now() / 1000 - Number(time)
  if (between < 3600) {
    return pluralize(~~(between / 60), ' minute')
  } else if (between < 86400) {
    return pluralize(~~(between / 3600), ' hour')
  } else {
    return pluralize(~~(between / 86400), ' day')
  }
}

/**
 * Number formatting
 * like 10000 => 10k
 * @param {number} num
 * @param {number} digits
 */
export function numberFormatter(num, digits) {
  const si = [
    {value: 1E18, symbol: 'E'},
    {value: 1E15, symbol: 'P'},
    {value: 1E12, symbol: 'T'},
    {value: 1E9, symbol: 'G'},
    {value: 1E6, symbol: 'M'},
    {value: 1E3, symbol: 'k'}
  ]
  for (let i = 0; i < si.length; i++) {
    if (num >= si[i].value) {
      return (num / si[i].value).toFixed(digits).replace(/\.0+$|(\.[0-9]*[1-9])0+$/, '$1') + si[i].symbol
    }
  }
  return num.toString()
}

/**
 * 10000 => "10,000"
 * @param {number} num
 */
export function toThousandFilter(num, digits) {
  return (+num || 0).toFixed(digits || 2).toString().replace(/^-?\d+/g, m => m.replace(/(?=(?!\b)(\d{3})+$)/g, ','))
}

/**
 * Upper case first char
 * @param {String} string
 */
export function uppercaseFirst(string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

export function ruleTypeFilter(type, val) {
  return ruleType.filter(t => t.value === type)[0][val || 'type']
}

export function userStatusFilter(type, val) {
  return userStatus.filter(t => t.value === type)[0][val || 'type']
}

export function booleanTypeFilter(type, val) {
  return booleanType.filter(t => t.value === type)[0][val || 'type']
}

export function appVersionTypeFilter(type, val) {
  return appVersionType.filter(t => t.value === type)[0][val || 'type']
}

export function isEnabled(val) {
  return val===1?'启用':'禁用'
}
export function isTaskEnabled(val) {
  return val===0?'启用':'禁用'
}
export function sex(val) {
  return val===1?'男':'女'
}
export function certificateType(val) {
  return val===1?'身份证':'其他'
}
export function msgStatusType(val) {
  return val===1?'已发送':'未发送'
}
export function redemptionType(val) {
  return val===0?'未领取':(val===1?'已领取':'已过期')
}
export function msgType(val){
  return val===0?'活动通知':(val===1?'公告通知':'系统通知')
}
export function shelfType(val){
  return val===1?'已上架':'未上架'
}
export function logType(val){
  return val===1?'操作日志':'登录日志'
}
export function articleType(val){
  return val===1?'已发布':'未发布'
}
export function activeType(val){
  switch (val) {
    case 1:
      return '待发布'
    case 2:
      return '已发布'
    case 3:
      return '已开启'
    case 4:
      return '已结束'
  }
}

export function safeColor(val){
  if(val==='#19C919'){
    return '绿色'
  }else if(val==='#ED4014'){
    return '红色'
  }else if(val==='#F9E31C'){
    return '黄色'
  }else {
    return '灰色'
  }
}
