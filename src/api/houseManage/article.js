import request from '@/utils/request'

class article {
  /**s
   * @params
   * 文章分页列表
   */
  list(params) {
    return request({
      url: '/web/article/list',
      method: 'get',
      params
    })
  }
  add(data){
    return request({
      url: '/web/article/add',
      method: 'post',
      data
    })
  }
  edit(data){
    return request({
      url: '/web/article/edit',
      method: 'put',
      data
    })
  }
  queryById(id){
    return request({
      url: `/web/article/queryById?id=${id}`,
      method: 'get'
    })
  }
  //删除
  delete(id){
    return request({
      url: `/web/article/delete?id=${id}`,
      method: 'delete'
    })
  }
}

export const articleApi = new article()
