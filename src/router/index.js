import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      redirect: "log-in"
    },
    {
      path: "/profiles",
      name: "profiles",
      component: () => import("../users/coach/coach-profile/pages/coach-profile.component.vue"),
    },
    {
      path: "/advisories",
      name: "advisories",
      component: () => import("../users/coach/coach-advisory/pages/coach-advisory.component.vue")
    },
    {
      path: "/students",
      name: "students",
      component: () => import("../users/coach/coach-students/pages/coach-students.component.vue")
    },
    {
      path: "/tournaments",
      name: "tournaments",
      component: () => import("../users/coach/coach-tournament/pages/coach-tournaments.component.vue")
    },
    {
      path: '/home',
      name: 'home',
      component: () => import("../users/coach/coach-home/pages/coach-home.component.vue")
    },
    {
      path: '/log-in',
      name: 'login',
      component: () => import("../users/log-in/pages/log-in.vue")
    },
    {
      path: '/sign-up',
      name: 'signup',
      component: () => import("../users/sign-up/pages/sign-up.vue")
    },
    {
      path: '/logeo',
      name: 'logeo',
      component: () => import("../public/login/pages/login.component.vue")
    }

  ]
})

export default router