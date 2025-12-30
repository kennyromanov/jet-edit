import { createApp, watch } from 'vue';
import { createI18n } from 'vue-i18n';
import { createRouter } from 'vue-router';
import { createPinia, storeToRefs } from 'pinia';
import { Obj, Locale, Document, GetDocumentHandler, GetDocumentByIdHandler } from '@/types';
import { Cache } from '@/lib';
import { DEFAULT_LANG, MESSAGES } from '@/i18n';
import { history, routes } from '@/router';
import * as types from '@/types';
import store from '@/pinia/store';
import App from './App.vue';
import './index.css';


// Constants

export const MOBILE_WIDTH = 1024;


// Functions

export function createEditor(el: string | HTMLElement, options: Obj = {}): Obj {

    // Getting the options

    const getDocumentHandler: GetDocumentHandler | null = options?.getDocument ?? null;
    const getDocumentByIdHandler: GetDocumentByIdHandler | null = options?.getDocumentById ?? null;


    // Getting the app

    const pinia = createPinia();

    const i18n = createI18n({
        locale: DEFAULT_LANG,
        fallbackLocale: DEFAULT_LANG,
        messages: MESSAGES,
    });

    const router = createRouter({ history, routes });

    const app = createApp(App).use(pinia).use(i18n).use(router);


    // Getting the store

    const appStore = store.useApp();


    // Getting the i18n

    const cachedLang = Cache.get('lang');


    // Updating the data

    if (getDocumentHandler)
        appStore.setOnGetDocument(getDocumentHandler);

    if (getDocumentByIdHandler)
        appStore.setOnGetDocumentById(getDocumentByIdHandler);

    if (cachedLang)
        appStore.setLang(cachedLang);


    // Defining the variables

    const { lang } = storeToRefs(appStore);


    // Defining the functions

    const updIsMobile = (): void => appStore.setIsMobile(window.innerWidth < MOBILE_WIDTH);

    const clear = () => window.removeEventListener('resize', updIsMobile);


    // Defining the watchers

    watch(lang, (val: Locale): void => {
        i18n.global.locale = val;
        Cache.set('lang', val, true);
    }, { immediate: true });


    // Mounting the app

    window.addEventListener('resize', updIsMobile);

    updIsMobile();

    app.mount(el);


    return { clear };
}


export default createEditor;

export type { Document, GetDocumentHandler, GetDocumentByIdHandler };

export { types };
