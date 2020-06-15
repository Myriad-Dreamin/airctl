import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { CSSProperties } from '@material-ui/core/styles/withStyles';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';

import { DependencyContainer } from '../lib/common';
import { TextField } from '../component/form';
import { context } from '../context';
import { useLoginFormData } from './welcome-form';

// css表
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

// Welcome组件
export function Welcome({ daemonAdminService }: DependencyContainer) {
    return function (props: RouteComponentProps) {
        if (context.Cookie.get('admin_token')) {
            props.history.push(`/app/overview/dashboard`);
        }

        const classes = useStyles();
        const { formController, onFinish } = useLoginFormData(daemonAdminService, props.history.push);

        // noinspection HtmlUnknownAnchorTarget
        return (
            <div className={classes.mainContainer}>
                <form onSubmit={onFinish}>
                    <div className={classes.centerDiv}>
                        <Paper className={classes.paper + ' ' + classes.loginContainer}>
                            <div className={classes.title}>Please Input the Admin Token for Logining</div>
                            <div className={classes.adminTokenField}>
                                <TextField controller={formController} field="admin_token" />
                            </div>
                        </Paper>
                    </div>
                    <div className={classes.centerDiv}>
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
                    </div>
                </form>
            </div>
        );
    };
}
