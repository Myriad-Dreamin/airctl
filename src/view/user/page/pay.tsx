import * as React from 'react';
import { useCallback, useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { useQuery, ValidateType } from '../../../lib/hooks';
import { antd } from '../../../dependency/antd';
import { DependencyContainer } from '../../../lib/common';
import { Button, Descriptions, Form, Input, Radio } from 'antd';
import { reportError, reportErrorS, reportInfoS } from '../../../component/notify';
import { matchResponse } from '../../../dependency/protocol';
import { Payment } from '../../../dependency/concept';

const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 24 },
};
const tailLayout = {
    wrapperCol: { offset: 10, span: 20 },
};

export function UserPay({ userService }: DependencyContainer) {
    return function (props: RouteComponentProps) {
        const query = useQuery<{ id: number; payment_id?: number }>(props.location.search, {
            id: { type: ValidateType.Number },
            payment_id: { type: ValidateType.Number },
        });

        const [id, setID] = useState<number | undefined>(undefined);
        const [useID, setUseID] = useState<boolean>(true);
        const [paymentInfo, setPaymentInfo] = useState<Payment | undefined>(undefined);
        console.log(query);

        useEffect(() => {
            if (query?.payment_id !== undefined) {
                matchResponse(
                    userService.CheckPayment(query?.payment_id),
                    (p) => {
                        reportInfoS(`good payment committed`);
                        setPaymentInfo(p);
                    },
                    (code, data) => {
                        reportError({
                            name: 'BadPayment',
                            code,
                            data,
                            message: 'bad payment',
                        });
                    }
                );
            }
        }, [query?.payment_id]);
        const onFinish = useCallback((values: any) => {
            if (useID) {
                if (values.id === undefined) {
                    reportErrorS('id null');
                }
            } else {
                if (values.phone_number === undefined) {
                    reportErrorS('phone_number null');
                }
            }
            console.log(values);
            props.history.push(`/mock-pay?id=${values.id}&payment_type=${values.payment_type}&money=${values.money}`);
        }, []);

        useEffect(() => {
            if (id === undefined) {
                setID(query?.id);
            }
        }, [query?.id]);

        // noinspection HtmlUnknownTarget
        return (
            <React.Fragment>
                <antd.Card>
                    <Form {...layout} name="basic" onFinish={onFinish}>
                        {useID ? (
                            <Form.Item
                                label="ID"
                                name="id"
                                rules={[{ required: true, message: 'Please input your id!' }]}
                            >
                                <Input />
                            </Form.Item>
                        ) : (
                            <Form.Item
                                label="PhoneNumber"
                                name="phone_number"
                                rules={[{ required: true, message: 'Please input your phone_number!' }]}
                            >
                                <Input />
                            </Form.Item>
                        )}

                        <Form.Item
                            label="Money"
                            name="money"
                            rules={[{ required: true, message: 'Please input the amount of money!' }]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label="Payment Type"
                            name="payment_type"
                            rules={[{ required: true, message: 'Please select the payment type!' }]}
                        >
                            <Radio.Group>
                                <Radio.Button value={0}>AliPay</Radio.Button>
                                <Radio.Button value={1}>WeChat</Radio.Button>
                                <Radio.Button value={2}>UnionPay</Radio.Button>
                                <Radio.Button value={3}>PayPal</Radio.Button>
                            </Radio.Group>
                        </Form.Item>

                        <Form.Item {...tailLayout}>
                            <Button onClick={() => setUseID((prev) => !prev)} disabled={true}>
                                {useID ? 'Use Phone Number Indexing' : 'Use ID'}
                            </Button>
                            <Button
                                type="primary"
                                htmlType="submit"
                                style={{
                                    marginLeft: '2vw',
                                }}
                            >
                                Submit
                            </Button>
                        </Form.Item>
                    </Form>
                </antd.Card>
                {paymentInfo && (
                    <antd.Card>
                        <Descriptions title="Payment Info">
                            <Descriptions.Item label="Payment ID">{paymentInfo?.payment_id}</Descriptions.Item>
                            <Descriptions.Item label="User ID">{paymentInfo?.user_id}</Descriptions.Item>
                            <Descriptions.Item label="Money">{paymentInfo?.money}</Descriptions.Item>
                        </Descriptions>
                    </antd.Card>
                )}
            </React.Fragment>
        );
    };
}
