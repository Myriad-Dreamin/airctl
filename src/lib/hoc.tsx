import React, { JSXElementConstructor, useEffect, useState } from 'react';

// 异步加载高阶组件
export function AsyncComponent<C extends keyof JSX.IntrinsicElements | JSXElementConstructor<any>>(
    importComponent: () => Promise<C>
): (props: React.ComponentProps<C>) => any {
    let Component: null | C = null;
    return (props: React.ComponentProps<C>) => {
        const [, setLoaded] = useState(false);

        useEffect(() => {
            importComponent()
                .then((c) => {
                    Component = c;
                    setLoaded(true);
                })
                .catch(console.error);
        }, []);

        return Component !== null ? <Component {...props} /> : null;
    };
}

type componentT<T> = () => Promise<{ default: T }>;

// 异步加载高阶组件（注入style文件）
export function makeComponent<T extends keyof JSX.IntrinsicElements | JSXElementConstructor<any>>(
    style: () => Promise<any>,
    component: componentT<T>
) {
    return AsyncComponent(async () => {
        await style();
        return (await component()).default;
    });
}
