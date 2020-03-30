import * as React from 'react';
import { useCallback } from 'react';
import { Button, Form, Input } from 'antd';
import { DependencyContainer } from '../../../lib/common';
import { matchResponse } from '../../../dependency/protocol';

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

        return (
            // onFinishFailed={onFinishFailed}
            <Form {...layout} name="basic" onFinish={onFinish}>
                <Form.Item
                    label="Username"
                    name="name"
                    rules={[{ required: true, message: 'Please input your username!' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="phone number"
                    name="phone_number"
                    rules={[{ required: true, message: 'Please input your phone number!' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Password"
                    name="password"
                    rules={[{ required: true, message: 'Please input your password!' }]}
                >
                    <Input.Password />
                </Form.Item>

                <Form.Item {...tailLayout}>
                    <Button type="primary" htmlType="submit">
                        Submit
                    </Button>
                </Form.Item>
            </Form>
        );
    };
}
