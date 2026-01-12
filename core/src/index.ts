import { createApp } from 'vue';
import { createI18n } from 'vue-i18n';
import { createRouter } from 'vue-router';
import { createPinia } from 'pinia';
import { Obj, Locale, Document, SelectDocumentHandler, GetDocumentHandler, UpdateDocumentHandler, SaveDocumentHandler } from '@/types';
import { audit } from '@/lib';
import { BaseError } from '@/errors';
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

    const newEl: HTMLElement = el instanceof HTMLElement ? el : document.querySelector(el);
    const lang: Locale = options?.lang ?? DEFAULT_LANG;
    const selectDocumentHandler: SelectDocumentHandler | null = options?.selectDocument ?? null;
    const getDocumentHandler: GetDocumentHandler | null = options?.getDocument ?? null;
    const updDocumentHandler: UpdateDocumentHandler | null = options?.updDocument ?? null;
    const saveDocumentHandler: SaveDocumentHandler | null = options?.saveDocument ?? null;


    // Doing some checks

    if (!newEl) throw new BaseError(`Unable to create editor: Element ${audit(el)} does not exist`);


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


    // Creating the resize observer

    const observer = new ResizeObserver(entries => {
        for (const entry of entries) {
            appStore.setWidth(entry.contentRect.width);
            appStore.setIsMobile(entry.contentRect.width < MOBILE_WIDTH);
        }
    });

    observer.observe(newEl);


    // Defining the functions

    const clear = () => {
        observer.unobserve(newEl);
        observer.disconnect();
    };


    // Updating the data

    if (newEl?.offsetWidth) {
        appStore.setWidth(newEl.offsetWidth);
        appStore.setIsMobile(newEl.offsetWidth < MOBILE_WIDTH);
    }


    // Mounting the app

    app.mount(el);


    return { clear };
}


export default createEditor;

export type { Document, SelectDocumentHandler, GetDocumentHandler, UpdateDocumentHandler, SaveDocumentHandler };

export { types };
