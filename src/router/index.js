import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";

Vue.use(VueRouter);

const routes = [
    {
        path: "/",
        name: "Home",
        component: Home
    },
    {
        path: "/about",
        name: "About",
        component: () => import('../views/About.vue')
    },
    {
        path: '/user',
        name: 'User',
        component: () => import('../views/User.vue')
    },
    {
        path: '/school',
        name: 'School',
        component: () => import('../views/School.vue')
    },
    {
        path: '/resource',
        name: 'Resource',
        component: () => import('../views/Resource.vue')
    },
    {
        path: '/major',
        name: 'Major',
        component: () => import('../views/Major.vue')
    },
    {
        path: '/course',
        name: 'Course',
        component: () => import('../views/Course.vue')
    },
    {
        path: '/tags',
        name: 'Tag',
        component: () => import('../views/Tags.vue')
    },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
