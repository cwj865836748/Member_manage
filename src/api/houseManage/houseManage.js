import request from '@/utils/request'

class HouseManage {
  /**
   * @param token
   * 查询网格信息个人**/
  getGridInfo(params) {
    return request({
      url: '/web/grid/getGridInfo',
      method: 'get',
      params
    })
  }
  getGridFloorList(params) {
    return request({
      url: '/web/grid/getGridFloorList',
      method: 'get',
      params
    })
  }

  /**
   * 查询网格房源
   */
  findAllFloorList(params) {
    return request({
      url: '/web/grid/findAllFloorList',
      method: 'get',
      params
    })
  }

  /**
   * 删除房源信息
   * @param params
   */
  deleteGridFloor(id) {
    return request({
      url: `/web/grid/deleteGridFloor?gridFloorId=${id}`,
      method: 'delete'
    })
  }
  edit(data){
    return request({
      url: `/web/grid/edit`,
      method: 'put',
      data
    })
  }

  /**
   * 删除网格
   * @param data
   */
  delete(id) {
    return request({
      url: `/web/grid/delete?id=${id}`,
      method: 'delete'
    })
  }

  /**
   * 添加房源
   * @param data
   */
  addGridFloor(data) {
    return request({
      url: '/web/grid/addGridFloor',
      method: 'post',
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

  /**
   * 添加网格
   * @param data
   */
  add(data){
    return request({
      url: '/web/grid/add',
      method: 'post',
      data
    })
  }
  /**
   * 获取区域
   * @param data
   */
  queryAreaGrids() {
    return request({
      url: '/web/grid/queryAreaGrids',
      method: 'get'
    })
  }
  /**
   * 获取区域
   * @param data
   */
  getAreaList() {
    return request({
      url: '/web/area/getAreaList',
      method: 'get'
    })
  }
  /**
   * 获取所有角色
   * @param data
   */
  getAllRole(name){
    return request({
      url: `/web/personInfo/queryAllList?name=${name}`,
      method: 'get'
    })
  }
}

export const houseApi = new HouseManage()
