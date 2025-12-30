import { defineStore } from 'pinia';
import { Obj, Locale, LoadDocument, Document, GetDocumentHandler, GetDocumentByIdHandler } from '@/types';

export default defineStore('app', {
  state: (): Obj => ({
    lang: null,

    documents: null,
    document: null,
    getDocumentHandler: null,
    getDocumentByIdHandler: null,

    isMobile: null,

    errors: [],
  }),
  actions: {

    // Globals

    getLang(): Locale | null {
      return this.lang;
    },
    setLang(val: Locale): void {
      this.lang = val;
    },


    // Documents

    getDocuments(): LoadDocument[] | null {
      return this.documents;
    },
    setDocuments(val: LoadDocument[]): void {
      this.documents = val;
    },
    addDocument(val: LoadDocument): void {
      if (!this.documents) this.documents = [];
      this.documents.push(val);
    },
    getDocument(): Document | null {
      return this.document;
    },
    setDocument(val: Document): void {
      this.document = val;
    },
    getOnGetDocument(): GetDocumentHandler | null {
      return this.getDocumentHandler;
    },
    setOnGetDocument(val: GetDocumentHandler): void {
      this.getDocumentHandler = val;
    },
    getOnGetDocumentById(): GetDocumentByIdHandler | null {
      return this.getDocumentByIdHandler;
    },
    setOnGetDocumentById(val: GetDocumentByIdHandler): void {
      this.getDocumentByIdHandler = val;
    },


    // Mobile

    getIsMobile(): boolean|null {
      return this.isMobile;
    },
    setIsMobile(val: boolean): void {
      this.isMobile = val;
    },


    // Errors

    logError(e: Error): void {
      this.errors.push(e);
    },
    flushErrors(): void {
      this.errors = [];
    },
  }
});
