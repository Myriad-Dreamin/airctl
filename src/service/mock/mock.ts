import { isOK, OK, Payload, Response, SimplifiedResponse } from '../../dependency/protocol';
import { MockDuplicateKey, MockNotFound } from '../errors';

export function composeResponse(... fs: any) : Response<any> | undefined {
    for (let f of fs) {
        let r = f();
        if (r !== undefined) {
            return r
        }
    }
    return undefined
}

export class MockService<T> {
    protected readonly mockData: (T & {deleted?: boolean})[];

    protected inc = 0;

    constructor(initialData?: T[]) {
        this.mockData = initialData?.
            map((data) => Object.assign(data, {deleted: false})) || [];

        this.inc = this.mockData.length + 1;
    }

    appendData(d: T) {
        this.mockData.push(Object.assign(d, {deleted: false}));
    }

    checkExists(aid: number): SimplifiedResponse<any> | undefined {
        if ((aid >= this.inc || aid <= 0) || this.mockData[aid - 1].deleted === true) {
            return MockNotFound({
                index: aid,
            });
        }
        return undefined
    }

    Get(aid: number): Payload<T> | SimplifiedResponse<any> {
        return this.checkExists(aid) || OK<T>({
            code: 0,
            data: this.mockData[aid - 1],
        });
    }

    Delete(aid: number): Payload<undefined> | SimplifiedResponse<any> {
        return this.delete(aid) || OK<undefined>({
            code: 0,
            data: undefined,
        });
    }

    protected delete(aid: number): SimplifiedResponse<any> | undefined {
        return this.checkExists(aid) || (() => {this.mockData[aid - 1].deleted = true})() || undefined;
    }
}


export function Pick<K extends keyof T, T>(plucking: K, p: Response<T>): Response<T[K]> {
    return isOK(p) ? OK<T[K]>({
        code: 0,
        data: p.data[plucking]
    }) : p;
}

export class MockServiceIndex<K extends (keyof T) & string, T> extends Map<T[K], T> {
    public readonly indexName: K;

    constructor(indexName: K, initialData?: T[]) {
        super();
        this.indexName = indexName;
        if (initialData) {
            this.appendArray(initialData);
        }
    }

    appendArray(data: T[]) {
        for (const d of data) {
            this.set(d[this.indexName], d);
        }
    }

    appendData(d: T) {
        this.set(d[this.indexName], d);
    }

    deleteData(d: T) {
        this.delete(d[this.indexName]);
    }

    getData(index: T[K]): Payload<T> | SimplifiedResponse<any> {
        const maybeData = this.get(index);
        if (maybeData === undefined) {
            return MockNotFound({
                index
            });
        }
        return OK<T>({
            code: 0,
            data: maybeData
        });
    }

    shouldNotExist(index: T[K]) : SimplifiedResponse<any> | undefined {
        if (this.has(index)) {
            return MockDuplicateKey({
                field: this.indexName,
                value: index,
            });
        }
        return undefined;
    }
}
