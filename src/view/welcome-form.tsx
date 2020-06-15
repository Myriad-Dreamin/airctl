import { useFormData } from '../component/form';
import { default as React, useCallback } from 'react';
import { matchResponse } from '../dependency/protocol';
import { context } from '../context';
import { DaemonAdminService } from '../dependency/x-service-concept';
import { reportErrorE } from '../component/notify';

function notNull(value: string) {
    if (value === '') {
        return 'required';
    }
    return undefined;
}

// 提供login-form容器和方法
export function useLoginFormData(daemonAdminService: DaemonAdminService, redirect: (path: string) => void) {
    const formController = useFormData(
        { admin_token: '' },
        {
            admin_token: notNull,
        }
    );

    const onFinish = useCallback(
        async (event: React.FormEvent) => {
            event.preventDefault();
            if (!formController.ok) {
                return;
            }
            matchResponse<string>(
                await daemonAdminService.AdminLogin(formController.state.admin_token),
                (jwt_token) => {
                    context.dispatchToken(jwt_token);
                    redirect(`/app/overview/dashboard`);
                },
                reportErrorE
            );
        },
        [formController]
    );

    return { formController, onFinish };
}
