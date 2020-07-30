import request from '@/utils/request'

class webUser {
  exportXls(data){
    return request({
      url: '/web/personInfo/exportXls',
      method: 'post',
      data,
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      responseType:'arraybuffer',
      isLoading: true
    })
  }
  exportTemplate(){
    return request({
      url: '/web/personInfo/exportXls',
      method: 'get',
      responseType:'arraybuffer'
    })
  }
  exportXlsOut(){
    return request({
      url: '/web/personInfo/exportPersonList',
      method: 'get',
      responseType:'arraybuffer'
    })
  }
  /**s
   * @params
   * 前端人员分页列表
   */
  list(params) {
    return request({
      url: '/web/personInfo/list',
      method: 'get',
      params
    })
  }
  add(data){
    return request({
      url: '/web/personInfo/add',
      method: 'post',
      data
    })
  }
  edit(data){
    return request({
      url: '/web/personInfo/edit',
      method: 'put',
      data
    })
  }
  queryById(id){
    return request({
      url: `/web/personInfo/queryById?id=${id}`,
      method: 'get'
    })
  }
  //删除
  delete(id){
    return request({
      url: `/web/personInfo/delete?id=${id}`,
      method: 'delete'
    })
  }
}

export const webUserApi = new webUser()
