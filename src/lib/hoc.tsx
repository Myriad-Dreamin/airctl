import React, { JSXElementConstructor, useEffect, useState } from 'react';

export function AsyncComponent<C extends keyof JSX.IntrinsicElements | JSXElementConstructor<any>>(
    importComponent: () => Promise<C>
): (props: React.ComponentProps<C>) => any {
    let Component: null | C = null;
    return (props: React.ComponentProps<C>) => {
        const [, setLoaded] = useState(false);

        useEffect(() => {
            importComponent().then((c) => {
                Component = c;
                setLoaded(true);
            });
        }, []);

        return Component !== null ? <Component {...props} /> : null;
    };
}
