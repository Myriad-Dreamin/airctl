import { JSXElementConstructor } from 'react';
import { AsyncComponent } from '../lib/hoc';
import { Descriptions, Divider, Layout, Menu, Modal, Radio } from 'antd';

type componentT<T> = () => Promise<{ default: T }>;
// type componentTPure<T> = () => Promise<T>;

function makeComponent<T extends keyof JSX.IntrinsicElements | JSXElementConstructor<any>>(
    style: () => Promise<any>,
    component: componentT<T>
) {
    return AsyncComponent(async () => {
        await style();
        return (await component()).default;
    });
}

// function makeComponentPure<T extends keyof JSX.IntrinsicElements | JSXElementConstructor<any>>(
//     style: () => Promise<any>,
//     component: componentTPure<T>
// ) {
//     return AsyncComponent(async () => {
//         await style();
//         return (await component());
//     });
// }

export const antd = {
    Card: makeComponent(
        () => import('antd/lib/card/style'),
        () => import('antd/lib/card')
    ),
    Button: makeComponent(
        () => import('antd/lib/button/style'),
        () => import('antd/lib/button')
    ),
    Form: makeComponent(
        () => import('antd/lib/form/style'),
        () => import('antd/lib/form')
    ),
    FormItem: makeComponent(
        () => import('antd/lib/form/style'),
        () => import('antd/lib/form/FormItem')
    ),
    Input: makeComponent(
        () => import('antd/lib/input/style'),
        () => import('antd/lib/input')
    ),
    InputPassword: makeComponent(
        () => import('antd/lib/input/style'),
        () => import('antd/lib/input/Password')
    ),
    Dropdown: makeComponent(
        () => import('antd/lib/dropdown/style'),
        () => import('antd/lib/dropdown')
    ),
    Avatar: makeComponent(
        () => import('antd/lib/avatar/style'),
        () => import('antd/lib/avatar')
    ),
    Skeleton: makeComponent(
        () => import('antd/lib/skeleton/style'),
        () => import('antd/lib/skeleton')
    ),
    Divider,
    Descriptions,
    Radio,
    Modal,
    Layout,
    Menu,
    // Avatar,
};
