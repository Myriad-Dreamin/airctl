import * as React from 'react';
import { DependencyContainer } from '../../../lib/common';
import { InfoCircleOutlined } from '@ant-design/icons';
import styles from './register.css';
import { Tooltip } from 'antd';
import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { ButtonGroup, TextField } from '@material-ui/core';
import Button from '@material-ui/core/Button';

const groupButtonStyle = {
    padding: '2px 5px',
    textTransform: 'unset',
    fontWeight: 'bold',
};


export function UserRegisterForm({ userService }: DependencyContainer) {
    return function () {
        const theme = useTheme();
        const matches = useMediaQuery(theme.breakpoints.up('sm'));

        // const onFinish = useCallback(
        //     (values: any) => matchResponse(userService.Register(values), console.log, console.error),
        //     []
        // );

        console.log(matches);

        const formPN = <div className={matches?styles['cell-11']:styles['cell-24']}>
            <div className={styles['label']}>
                Phone Number
                <span className={styles['tip']}>
                                            <Tooltip placement="right" title="to distinguish users">
                                                <InfoCircleOutlined />
                                            </Tooltip>
                                        </span>{' '}
            </div>
            <TextField id="standard-basic" style={{width: '100%'}} />
        </div>;

        const formRN = <div className={matches?styles['cell-11']:styles['cell-24']}>
            <div className={styles['label']}>
                Room Number
                <span className={styles['tip']}>
                                            <Tooltip placement="right" title="in form of 'A~D' 8 'floor number' 'id', e.g. B8702 (you can also input b8702 for convenience) ">
                                                <InfoCircleOutlined />
                                            </Tooltip>
                                        </span>{' '}
            </div>
            <TextField id="standard-basic" style={{width: '100%'}} />
        </div>;

        const formLN = <div className={matches?styles['cell-5']:styles['cell-11']}>
            <div className={styles['label']}>Last Name</div>
            <TextField id="standard-basic" style={{width: '100%'}} />
        </div>;

        const formFN = <div className={matches?styles['cell-5']:styles['cell-11']}>
            <div className={styles['label']}>First Name</div>
            <TextField id="standard-basic" style={{width: '100%'}} />
        </div>;

        const formIN = <div className={matches?styles['cell-11']:styles['cell-24']}>
            <div className={styles['label']}>
                <ButtonGroup size="small" aria-label="small outlined button group">
                    <Button style={groupButtonStyle}>ID Card</Button>
                    <Button style={groupButtonStyle}>Passport</Button>
                </ButtonGroup> Number
            </div>
            <TextField id="standard-basic" style={{width: '100%'}} />
        </div>;

        const submitButton = <Button variant="outlined" color="primary" style={{
            float: matches? 'right': 'unset', margin: 'auto 0', marginRight: '3vw'}}>
            Submit
        </Button>;

        return (
            // onFinishFailed={onFinishFailed}
            <div style={{ width: '100%' }}>
                <div className={styles['form-title']}>Register a temporary account
                    {matches && submitButton}
                </div>
                <div className={styles['form-container']}>
                    {formPN}
                    {matches && <div className={styles['cell-2']}>&nbsp;</div>}
                    {formRN}
                    {formLN}
                    <div className={matches?styles['cell-1']:styles['cell-2']}>&nbsp;</div>
                    {formFN}
                    {matches && <div className={styles['cell-2']}>&nbsp;</div>}
                    {formIN}
                    <div className={styles['submit'] +  ' ' + styles['cell-24']}>

                    </div>
                </div>
                {!matches && <div style={{textAlign: 'center'}}>{submitButton}</div>}
            </div>
        );
    };
}
