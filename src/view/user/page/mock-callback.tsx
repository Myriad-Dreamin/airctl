import * as React from 'react';
import { useCallback, useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { useInterval, useQuery, ValidateType } from '../../../lib/hooks';
import { DependencyContainer } from '../../../lib/common';
import { reportError } from '../../../component/notify';

let mockPayID = 0;

export function UserMockPay({ userService }: DependencyContainer) {
    return function (props: RouteComponentProps) {
        const [redirectTime, setRedirectTime] = useState(2);
        const [success, setPaymentSuccess] = useState(false);

        const query = useQuery<{
            id: number;
            money: number;
            payment_type: number;
        }>(
            props.location.search,
            {
                id: { required: true, type: ValidateType.Number },
                money: { required: true, type: ValidateType.Number },
                payment_type: { required: true, type: ValidateType.Number },
            },
            (err, q) => {
                reportError(err);
                const id = q?.id;
                if (id !== undefined) {
                    props.history.push('/app/user/pay?id=' + id);
                } else {
                    props.history.push('/app');
                }
            }
        );
        console.log(query);

        useEffect(() => {
            if (query) {
                const timer = setTimeout(() => {
                    userService.Pay(query.id, query);
                    setPaymentSuccess(true);
                }, 1000);
                return () => clearTimeout(timer);
            }
        }, [query?.id]);

        const redirect = useCallback(() => {
            props.history.push('/app/user/pay?id=' + query?.id + '&payment_id=' + ++mockPayID);
        }, [query?.id]);
        useInterval(
            () => {
                setRedirectTime(redirectTime - 1);
                if (redirectTime === 0) {
                    redirect();
                    return;
                }
            },
            success ? 1000 : null
        );

        return (
            <React.Fragment>
                {success ? <div>支付成功..., {redirectTime}秒后返回</div> : <div>支付中...</div>}
            </React.Fragment>
        );
    };
}
