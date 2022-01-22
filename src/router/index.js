import Vue from 'vue';
import VueRouter from 'vue-router';
import ActiveTodos from '@/views/ActiveTodos.vue';
import CompletedTodos from '@/views/CompletedTodos.vue';
import Auth from '@/views/Auth.vue';
import Groups from '@/views/Groups.vue';
import PageNotFound from '@/views/PageNotFound.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Auth',
    component: Auth,
    meta: {
      layout: 'public',
    },
  },
  {
    path: '/active-todos',
    name: 'ActiveTodos',
    component: ActiveTodos,
  },
  {
    path: '/completed-todos',
    name: 'CompletedTodos',
    component: CompletedTodos,
  },
  {
    path: '/groups',
    name: 'Groups',
    component: Groups,
  },
  {
    path: '*',
    name: 'NotFound',
    component: PageNotFound,
    meta: {
      layout: 'public',
    },
  },
];

const router = new VueRouter({
  mode: 'history',
  routes,
});

router.beforeEach((to, from, next) => {
  if (to.meta?.layout === 'public') {
    return next();
  }
  if (localStorage.getItem('token')) {
    if (to.name === 'Auth') {
      return next('/active-todos');
    }
    return next();
  }
  return next({ name: 'Auth' });
});

export default router;
