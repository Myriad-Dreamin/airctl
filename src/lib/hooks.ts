import { useEffect, useRef, useState } from 'react';
import { ServiceCode } from '../service/errors';
import queryString from 'query-string';

export function useInterval(callback: () => void, delay: number | null) {
    const savedCallback = useRef<() => void>();

    // Remember the latest callback.
    useEffect(() => {
        savedCallback.current = callback;
    }, [callback]);

    // Set up the interval.
    useEffect(() => {
        function tick() {
            if (savedCallback.current) {
                savedCallback.current();
            } else {
                throw new Error('wtf, callback ref is null');
            }
        }
        if (delay !== null) {
            const id = setInterval(tick, delay);
            return () => clearInterval(id);
        }
    }, [delay]);
}

interface Rule {
    required?: boolean;
    type?: ValidateType;
}

export enum ValidateType {
    String,
    Number,
}

type ErrHandler = (err: Error & { code: ServiceCode; data: any }, query: any) => void;

export function checkQuery<Q>(query: any, errHandler: ErrHandler, rules?: { [K in keyof Q]?: Rule }): query is Q {
    if (rules) {
        Object.keys(rules).forEach(function (key) {
            const rule: Rule = (rules as any)[key];
            if (!rule) {
                return;
            }
            const value = query[key];
            if (value) {
                if (rule.type) {
                    if (rule.type === ValidateType.Number) {
                        const parsed = Number.parseInt(value);
                        if (isNaN(parsed)) {
                            errHandler(
                                Object.assign(new Error('validate error'), {
                                    code: ServiceCode.ValidateNaN,
                                    data: value,
                                }),
                                query
                            );
                        } else {
                            query[key] = parsed;
                        }
                    }
                }
            } else if (rule.required === true) {
                errHandler(
                    Object.assign(new Error('validate error'), {
                        code: ServiceCode.ValidateUndefinedValue,
                        data: [key],
                    }),
                    query
                );
            }
        });
    }

    return true;
}

export function useQuery<Q>(
    search: string,
    rules?: { [K in keyof Q]?: Rule },
    errHandler: ErrHandler = console.error
): Q | undefined {
    const [query, SetQuery] = useState<Q | undefined>();

    useEffect(() => {
        const parsed = queryString.parse(search);
        if (checkQuery<Q>(parsed, errHandler, rules)) {
            SetQuery(parsed);
        }
    }, [search]);
    return query;
}
