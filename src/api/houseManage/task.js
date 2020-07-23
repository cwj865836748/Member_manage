import request from '@/utils/request'

class task {
  /**s
   * @params
   * 文章分页列表
   */
  list(params) {
    return request({
      url: '/web/quartzJob/list',
      method: 'get',
      params
    })
  }

  add(data) {
    return request({
      url: '/web/quartzJob/add',
      method: 'post',
      data
    })
  }

  edit(data) {
    return request({
      url: '/web/quartzJob/edit',
      method: 'put',
      data
    })
  }


  //删除
  delete(id) {
    return request({
      url: `/web/quartzJob/delete?id=${id}`,
      method: 'delete'
    })
  }

  //
  pause(params) {
    return request({
      url: `/web/quartzJob/pause`,
      method: 'get',
      params
    })
  }
  //
  resume(params) {
    return request({
      url: `/web/quartzJob/resume`,
      method: 'get',
      params
    })
  }

}

export const taskApi = new task()
