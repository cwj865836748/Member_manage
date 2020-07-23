import request from '@/utils/request'

class msg {
  /**s
   * @params
   * 消息列表
   */
  list(params) {
    return request({
      url: '/web/message/list',
      method: 'get',
      params
    })
  }
  add(data){
    return request({
      url: '/web/message/add',
      method: 'post',
      data
    })
  }
  edit(data){
    return request({
      url: '/web/message/edit',
      method: 'put',
      data
    })
  }
  queryById(id){
    return request({
      url: `/web/message/queryById?id=${id}`,
      method: 'get'
    })
  }
  //删除
  delete(id){
    return request({
      url: `/web/message/delete?id=${id}`,
      method: 'delete'
    })
  }
  //发送信息
  sendMessage(data){
    return request({
      url: `/web/message/sendMessage`,
      method: 'post',
      data
    })
  }
}

export const msgApi = new msg()
