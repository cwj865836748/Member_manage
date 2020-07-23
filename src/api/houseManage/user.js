import request from '@/utils/request'

class user {
  /**s
   * @params
   *
   */
  list(params) {
    return request({
      url: '/web/user/list',
      method: 'get',
      params
    })
  }
  add(data){
    return request({
      url: '/web/user/add',
      method: 'post',
      data
    })
  }
  edit(data){
    return request({
      url: '/web/user/edit',
      method: 'put',
      data
    })
  }
  resetPassword(data){
    return request({
      url: `web/user/resetPassword`,
      method: 'post',
      data
    })
  }
  //删除
  delete(id){
    return request({
      url: `/web/user/delete?id=${id}`,
      method: 'delete'
    })
  }
  queryById(id){
    return request({
      url: `/web/user/queryById?id=${id}`,
      method: 'get'
    })
  }
}

export const userApi = new user()
