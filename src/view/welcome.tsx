import * as React from 'react';
import { useCallback } from 'react';
// import { Link } from 'react-router-dom';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import { CSSProperties } from '@material-ui/core/styles/withStyles';
import { TextField, useFormData } from '../component/form';
import Button from '@material-ui/core/Button';


const useStyles = makeStyles((theme: Theme) => {
        let style: { [index: string]: CSSProperties } = {
            root: {
                flexGrow: 1
            },
            paper: {
                padding: theme.spacing(2),
                textAlign: 'center',
                color: theme.palette.text.secondary
            },
            loginContainer: {
                width: '60vw',
                height: '150px',
                marginTop: '20vh'
            },
            mainContainer: {
                height: '100vh'
            },
            centerDiv: {
                display: 'flex',
                justifyContent: 'space-around'
            },
            title: {},
            adminTokenField: {
                margin: '40px 0'
            }
        };

        return createStyles(style);
    }
);

function notNull(value: string) {
    if (value === '') {
        return 'required';
    }
    return undefined;
}

export function Welcome() {
    const classes = useStyles();
    const formController = useFormData(
        { admin_token: '' },
        {
            admin_token: notNull
        }
    );

    const submitButton = <Button
        variant="outlined"
        color="primary"
        style={{
            marginTop: '2vh',
            width: '60vw'
        }}
        type="submit"
    >
        Submit
    </Button>;

    const onFinish = useCallback(
        (event: React.FormEvent) => {
            event.preventDefault();
            console.log(event);
            console.log(formController);
            // matchResponse(userService.Register(values), console.log, console.error)
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
                            <TextField controller={formController} field="admin_token"/>
                        </div>
                    </Paper>
                </div>
                <div className={classes.centerDiv}>
                    {submitButton}
                </div>
            </form>
        </div>
    );
}
