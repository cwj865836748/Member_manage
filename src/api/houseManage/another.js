import request from '@/utils/request'

class another {
  /**s
   * @params
   * 操作日志列表
   */
  logList(params) {
    return request({
      url: '/web/log/list',
      method: 'get',
      params
    })
  }

  //
  menuList() {
    return request({
      url: `/web/menu/list`,
      method: 'get'
    })
  }
  //
  queryRoleMenu() {
    return request({
      url: `/web/menu/queryRoleMenu`,
      method: 'get'
    })
  }

}

export const anotherApi = new another()
