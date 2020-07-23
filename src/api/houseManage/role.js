import request from '@/utils/request'

class role {
  /**s
   * @params
   * 文章分页列表
   */
  list(params) {
    return request({
      url: '/web/role/list',
      method: 'get',
      params
    })
  }

  add(data) {
    return request({
      url: '/web/role/add',
      method: 'post',
      data
    })
  }

  edit(data) {
    return request({
      url: '/web/role/edit',
      method: 'put',
      data
    })
  }

  allList() {
    return request({
      url: `/web/role/allList`,
      method: 'get'
    })
  }

  //删除
  delete(id) {
    return request({
      url: `/web/role/delete?id=${id}`,
      method: 'delete'
    })
  }

  //
  authorization(data) {
    return request({
      url: `/web/role/authorization`,
      method: 'post',
      data
    })
  }

  queryById(params) {
    return request({
      url: `/web/role/queryById`,
      method: 'get',
      params
    })
  }
}

export const roleApi = new role()
