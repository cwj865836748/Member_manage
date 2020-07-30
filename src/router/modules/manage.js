/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'

const webUserManageRouter = {
  path: '/webUserManage',
  component: Layout,
  redirect: 'noRedirect',
  name: 'webUserManage',
  meta: {
    title: '前端用户管理',
    icon: 'agent'
  },
  children: [
    {
      path: 'webUserManage',
      component: () => import('@/views/webUserManage'),
      name: 'webUserManage',
      meta: { title: '前端用户管理' }
    }
  ]
}

const msgRouter = {
  path: '/msgManage',
  component: Layout,
  redirect: 'noRedirect',
  name: 'msgManage',
  meta: {
    title: '消息管理',
    icon: 'project'
  },
  children: [
    {
      path: 'msgManage',
      component: () => import('@/views/msgManage'),
      name: 'msgManage',
      meta: { title: '消息管理' }
    }
  ]
}

const articleRouter = {
  path: '/articleManage',
  component: Layout,
  redirect: 'noRedirect',
  name: 'articleManage',
  meta: {
    title: '文章管理',
    icon: 'clipboard'
  },
  children: [
    {
      path: 'articleManage',
      component: () => import('@/views/articleManage'),
      name: 'articleManage',
      meta: { title: '文章管理' }
    }
  ]
}

export default [webUserManageRouter,msgRouter,articleRouter]
