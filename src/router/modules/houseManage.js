/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'

const houseManageRouter = {
  path: '/houseManage',
  component: Layout,
  redirect: 'noRedirect',
  name: 'houseManage',
  meta: {
    title: '房源管理',
    icon: 'sold-unit'
  },
  children: [
    {
      path: 'gridding',
      component: () => import('@/views/houseManage/gridding'),
      name: 'gridding',
      meta: { title: '网格化', icon: 'international'}
    },
    {
      path: 'houseList',
      component: () => import('@/views/houseManage/houseList'),
      name: 'houseList',
      meta: { title: '房源列表',icon: 'list' }
    },
    {
      path: '/houseManage/detail',
      component: () => import('@/views/houseManage/houseList/detail'),
      name: 'detail',
      hidden:true,
      meta: { title: '房源详情' }
    },
    {
      path: '/houseManage/detailMsg',
      component: () => import('@/views/houseManage/houseList/detailMsg'),
      name: 'detailMsg',
      hidden:true,
      meta: { title: '房源成员信息' }
    }
  ]
}

export default houseManageRouter
