import { Response } from '../../dependency/protocol';

export const mockCode = 4000000;
export const validateCode = 5000000;

export enum ServiceCode {
    MockDuplicateKey = mockCode + 1,
    MockNotFound = mockCode + 2,
    MockTodo = mockCode + 3,
    MockRequiredOneOf = mockCode + 4,
    ValidateUndefinedValue = validateCode + 1,
    ValidateNaN = validateCode + 1,
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

export function MockDuplicateKey(fields: string[]): Response<string[]> {
    return {
        code: ServiceCode.MockDuplicateKey,
        data: fields,
    };
}

export function MockRequiredOneOf(fields: string[]): Response<string[]> {
    return {
        code: ServiceCode.MockRequiredOneOf,
        data: fields,
    };
}

export function MockTodo(): Response<undefined> {
    return { code: ServiceCode.MockTodo };
}
