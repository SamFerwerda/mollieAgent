import { createRouter, createWebHistory } from 'vue-router'

import LoginView from '../views/LoginView.vue'
import ChatView from '../views/ChatView.vue'
import { useProfileStore } from '../stores/user'

const routes = [
  { path: '/', name: 'Login', component: LoginView },
  { path: '/chat', name: 'Chat', component: ChatView, meta: { requiresAuth: true } },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach(async (to, from, next) => {
  if (to.meta.requiresAuth) {
    try {
      const res = await fetch('/api/session', { credentials: 'include' })

      if (!res.ok) {
        next('/no-access')
        return;
      }

      const data = await res.json()

      if (data.isTrustedUser) {
        const { setUser } = useProfileStore();

        setUser(data.userProfile);
        next()
      } else {
        next('/no-access')
      }
    } catch (error) {
      console.error('Auth error:', error)
      next('/no-access')
    }
  } else {
    next()
  }
})


export default router