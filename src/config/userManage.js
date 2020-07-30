import i18n from '@/lang'

export const RETURN_CODE = {
  SUCCESS: 200,
  TOKEN_FAIL: 401,
  NO_DATA: 202,
  ERROR: 404,
  FAIL: 500
}

// 设置类型
export const roleType = [
  {label: '理事', value: 1, type: ''},
  {label: '房东', value: 2, type: ''},
  {label: '二房东', value: 3, type: ''},
  {label: '业主', value: 4, type: ''},
  {label: '户主', value: 5, type: ''},
  {label: '租户', value: 6, type: ''},

]
// 设置类型
export const statusType = [
  {label: '禁用', value: 0, type: ''},
  {label: '启用', value: 1, type: ''}
]
// 消息状态
export const msgStatusType = [
  {label: '未发送', value: 0, type: ''},
  {label: '已发送', value: 1, type: ''}
]

export const sexType = [
  {label: '男', value: 1, type: ''},
  {label: '女', value: 2, type: ''}
]

export const cardType = [
  {label: '身份证', value: 1, type: ''},
  {label: '其他', value: 2, type: ''}
]
export const msgType = [
  {label: '活动通知', value: 0, type: ''},
  {label: '公告通知', value: 1, type: ''},
  {label: '系统通知', value: 2, type: ''}
]
export const redemptionType = [
  {label: '未领取', value: 0, type: ''},
  {label: '已领取', value: 1, type: ''},
  {label: '已过期', value: 2, type: ''}
]
export const activeType = [
  {label: '待发布', value: 1, type: ''},
  {label: '已发布', value: 2, type: ''},
  {label: '已开启', value: 3, type: ''},
  {label: '已结束', value: 4, type: ''}
]
export const shelfType = [
  {label: '未上架', value: 0, type: ''},
  {label: '已上架', value: 1, type: ''}
]
export const logType = [
  {label: '操作日志', value: 1, type: ''},
  {label: '登录日志', value: 2, type: ''}
]



