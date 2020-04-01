import * as React from 'react';
import { useCallback } from 'react';
import { DependencyContainer } from '../../../lib/common';
import { matchResponse } from '../../../dependency/protocol';
import { antd } from '../../../dependency/antd';

const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 20 },
};
const tailLayout = {
    wrapperCol: { offset: 4, span: 20 },
};

export function UserRegisterForm({ userService }: DependencyContainer) {
    return function () {
        const onFinish = useCallback(
            (values: any) => matchResponse(userService.Register(values), console.log, console.error),
            []
        );

        console.log(antd.FormItem);

        return (
            // onFinishFailed={onFinishFailed}
            <antd.Form {...layout} name="basic" onFinish={onFinish}>
                <antd.FormItem
                    label="Username"
                    name="name"
                    rules={[{ required: true, message: 'Please input your username!' }]}
                >
                    <antd.Input />
                </antd.FormItem>

                <antd.FormItem
                    label="phone number"
                    name="phone_number"
                    rules={[{ required: true, message: 'Please input your phone number!' }]}
                >
                    <antd.Input />
                </antd.FormItem>

                <antd.FormItem
                    label="Password"
                    name="password"
                    rules={[{ required: true, message: 'Please input your password!' }]}
                >
                    <antd.InputPassword />
                </antd.FormItem>

                <antd.FormItem {...tailLayout}>
                    <antd.Button type="primary" htmlType="submit">
                        Submit
                    </antd.Button>
                </antd.FormItem>
            </antd.Form>
        );
    };
}
