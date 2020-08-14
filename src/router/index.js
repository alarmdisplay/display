import Vue from 'vue'
import VueRouter from 'vue-router'
import Overview from '@/components/Overview'
import About from '@/views/About'
import AnnouncementList from '@/views/content/AnnouncementList'
import AnnouncementForm from '@/views/content/AnnouncementForm'
import DisplayForm from '@/views/displays/DisplayForm'
import DisplayList from '@/views/displays/DisplayList'
import ViewList from '@/components/views/ViewList'
import ViewEditForm from '@/components/views/ViewEditForm'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: Overview
  },
  {
    path: '/about',
    name: 'About',
    component: About
  },
  {
    path: '/announcements',
    name: 'announcement-list',
    component: AnnouncementList
  },
  {
    path: '/announcements/:id',
    name: 'announcement-form',
    component: AnnouncementForm
  },
  {
    path: '/displays',
    name: 'display-list',
    component: DisplayList
  },
  {
    path: '/displays/:id',
    name: 'display-form',
    component: DisplayForm
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
  linkActiveClass: 'is-active'
})

export default router
