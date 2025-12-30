import { createWebHistory, RouteRecordRaw } from 'vue-router';
import HomeView from '@/views/home';

export const history = createWebHistory();

export const routes: RouteRecordRaw[] = [
    {
        name: 'Home',
        path: '/',
        component: HomeView,
    },
];
