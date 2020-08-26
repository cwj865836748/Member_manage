import request from '@/utils/request'

class dictionaryModel {
  /**
   * 获取字典列表
   */
  list(params) {
    return request({
      url: '/web/dict/list',
      method: 'get',
      params
    })
  }

  /**
   * 新增字典
   */
  add(params) {
    return request({
      url: '/web/dict/add',
      method: 'post',
      params
    })
  }

  /**
   * 删除字典
   */
  delete(params) {
    return request({
      url: '/web/dict/delete',
      method: 'delete',
      params
    })
  }

  /**
   * 编辑字典
   */
  edit(data) {
    return request({
      url: '/web/dict/edit',
      method: 'put',
      data
    })
  }
  /**
   * 获取字典项列表
   */
  listEntry(params) {
    return request({
      url: '/web/dictItem/list',
      method: 'get',
      params
    })
  }

  /**
   * 新增字典项
   */
  addEntry(params) {
    return request({
      url: '/web/dictItem/add',
      method: 'post',
      params
    })
  }

  /**
   * 删除字典项
   */
  deleteEntry(params) {
    return request({
      url: '/web/dictItem/delete',
      method: 'delete',
      params
    })
  }

  /**
   * 编辑字典项
   */
  editEntry(params) {
    return request({
      url: '/web/dictItem/edit',
      method: 'put',
      params
    })
  }
  getDictItem(params){
    return request({
      url: '/web/dict/getDictItem',
      method: 'get',
      params
    })
  }
}

export const dictionaryApi = new dictionaryModel()
