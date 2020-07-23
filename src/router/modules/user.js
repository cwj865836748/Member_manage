/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'

const userRouter = {
  path: '/user',
  component: Layout,
  redirect: 'noRedirect',
  name: 'User',
  meta: {
    title: 'user',
    icon: 'lock'
  },
  children: [
    {
      path: 'user',
      component: () => import('@/views/user/user'),
      name: 'User',
      meta: { title: '后台用户管理' }
    },
    {
      path: 'role',
      component: () => import('@/views/user/role'),
      name: 'Role',
      meta: { title: '角色管理' }
    },
    {
      path: 'menu',
      component: () => import('@/views/user/menu'),
      name: 'Menu',
      meta: { title: '菜单管理' }
    },
    {
      path: 'area',
      component: () => import('@/views/user/area'),
      name: 'Area',
      meta: { title: '区域管理' }
    },
    {
      path: 'log',
      component: () => import('@/views/user/log'),
      name: 'Log',
      meta: { title: '操作日志' }
    },
    {
      path: 'dictionary',
      component: () => import('@/views/user/dictionary'),
      name: 'dictionary',
      meta: { title: '数据字典' }
    },
    {
      path: 'task',
      component: () => import('@/views/user/task'),
      name: 'Task',
      meta: { title: '定时任务' }
    }
  ]
}

export default userRouter
