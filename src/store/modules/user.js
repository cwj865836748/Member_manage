import {Common} from '@/api'
import {getToken, setToken, removeToken} from '@/utils/auth'
import router, {resetRouter,asyncRoutes} from '@/router'

const state = {
  token: getToken(),
  name: '',
  avatar: '',
  introduction: '',
  showBidPrice: false,
  roles: [],
  permissions: [],
  staffId: '',
  userInfo:{}
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_INTRODUCTION: (state, introduction) => {
    state.introduction = introduction
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  SET_PERMISSIONS: (state, permissions) => {
    state.permissions = permissions
  },
  SET_STAFFID: (state, staffId) => {
    state.staffId = staffId
  },
  SET_SHOW_BID_PRICE: (state, showBidPrice) => {
    state.showBidPrice = showBidPrice
  },
  SET_USERINFO: (state, userInfo) => {
    state.userInfo = userInfo
  },
}

const actions = {
  // user login
  login({commit}, userInfo) {
    const {username, password,captcha} = userInfo
    return new Promise((resolve, reject) => {
      Common.logIn({username: username.trim(), password,captcha}).then(response => {
        const {result} = response
        commit('SET_TOKEN', result.token)
        commit('SET_USERINFO', result.userInfo)
        setToken(result.token)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get Roles
  getMenu({commit}) {
    return new Promise(resolve => {
      // let accessedRoutes = addDynamicRoutes(roles)
      //添加上错误域名
      // accessedRoutes.push({path: '*', redirect: '/404', hidden: true})
      const accessedRoutes = asyncRoutes
      commit('SET_ROLES', accessedRoutes)
      resolve(accessedRoutes)
    })
  },

  // user logout
  logout({commit, state, dispatch}) {
    return new Promise((resolve, reject) => {
      Common.logout().then(() => {
        commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        commit('SET_PERMISSIONS', [])
        resetRouter()
        dispatch('tagsView/delAllViews', null, {root: true})
        resolve()
      }).catch(error => {
        reject(error)
      })

    })
  },

  // remove token
  resetToken({commit}) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      removeToken()
      resolve()
    })
  },

  // dynamically modify permissions
  changeRoles({commit, dispatch}, role) {
    return new Promise(async resolve => {
      const token = role + '-token'

      commit('SET_TOKEN', token)
      setToken(token)

      const {roles} = await dispatch('getInfo')

      resetRouter()

      // generate accessible routes map based on roles
      const accessRoutes = await dispatch('permission/generateRoutes', roles, {root: true})

      // dynamically add accessible routes
      router.addRoutes(accessRoutes)

      // reset visited views and cached views
      dispatch('tagsView/delAllViews', null, {root: true})

      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
