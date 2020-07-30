import request from '@/utils/request'

// 公共类
class CommonModel {
  /**
   * 上传文件
   * @param data
   */
  uploadFile(data) {
    return request({
      url: '/web/uploadImg/image',
      method: 'post',
      data,
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      isLoading: true
    })
  }
  /**
   * 顶部统计
   * @param data
   */
  statistics() {
    return request({
      url: '/web/statistics/miscellaneousStatistics',
      method: 'get'
    })
  }

  personStatisticsResult() {
    return request({
      url: '/web/statistics/personStatisticsResult',
      method: 'get'
    })
  }
  floorSecurityStatistics(){
    return request({
      url: '/web/statistics/floorSecurityStatistics',
      method: 'get'
    })
  }
  convertLogStatistics(params){
    return request({
      url: '/web/statistics/convertLogStatistics',
      method: 'get',
      params
    })
  }

  /**
   * 登录
   * @param data
   */
  logIn(data) {
    return request({
      url: '/web/sys/login',
      method: 'post',
      data
    })
  }
  /**
   * 退出登录
   * @param data
   */
  logout() {
    return request({
      url: '/web/sys/logout',
      method: 'get'
    })
  }
  /**
   * 获取动态验证码
   * @param data
   */
  getCode(params) {
    return request({
      url: '/web/sys/code',
      method: 'get',
      params
    })
  }
  getCaptcha() {
    return request({
      url: '/web/sys/createImg',
      method: 'get'
    })
  }
  /**
   * 修改密码
   * @param data
   */
  editPassword(params) {
    return request({
      url: '/web/user/editPassword',
      method: 'get',
      params
    })
  }
  /**
   * 扫描身份
   * @param data
   */
  authCard(data) {
    return request({
      url: '/web/identity/authCard',
      method: 'post',
      data,
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      isLoading: true
    })
  }
}


export const Common = new CommonModel()
