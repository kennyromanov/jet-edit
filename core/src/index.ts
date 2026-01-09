import { createApp } from 'vue';
import { createI18n } from 'vue-i18n';
import { createRouter } from 'vue-router';
import { createPinia } from 'pinia';
import { Obj, Locale, Document, SelectDocumentHandler, GetDocumentHandler, UpdateDocumentHandler, SaveDocumentHandler } from '@/types';
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

    const lang: Locale = options?.lang ?? DEFAULT_LANG;
    const selectDocumentHandler: SelectDocumentHandler | null = options?.selectDocument ?? null;
    const getDocumentHandler: GetDocumentHandler | null = options?.getDocument ?? null;
    const updDocumentHandler: UpdateDocumentHandler | null = options?.updDocument ?? null;
    const saveDocumentHandler: SaveDocumentHandler | null = options?.saveDocument ?? null;


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


    // Updating the data

    appStore.setLang(lang);

    if (selectDocumentHandler)
        appStore.setOnSelectDocument(selectDocumentHandler);

    if (getDocumentHandler)
        appStore.setOnGetDocument(getDocumentHandler);

    if (updDocumentHandler)
        appStore.setOnUpdDocument(updDocumentHandler);

    if (saveDocumentHandler)
        appStore.setOnSaveDocument(saveDocumentHandler);


    // Defining the functions

    const updIsMobile = (): void => appStore.setIsMobile(window.innerWidth < MOBILE_WIDTH);

    const clear = () => window.removeEventListener('resize', updIsMobile);


    // Mounting the app

    window.addEventListener('resize', updIsMobile);

    updIsMobile();

    app.mount(el);


    return { clear };
}


export default createEditor;

export type { Document, SelectDocumentHandler, GetDocumentHandler, UpdateDocumentHandler, SaveDocumentHandler };

export { types };
