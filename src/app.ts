import { createApp } from 'vue';
import { useSessionCache } from '@/lib';
import { useI18nCache, useI18nReactivity } from '@/i18n/lib';
import store from '@/pinia/store';
import i18n from '@/i18n';
import router from '@/router';
import Component from './Component.vue';
import 'vue-sonner/style.css';
import './app.css';


// Third-parties

export const appStore = store.useApp();

useSessionCache();
useI18nCache();
useI18nReactivity();


// Constants

export const MOBILE_WIDTH = 1024;


// Functions

export function updIsMobile(): void {
    appStore.setIsMobile(window.innerWidth < MOBILE_WIDTH);
}


// Setting the listeners

window.addEventListener('resize', updIsMobile);


// Initializing the app

updIsMobile();

createApp(Component)
    .use(i18n)
    .use(router)
    .mount('#app');
