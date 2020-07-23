import request from '@/utils/request'

class houseList {
  /**s
   * @params
   * 房源列表
   */
  list(params) {
    return request({
      url: '/web/gridFloor/list',
      method: 'get',
      params
    })
  }
  findFloorRoomList(params) {
    return request({
      url: '/web/gridFloor/findFloorRoomList',
      method: 'get',
      params
    })
  }
  findFloorDetail(params) {
    return request({
      url: '/web/gridFloor/findFloorDetail',
      method: 'get',
      params
    })
  }
  getTenantDetailList(params){
    return request({
      url: '/web/gridFloor/getTenantDetailList',
      method: 'get',
      params
    })
  }
  getLandlordDetailList(params){
    return request({
      url: '/web/gridFloor/getLandlordDetailList',
      method: 'get',
      params
    })
  }
  addLandlordInfo(data) {
    return request({
      url: '/web/gridFloor/addLandlordInfo',
      method: 'post',
      data
    })
  }
  addFamiliesInfo(data) {
    return request({
      url: '/web/gridFloor/addFamiliesInfo',
      method: 'post',
      data
    })
  }

}

export const houseListApi = new houseList()