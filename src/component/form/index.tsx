import { TextField as MaterialUITextField } from '@material-ui/core';
import * as React from 'react';
import { CSSProperties, Dispatch, ReducerState, useReducer, useState } from 'react';

// Form控制器类型
export interface FormController<T> {
    state: ReducerState<(state: T, event: React.ChangeEvent<{ value: string; name: string }>) => T>;
    dispatch: Dispatch<React.ChangeEvent<{ value: string; name: string }> | Array<any>>;
    info: { [K in keyof T]?: string };
    ok: boolean;
}

// Form Data的React Hook
export function useFormData<T>(
    data: T,
    validators?: { [K in keyof T]?: (data: string) => string | undefined }
): FormController<T> {
    const [info, setInfo] = useState<{ [K in keyof T]?: string }>({});
    let ok = true;
    const rs = useReducer((state: T, event: React.ChangeEvent<{ value: string; name: string }> | Array<any>) => {
        if (event instanceof Array) {
            return event[1];
        } else {
            event.persist();
            if (event.target) {
                if (validators && (validators as any)[event.target.name]) {
                    (info as any)[event.target.name] = (validators as any)[event.target.name](event.target.value);
                    setInfo(info);
                    if ((info as any)[event.target.name] !== undefined) {
                        ok = false;
                    }
                }
                (state as any)[event.target.name] = event.target.value;
                return { ...state };
            }
            return state;
        }
    }, data);

    return { state: rs[0], dispatch: rs[1], info, ok };
}

// Form的文本框组件
export function TextField<T>(prop: {
    controller: FormController<T>;
    field: keyof T & string;
    style?: CSSProperties;
    className?: string;
}) {
    const { controller, field, style, className } = prop;

    if (controller.info[field]) {
        return (
            <MaterialUITextField
                error
                className={className}
                helperText={controller.info[field]}
                defaultValue={controller.state[field]}
                name={field}
                style={style ? Object.assign({ width: '100%' }, style) : { width: '100%' }}
                onBlur={controller.dispatch}
            />
        );
    }
    return (
        <MaterialUITextField
            name={field}
            style={style ? Object.assign({ width: '100%' }, style) : { width: '100%' }}
            defaultValue={controller.state[field]}
            onBlur={controller.dispatch}
        />
    );
}
