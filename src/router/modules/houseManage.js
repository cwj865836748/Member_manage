/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'

const houseManageRouter = {
  path: '/houseManage',
  component: Layout,
  redirect: 'noRedirect',
  name: 'houseManage',
  meta: {
    title: '房源管理',
    icon: 'lock'
  },
  children: [
    {
      path: 'gridding',
      component: () => import('@/views/houseManage/gridding'),
      name: 'gridding',
      meta: { title: '网格化' }
    },
    {
      path: 'houseList',
      component: () => import('@/views/houseManage/houseList'),
      name: 'houseList',
      meta: { title: '房源列表' }
    },
    {
      path: 'detail',
      component: () => import('@/views/houseManage/houseList/detail'),
      name: 'detail',
      hidden:true,
      meta: { title: '房源详情' }
    },
    {
      path: 'detailMsg',
      component: () => import('@/views/houseManage/houseList/detailMsg'),
      name: 'detailMsg',
      hidden:true,
      meta: { title: '房源成员信息' }
    }
  ]
}

export default houseManageRouter
