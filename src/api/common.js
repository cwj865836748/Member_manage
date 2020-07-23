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

  statistics(params) {
    return request({
      url: '/admin/index/statistics',
      method: 'get',
      params,
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
  getCaptcha() {
    return request({
      url: '/web/sys/createImg',
      method: 'get'
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
