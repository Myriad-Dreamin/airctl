import * as React from 'react';
import { useCallback } from 'react';
// import { Link } from 'react-router-dom';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import { CSSProperties } from '@material-ui/core/styles/withStyles';
import { TextField, useFormData } from '../component/form';
import Button from '@material-ui/core/Button';
import { DependencyContainer } from '../lib/common';
import { matchResponse } from '../dependency/protocol';

import { context } from '../context';
import { RouteComponentProps } from 'react-router-dom';

const useStyles = makeStyles((theme: Theme) => {
    const style: { [index: string]: CSSProperties } = {
        root: {
            flexGrow: 1,
        },
        paper: {
            padding: theme.spacing(2),
            textAlign: 'center',
            color: theme.palette.text.secondary,
        },
        loginContainer: {
            width: '60vw',
            height: '150px',
            marginTop: '20vh',
        },
        mainContainer: {
            height: '100vh',
        },
        centerDiv: {
            display: 'flex',
            justifyContent: 'space-around',
        },
        title: {},
        adminTokenField: {
            margin: '40px 0',
        },
    };

    return createStyles(style);
});

function notNull(value: string) {
    if (value === '') {
        return 'required';
    }
    return undefined;
}

export function Welcome({daemonAdminService}: DependencyContainer) {
    return function(props: RouteComponentProps) {
        if (context.Cookie.get('admin_token')) {
            props.history.push(`/app/overview/dashboard`);
        }


        const classes = useStyles();
        const formController = useFormData(
            { admin_token: '' },
            {
                admin_token: notNull,
            }
        );

        const submitButton = (
            <Button
                variant="outlined"
                color="primary"
                style={{
                    marginTop: '2vh',
                    width: '60vw',
                }}
                type="submit"
            >
                Submit
            </Button>
        );

        const onFinish = useCallback(
            async (event: React.FormEvent) => {
                event.preventDefault();
                if (!formController.ok) {
                    return;
                }
                matchResponse<string>(await daemonAdminService.AdminLogin(formController.state.admin_token), (jwt_token) => {
                    context.dispatchToken(jwt_token);
                    console.log(props.location);
                    props.history.push(`/app/overview/dashboard`);
                }, console.error);
            },
            [formController]
        );

        // noinspection HtmlUnknownAnchorTarget
        return (
            <div className={classes.mainContainer}>
                {/*Welcome To&nbsp;*/}
                {/*<Link to="/app">AirControlSys</Link>*/}
                <form onSubmit={onFinish}>
                    <div className={classes.centerDiv}>
                        <Paper className={classes.paper + ' ' + classes.loginContainer}>
                            <div className={classes.title}>Please Input the Admin Token for Logining</div>
                            <div className={classes.adminTokenField}>
                                <TextField controller={formController} field="admin_token" />
                            </div>
                        </Paper>
                    </div>
                    <div className={classes.centerDiv}>{submitButton}</div>
                </form>
            </div>
        );
    }
}
