// 一个响应携带唯一的全局标识
export interface SimplifiedResponse<T> {
    // 标识
    readonly code: number;
    data?: T;
}

// 一个响应可以携带额外的数据
export interface Payload<T> extends SimplifiedResponse<T> {
    data: T;
}

// 一个响应是否携带数据是可选的
export type Response<T> = Payload<T> | SimplifiedResponse<any>;

// 判断是否是有效负载
export function isOK<T>(r: Response<T>): r is Payload<T> {
    return r.code === 0;
}

export function OK<T>(t: Payload<T>) {
    return t;
}

export const JustOK = {
    code: 0,
};

// 错误上下文由标识唯一确认，如果不知道标识，data的类型暂时未知
type Reason = any;
// 一个响应可以携带错误上下文，data一般不应该是描述，而应该是i18n的参数
export type MResponse = SimplifiedResponse<Reason>;

type dataCallback<T> = (data: T) => void;
type errCallback = (code: number, data?: any) => void;

class MatchError extends Error {
    public data: any;

    constructor(message: string, data: any) {
        super(message);
        this.data = data;
    }
}

export function matchResponse<T>(r: Response<T>, onData: dataCallback<T>, onErr?: errCallback): any {
    if (isOK(r)) {
        // 我们不会检查在运行时，r.data是否存在
        return onData(r.data);
    } else if (onErr !== undefined) {
        return onErr(r.code, r.data);
    } else {
        console.error(new MatchError('match error', r), r);
    }
}

function Id(e: any) {
    return e;
}

export function unwrap<T>(r: Response<T>): T {
    return matchResponse(r, Id);
}
