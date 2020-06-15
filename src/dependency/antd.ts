import { makeComponent } from '../lib/hoc';
// 一些较小的组件直接打包进主文件中
import { Descriptions, Divider, Layout, Menu, Modal, Radio } from 'antd';

// 注册异步antd加载组件
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
    Dropdown: makeComponent(
        () => import('antd/lib/dropdown/style'),
        () => import('antd/lib/dropdown')
    ),
    Divider,
    Descriptions,
    Radio,
    Modal,
    Layout,
    Menu,
};
