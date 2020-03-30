import { Response } from '../../dependency/protocol';

export const mockCode: number = 1 << 22;

export enum ServiceCode {
    MockDuplicateKey = mockCode + 1,
    MockNotFound = mockCode + 2,
    MockTodo = mockCode + 3,
}

export interface NotFoundErrData {
    [index: string]: any;
}

export function MockNotFound(data: NotFoundErrData): Response<NotFoundErrData> {
    return {
        code: ServiceCode.MockNotFound,
        data: data,
    };
}

export interface DuplicateErrData {
    field: string;
    value: any;
}

export function MockDuplicateKey(data: DuplicateErrData): Response<DuplicateErrData> {
    return {
        code: ServiceCode.MockDuplicateKey,
        data: data,
    };
}

export function MockTodo(): Response<undefined> {
    return { code: ServiceCode.MockTodo };
}
