import Vue from 'vue'
import VueRouter from 'vue-router'
import Overview from '@/components/Overview'
import About from '@/views/About'
import AnnouncementList from '@/views/content/AnnouncementList'
import AnnouncementForm from '@/views/content/AnnouncementForm'
import ApiKeyForm from '@/views/admin/ApiKeyForm'
import ApiKeyList from '@/views/admin/ApiKeyList'
import DisplayForm from '@/views/displays/DisplayForm'
import DisplayList from '@/views/displays/DisplayList'
import UserForm from '@/views/admin/UserForm'
import UserList from '@/views/admin/UserList'
import ViewList from '@/components/views/ViewList'
import ViewForm from '@/views/displays/ViewForm'

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
    name: 'view-list',
    component: ViewList
  },
  {
    path: '/displays/:display_id/views/:view_id',
    name: 'view-form',
    component: ViewForm
  },
  {
    path: '/admin/users',
    name: 'user-list',
    component: UserList
  },
  {
    path: '/admin/users/:id',
    name: 'user-form',
    component: UserForm
  },
  {
    path: '/admin/api-keys',
    name: 'api-key-list',
    component: ApiKeyList
  },
  {
    path: '/admin/api-keys/:id',
    name: 'api-key-form',
    component: ApiKeyForm
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
  linkActiveClass: 'is-active'
})

export default router
