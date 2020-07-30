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
//
  add(data) {
    return request({
      url: `/web/menu/add`,
      method: 'post',
      data
    })
  }
  //
  edit(data) {
    return request({
      url: `/web/menu/edit`,
      method: 'put',
      data,
      transformRequest: function (data) {
        // 对 data 进行任意转换处理
        return JSON.stringify(data);
      },
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }
  //
  delete(id) {
    return request({
      url: `/web/menu/delete?id=${id}`,
      method: 'delete'
    })
  }
}

export const anotherApi = new another()
