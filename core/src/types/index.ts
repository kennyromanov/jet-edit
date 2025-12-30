
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
    id: string,
    name: string,
};

export type LoadDocument = SimpleDocument & {
    get: DocumentDataLoader,
};

export type Document = SimpleDocument & {
    data: string,
};


// Specific Callable Types

export type BreakerHandler = () => MaybePromise<boolean>;

export type DocumentDataLoader = Loader<DocumentData>;

export type GetDocumentHandler = Loader<Document | null>;

export type GetDocumentByIdHandler = (id: string) => MaybePromise<Document | null>;
