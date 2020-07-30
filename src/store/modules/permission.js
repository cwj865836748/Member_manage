import {asyncRoutes, constantRoutes} from '@/router'
import {roleApi} from '@/api'
import Layout from '@/layout'
import store from '../../store'
// 获取组件的方法
const _import = require('@/router/_import_' + process.env.NODE_ENV)

/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, roles) {
  const res = []

  routes.forEach(route => {
    const tmp = {...route}
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
  })

  return res
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function addDynamicRoutes(routes) {
  const res = []

  routes.forEach(route => {
    const tmp = {...route}
    const tempJson = {
      hidden: tmp.hidden,
      alwaysShow: tmp.alwaysShow,
      redirect: tmp.redirect,
      name: tmp.name,
      path: tmp.path,
      meta: {
        title: tmp.title,
        icon: tmp.icon,
        noCache: tmp.noCache,
        affix: tmp.affix,
        breadcrumb: tmp.breadcrumb,
        activeMenu: tmp.activeMenu
      }
    }
    if (tmp.title == 'unit' || tmp.title == 'agentCommission') tempJson.hidden = true

    if (tmp.component) {
      if (tmp.component == 'Layout') {
        tempJson.component = Layout
      } else {
        tempJson.component = _import(tmp.component)
      }
    }

    if (tmp.children && tmp.children.length > 0) {
      tempJson.children = addDynamicRoutes(tmp.children)
    }
    res.push(tempJson)
  })

  return res
}

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  }
}

const actions = {
  generateRoutes({commit}, roles) {
    return new Promise(resolve => {
      roleApi.getMenuTreeByRole({roleId:store.state.user.userInfo.role}).then(res=>{
        roleApi.queryById({id:store.state.user.userInfo.role}).then(re=>{
          if(re.result.isSystem){
            //添加上错误域名
            roles.forEach(role=>{
              role.hidden=false
              role.children&&role.children.forEach(roleCid=>{
                if (roleCid.meta.title.includes('房源详情')||roleCid.meta.title.includes('房源成员信息')||roleCid.meta.title.includes('奖品管理')){
                  roleCid.hidden=true
                }else {
                  roleCid.hidden=false
                }

              })
            })
            let accessedRoutes =roles
            commit('SET_ROUTES', accessedRoutes)
            resolve(accessedRoutes)
          }else {
            const arr =[]
            const {result} = res
            result.forEach(item=>{
              if(item.isOwn&&!item.menus.length){
                arr.push(item.name)
              }else if(item.menus.length){
                item.menus.forEach(menus=>{
                  menus.isOwn&&arr.push(menus.name)
                })
              }
            })
            roles.forEach(role=>{
              role.hidden=true
              role.children&&role.children.forEach(roleCid=>{
                roleCid.hidden=!arr.includes(roleCid.meta.title)
                if(!roleCid.hidden){
                  role.hidden=false
                }
              })
            })
            let accessedRoutes =roles
            //添加上错误域名
            commit('SET_ROUTES', accessedRoutes)
            resolve(accessedRoutes)
          }
        })

      })




    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
