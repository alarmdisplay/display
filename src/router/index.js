import Vue from 'vue'
import VueRouter from 'vue-router'
import Overview from '@/components/Overview'
import AnnouncementList from '@/components/content/announcements/List'
import AnnouncementCreateForm from '@/components/content/announcements/CreateForm'
import AnnouncementEditForm from '@/components/content/announcements/EditForm'
import DisplayList from '@/components/displays/DisplayList'
import DisplayCreateForm from '@/components/displays/DisplayCreateForm'
import DisplayEditForm from '@/components/displays/DisplayEditForm'
import ViewList from '@/components/views/ViewList'
import ViewEditForm from '@/components/views/ViewEditForm'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: Overview
  },
  {
    path: '/announcements',
    component: AnnouncementList
  },
  {
    path: '/announcements/new',
    component: AnnouncementCreateForm
  },
  {
    path: '/announcements/:id',
    component: AnnouncementEditForm,
    props: true
  },
  {
    path: '/displays',
    component: DisplayList
  },
  {
    path: '/displays/new',
    component: DisplayCreateForm
  },
  {
    path: '/displays/:id',
    component: DisplayEditForm,
    props: true
  },
  {
    path: '/displays/:display_id/views',
    component: ViewList,
    props: true
  },
  {
    path: '/displays/:display_id/views/:view_id',
    component: ViewEditForm,
    props: true
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
  linkActiveClass: 'w3-blue'
})

export default router
