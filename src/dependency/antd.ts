import { JSXElementConstructor } from 'react';
import { AsyncComponent } from '../lib/hoc';

type componentT<T> = () => Promise<{ default: T }>;

function makeComponent<T extends keyof JSX.IntrinsicElements | JSXElementConstructor<any>>(
    style: () => Promise<any>,
    component: componentT<T>
) {
    return AsyncComponent(async () => {
        await style();
        return (await component()).default;
    });
}

import { Modal } from 'antd';

export const antd = {
    Card: makeComponent(
        () => import('antd/lib/card/style'),
        () => import('antd/lib/card')
    ),
    Button: makeComponent(
        () => import('antd/lib/button/style'),
        () => import('antd/lib/button')
    ),
    Divider: makeComponent(
        () => import('antd/lib/divider/style'),
        () => import('antd/lib/divider')
    ),
    Modal,
};
