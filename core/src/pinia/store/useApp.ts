import { defineStore } from 'pinia';
import { Obj, Locale, DocumentRecord, Document, SetDocumentById, SelectDocumentHandler, GetDocumentHandler, UpdateDocumentHandler, SaveDocumentHandler } from '@/types';
import { isset } from '@/lib';
import { BaseError } from '@/errors';

export default defineStore('app', {
  state: (): Obj => ({
    lang: null,

    documents: null,
    document: null,
    selectDocumentHandler: null,
    getDocumentHandler: null,
    updDocumentHandler: null,
    saveDocumentHandler: null,

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

    getDocuments(): DocumentRecord[] | null {
      return this.documents;
    },
    getDocumentById(id: string): DocumentRecord {
      return this.documents?.find(d => isset(d?.id) && d?.id === id) ?? null;
    },
    setDocuments(val: DocumentRecord[]): void {
      this.documents = val;
    },
    setDocumentById(id: string, val: SetDocumentById): void {
      const data = val?.data || '';
      const index = this.documents?.findIndex(d => isset(d?.id) && d?.id === id) ?? null;
      const get = (): string => data;

      if (isset(index) && index >= 0)
        this.documents[index] = { ...val, id, get };
      else
        throw new BaseError(`Unable to update document: documentID '${id}' does not exist`);
    },
    addDocument(val: DocumentRecord): void {
      if (this.documents)
        this.documents.push(val);
      else
        this.documents = [ val ];
    },
    getEditorDocument(): Document | null {
      return this.document;
    },
    setEditorDocument(val: Document): void {
      this.document = val;
    },
    getOnSelectDocument(): SelectDocumentHandler | null {
      return this.selectDocumentHandler;
    },
    setOnSelectDocument(val: SelectDocumentHandler): void {
      this.selectDocumentHandler = val;
    },
    getOnGetDocument(): GetDocumentHandler | null {
      return this.getDocumentHandler;
    },
    setOnGetDocument(val: GetDocumentHandler): void {
      this.getDocumentHandler = val;
    },
    getOnUpdDocument(): UpdateDocumentHandler | null {
      return this.updDocumentHandler;
    },
    setOnUpdDocument(val: UpdateDocumentHandler): void {
      this.updDocumentHandler = val;
    },
    getOnSaveDocument(): SaveDocumentHandler | null {
      return this.saveDocumentHandler;
    },
    setOnSaveDocument(val: SaveDocumentHandler): void {
      this.saveDocumentHandler = val;
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
