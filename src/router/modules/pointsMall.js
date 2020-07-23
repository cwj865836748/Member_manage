/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'

const pointsMallRouter = {
  path: '/pointsMal',
  component: Layout,
  redirect: 'noRedirect',
  name: 'pointsMal',
  meta: {
    title: '积分商城',
    icon: 'lock'
  },
  children: [
    {
      path: 'redemptionRecord',
      component: () => import('@/views/pointsMal/redemptionRecord'),
      name: 'redemptionRecord',
      meta: { title: '兑奖记录' }
    },
    {
      path: 'pointsRecord',
      component: () => import('@/views/pointsMal/pointsRecord'),
      name: 'pointsRecord',
      meta: { title: '积分记录' }
    },
    {
      path: 'eventManagement',
      component: () => import('@/views/pointsMal/eventManagement'),
      name: 'eventManagement',
      meta: { title: '活动管理' }
    },
    {
      path: 'prize',
      component: () => import('@/views/pointsMal/eventManagement/Prize'),
      name: 'prize',
      meta: { title: '奖品管理' },
      hidden:true
    }
  ]
}

export default pointsMallRouter
