import request from '@/utils/request'

class record {
  /**s
   * @params
   * 兑奖记录
   */
  redempitonList(params) {
    return request({
      url: '/web/convertLog/list',
      method: 'get',
      params
    })
  }
  convertAction(data) {
    return request({
      url: '/web/convertLog/convertAction',
      method: 'post',
      data
    })
  }

  /**s
   * @params
   * 积分记录
   */
  integralList(params) {
    return request({
      url: '/web/integralLog/list',
      method: 'get',
      params
    })
  }

  /**
   * 活动管理
   */
  add(data){
    return request({
      url: '/web/activity/add',
      method: 'post',
      data
    })
  }
  addPrice(data){
    return request({
      url: '/web/activity/addPrice',
      method: 'post',
      data
    })
  }
  delete(params){
    return request({
      url: '/web/activity/delete',
      method: 'delete',
      params
    })
  }
  edit(data){
    return request({
      url: '/web/activity/edit',
      method: 'put',
      data
    })
  }
  queryActPrizeList(params) {
    return request({
      url: '/web/activity/queryActPrizeList',
      method: 'get',
      params

    })
  }
  editPrize(data) {
    return request({
      url: '/web/activity/editPrize',
      method: 'post',
      data

    })
  }
  findPrize(data){
      return request({
        url: '/web/activity/findPrize',
        method: 'post',
        data
      })
  }
  activityList(params){
    return request({
      url: '/web/activity/list',
      method: 'get',
      params
    })
  }
  queryById(params){
    return request({
      url: '/web/activity/queryById',
      method: 'get',
      params
    })
  }
  release(data){
    return request({
      url: '/web/activity/release',
      method: 'post',
      data
    })
  }
  withdraw(data){
    return request({
      url: '/web/activity/withdraw',
      method: 'post',
      data
    })
  }
}

export const recordApi = new record()
