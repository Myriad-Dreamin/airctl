import * as React from 'react';
import { FormEvent, useCallback, useState } from 'react';
import { DependencyContainer } from '../../../lib/common';
import { InfoCircleOutlined } from '@ant-design/icons';
import styles from './register.css';
import { Tooltip } from 'antd';
import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { ButtonGroup } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import { TextField, useFormData } from '../../../component/form';

function RadioButtonGroup(props: {
    currentValue: string;
    onValueChanged?: (v: string) => void;
    groupDesc: { value: string; content: string }[];
}) {
    // const handleBG = useCallback(, [props.onValueChanged]);

    return (
        <ButtonGroup size="small" aria-label="small outlined button group">
            {props.groupDesc.map((item) => (
                <Button
                    key={item.value}
                    value={item.value}
                    style={{
                        background: item.value === props.currentValue ? '#f0f0f0' : 'transparent',
                        padding: '2px 5px',
                        textTransform: 'unset',
                        fontWeight: 'bold',
                    }}
                    onClick={(e: FormEvent<{ value: string }>) => {
                        if (props.onValueChanged) {
                            props.onValueChanged(e.currentTarget.value);
                        }
                    }}
                >
                    {item.content}
                </Button>
            ))}
        </ButtonGroup>
    );
}

function notNull(value: string) {
    if (value === '') {
        return 'required';
    }
    return undefined;
}

export function UserRegisterForm({ userService }: DependencyContainer) {
    return function () {
        const theme = useTheme();
        const matches = useMediaQuery(theme.breakpoints.up('sm'));

        const formController = useFormData(
            { phone_number: '', first_name: '', last_name: '', room_number: '', identity: '' },
            {
                phone_number: notNull,
                first_name: notNull,
            }
        );

        const onFinish = useCallback(
            (event: React.FormEvent) => {
                event.preventDefault();
                console.log(event);
                console.log(formController);
                // matchResponse(userService.Register(values), console.log, console.error)
            },
            [formController]
        );

        const formPN = (
            <div className={matches ? styles['cell-11'] : styles['cell-24']}>
                <div className={styles['label']}>
                    Phone Number
                    <span className={styles['tip']}>
                        <Tooltip placement="right" title="to distinguish users">
                            <InfoCircleOutlined />
                        </Tooltip>
                    </span>{' '}
                </div>
                <TextField controller={formController} field="phone_number" />
            </div>
        );

        const formRN = (
            <div className={matches ? styles['cell-11'] : styles['cell-24']}>
                <div className={styles['label']}>
                    Room Number
                    <span className={styles['tip']}>
                        <Tooltip
                            placement="right"
                            title="in form of 'A~D' 8 'floor number' 'id', e.g. B8702 (you can also input b8702 for convenience) "
                        >
                            <InfoCircleOutlined />
                        </Tooltip>
                    </span>{' '}
                </div>
                <TextField controller={formController} field="room_number" />
            </div>
        );

        const formLN = (
            <div className={matches ? styles['cell-5'] : styles['cell-11']}>
                <div className={styles['label']}>Last Name</div>
                <TextField controller={formController} field="last_name" />
            </div>
        );

        const formFN = (
            <div className={matches ? styles['cell-5'] : styles['cell-11']}>
                <div className={styles['label']}>First Name</div>
                <TextField controller={formController} field="first_name" />
            </div>
        );

        const options: { value: string; content: string }[] = [
            { value: 'i', content: 'ID Card' },
            { value: 'p', content: 'Passport' },
        ];

        const [currentIN, setCurrentIN] = useState('i');

        const handleINChanged = useCallback((value: string) => {
            console.log(value);
            setCurrentIN(value);
        }, []);

        const formIN = (
            <div className={matches ? styles['cell-11'] : styles['cell-24']}>
                <div className={styles['label']}>
                    <RadioButtonGroup groupDesc={options} currentValue={currentIN} onValueChanged={handleINChanged} />{' '}
                    Number
                </div>
                <TextField controller={formController} field="identity" />
            </div>
        );

        const submitButton = (
            <Button
                variant="outlined"
                color="primary"
                style={{
                    float: matches ? 'right' : 'unset',
                    margin: 'auto 0',
                    marginRight: '3vw',
                }}
                type="submit"
            >
                Submit
            </Button>
        );

        return (
            // onFinishFailed={onFinishFailed}
            <div style={{ width: '100%' }}>
                <form className={styles['form-container']} onSubmit={onFinish}>
                    <div className={styles['form-title']}>
                        Register a temporary account
                        {matches && submitButton}
                    </div>
                    {formPN}
                    {matches && <div className={styles['cell-2']}>&nbsp;</div>}
                    {formRN}
                    {formLN}
                    <div className={matches ? styles['cell-1'] : styles['cell-2']}>&nbsp;</div>
                    {formFN}
                    {matches && <div className={styles['cell-2']}>&nbsp;</div>}
                    {formIN}
                    {/*<div className={styles['submit'] + ' ' + styles['cell-24']}></div>*/}
                    {!matches && <div style={{ textAlign: 'center' }}>{submitButton}</div>}
                </form>
            </div>
        );
    };
}
