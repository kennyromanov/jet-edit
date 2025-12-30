import { nanoid } from 'nanoid';
import { PotentialLoopWarning } from '@/errors';
import * as types from '@/types';
import store from '@/pinia/store';


// Constants

export const DEFAULT_STORAGE_PREFIX = 'jetedit';

export const DEFAULT_FILE_NAME = 'unknown';

export const DEFAULT_TIMEOUT = 30 * 1000;

export const DEFAULT_TICK = 500;


// Classes

export class Storage {
    public static prefix: string = DEFAULT_STORAGE_PREFIX;

    public static fullKey(name: string): string {
        return this.prefix + '__' + name;
    }

    public static shortKey(name: string): string {
        const fullKey = this.fullKey('');

        return name.slice(fullKey.length);
    }

    public static keys(): string[] {
        const prefix = this.fullKey('');
        const fullKeys = Object.keys(localStorage);
        const result: string[] = [];

        for (const fullKey of fullKeys)
            if (fullKey.startsWith(prefix))
                result.push(this.shortKey(fullKey));

        return result;
    }

    public static get(name: string): types.Storable | null {
        const key = this.fullKey(name);
        let result: types.Storable | null = localStorage.getItem(key);


        // Doing some checks

        if (!result) return null;


        // If the value is a JSON

        const obj = unserialize(result, false);

        if (obj !== null) return obj;


        // If the value is a number

        const isNum = isNumber(result);

        if (isNum) return Number(result);


        return result;
    }

    public static set(name: string, value: types.Storable): void {
        const key = this.fullKey(name);
        let result: string = String(value);


        // If the value is an object

        const isObj = isObject(value);

        if (isObj) {
            const obj = serialize(value, false);

            if (isset(obj)) result = obj;
        }


        localStorage.setItem(key, result);
    }

    public static del(name: string): void {
        const key = this.fullKey(name);

        localStorage.removeItem(key);
    }
}

export class Cache {
    public static get(name: string): any {
        const cacheStore = store.useCache();
        return cacheStore.get(name) ?? Storage.get(name);
    }

    public static set(name: string, value: any, keep: boolean = false): void {

        // Updating the data

        const cacheStore = store.useCache();

        cacheStore.set(name, value);


        // Updating the data in ROM immediately

        if (keep) {
            Storage.set(name, value);
            return;
        }


        // Otherwise - update the data in RAM

        Storage.del(name);
    }

    public static del(name: string): void {
        const cacheStore = store.useCache();

        cacheStore.del(name);

        Storage.del(name);
    }

    public static store(value: any, keep: boolean = false): string {
        const id = nanoid();

        this.set(id, value, keep);

        return id;
    }
}


// Checking Functions

export function inarr<T extends any, A extends any[]>(val: T, ...arr: A): types.Inarr<T, A> {
    return arr.includes(val) as types.Inarr<T, A>;
}

export function has<T extends types.Obj, K extends keyof T>(obj: T, key: K): types.Has<T, K> {
    return obj.hasOwnProperty(key) as types.Has<T, K>;
}

export function isset<T extends any>(val: T): types.Isset<T> {
    return !inarr(val, null, undefined) as types.Isset<T>;
}

export function isNumber<T extends any>(val: T): types.IsNumber<T> {
    return (isset(val) && !isNaN(Number(val))) as types.IsNumber<T>;
}

export function isObject<T extends any>(val: T): types.IsObject<T> {
    return (typeof val === 'object' && val !== null) as types.IsObject<T>;
}


// Framework Functions

export function audit(val: any): string {
    if (isObject(val))
        return JSON.stringify(val);

    else if (typeof val === 'string')
        return `'${val}'`;

    else
        return String(val);
}

export function time(): number {
    return Date.now();
}

export function unslash(path: string): string {
    let result = path;

    if (result?.startsWith('/'))
        result = result.slice(1);

    if (result?.endsWith('/'))
        result = result.slice(0, -1);

    return result;
}

export function slash(path: string): string {
    const result = unslash(path);

    return '/'+result;
}

export function serialize(obj: types.Storable, logError: boolean = true): string|null {
    let result: string|null = null;

    try {
        result = JSON.stringify(obj);
    } catch (_e: any) {
        if (logError)
            console.error(`Unable to serialize the object: ${audit(obj)}`);
    }

    return result;
}

export function unserialize(val: string, logError: boolean = true): types.Serializable | null {
    let result: types.Serializable | null = null;

    try {
        result = JSON.parse(val);
    } catch (_e: any) {
        if (logError)
            console.error(`Unable to unserialize the string: ${audit(val)}`);
    }

    return result;
}

export function base64(val: string): string {
    const array = new TextEncoder().encode(val);
    return btoa(String.fromCharCode(...array));
}

export function fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = () => {
            resolve(String(reader.result));
        };

        reader.onerror = reject;

        reader.readAsDataURL(file);
    });
}

export function base64ToFile(val: string, filename = DEFAULT_FILE_NAME): File {
    const [ meta, base64 ] = val?.split(',') ?? '';

    const matches = meta?.match(/data:(.*);base64/);
    const mime = matches ? matches[1] : 'application/octet-stream';

    const bytes = atob(base64);
    const array = Uint8Array.from(bytes, c => c?.charCodeAt(0) ?? 0);


    return new File([ array ], filename, { type: mime });
}

export function ensurePromise<T extends any = any>(val: types.MaybePromise): Promise<T> {
    return new Promise((resolve, reject) => {
        const isAsync = val instanceof Promise;

        if (isAsync)
            val.then(resolve).catch(reject);
        else
            resolve(val);
    }) as Promise<T>;
}

export function ensureAsync<T extends any = any>(val: any): (...val: any[]) => Promise<T> {
    return (...args: any[]) => ensurePromise<T>(val(...args));
}

export function loop(breaker: types.BreakerHandler, timeout: number = DEFAULT_TIMEOUT, tick: number = DEFAULT_TICK): Promise<void> {
    return new Promise((resolve, reject) => {
        const end = time() + timeout;

        const wait = setInterval(() => {

            // Doing some checks

            const isTimedOut = time() >= end;

            if (isTimedOut) {
                clearInterval(wait);

                const error = new PotentialLoopWarning('The loop() function has timed out');

                reject(error);
            }


            // Calling the handler

            const result = breaker();
            const isAsync = result instanceof Promise;


            // If the result is async

            if (isAsync) result.then((val) => {
                if (val) resolve();
            });


            // Checking the result

            if (result) {
                clearInterval(wait);
                resolve();
            }
        }, tick);
    });
}


export { nanoid };
