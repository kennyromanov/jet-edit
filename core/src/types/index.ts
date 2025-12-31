
// Base Data Types

export type Obj<T extends any = any> = Record<string, T>;

export type Isset<T extends any> = T extends null|undefined ? false : true;

export type IsNumber<T extends any> = T extends number ? true : false;

export type IsObject<T extends any, O extends Obj = Obj> = T extends O ? true : false;

export type Has<T extends Obj, K extends keyof T> = T[K];

export type Inarr<T extends any, A extends any[]> = T extends A[any] ? true : false;

export type Serializable<T extends Obj | any[] = Obj | any[]> = T;

export type Storable<T extends Obj | any[] = Obj | any[]> = string | number | Serializable<T> | null;

export type Nullable<T> = T | null | undefined;

export type Constructor<T extends object = object> = new (..._args: any[]) => T;

export type MaybePromise<T extends any = any> = T | Promise<T>;


// Base Callable Types

export type Loader<T extends any = any> = () => MaybePromise<T>;


// Specific Data Types

export type Country = 'us' | 'kz' | 'ru' | 'uz' | string;

export type Locale = 'en-US' | 'kk-KZ' | 'ru-RU' | 'uz-UZ';

export type DocumentData = Obj;


// Specific Struct Types

export type SimpleDocument = {
    name: string,
};

export type DocumentRecord = SimpleDocument & {
    id: string,
};

export type Document = DocumentRecord & {
    id: string,
    data: string,
};

export type UpdateDocumentPayload = SimpleDocument & {
    data: string,
};


// Specific Callable Types

export type BreakerHandler = () => MaybePromise<boolean>;

export type SelectDocumentHandler = () => MaybePromise<Document | null>;

export type GetDocumentHandler = (id: string) => MaybePromise<Document | null>;

export type UpdateDocumentHandler = (id: string, val: UpdateDocumentPayload) => MaybePromise<void>;

export type SaveDocumentHandler = (id: string, val: UpdateDocumentPayload) => MaybePromise<void>;
