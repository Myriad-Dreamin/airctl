import * as React from 'react';
import { useCallback, useEffect, useState } from 'react';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import makeStyles from '@material-ui/core/styles/makeStyles';
import createStyles from '@material-ui/core/styles/createStyles';
import { Theme } from '@material-ui/core/styles/createMuiTheme';

import MaterialTable from 'material-table';
import styles from '../../air/page/inspect.css';
import { DependencyContainer } from '../../../lib/common';
import { matchResponse, unwrap } from '../../../dependency/protocol';
import { Connection } from '../../../dependency/x-service-concept';
import { RouteComponentProps } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import { TextField } from '../../../component/form';
import { context } from '../../../context';
import { chartMain } from './dashboard-chart';
import { DashboardAirState, useDashboardFormController, useOnSave } from './dashboard-form';
import { reportErrorE } from '../../../component/notify';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            flexGrow: 1,
        },
        paper: {
            padding: theme.spacing(2),
            textAlign: 'center',
            color: theme.palette.text.secondary,
        },
    })
);

export function Dashboard({ daemonAdminService, adminService }: DependencyContainer) {
    return function (props: RouteComponentProps) {
        const classes = useStyles();
        const { I18nContext: i18n } = context;
        const dashboard = i18n.statics.global.dashboard;

        const [airState, setAirState] = useState<DashboardAirState>({
            is_on: false,
            available: false,
            daemon_available: false,
            current_degree: 27.0,
            metrics_delay: 0,
            update_delay: 0,
            mode: 'heat',
            work_state: 'unknown',
        });

        const [edit, setEditing] = useState(false);
        const formController = useDashboardFormController(airState);

        const onSave = useOnSave(formController, adminService, airState, setAirState, setEditing);

        const swapEdit = useCallback(() => {
            setEditing((e) => {
                if (!e) {
                    formController.dispatch([
                        'all',
                        {
                            current_degree: airState.current_degree,
                            mode: airState.mode,
                            metrics_delay: airState.metrics_delay,
                            update_delay: airState.update_delay,
                        },
                    ]);
                }
                return !e;
            });
        }, [airState]);

        useEffect(() => {
            daemonAdminService
                .Ping()
                .then(async (resp) => {
                    matchResponse(resp, () => {
                        setAirState((state) => {
                            state.daemon_available = true;
                            return { ...state };
                        });
                    });
                })
                .catch((err) => {
                    setAirState((state) => {
                        state.daemon_available = false;
                        return { ...state };
                    });
                    reportErrorE(err);
                });

            adminService
                .Ping()
                .then(async (resp) => {
                    matchResponse(resp, () => {
                        setAirState((state) => {
                            state.available = true;
                            return { ...state };
                        });
                    });
                    await adminService
                        .GetServerStatus()
                        .then(async (resp) => {
                            matchResponse(resp, (data) => {
                                setAirState((state) => {
                                    state.current_degree = data.current_temperature;
                                    state.metrics_delay = data.metric_delay;
                                    state.update_delay = data.update_delay;
                                    state.mode = data.mode;
                                    state.work_state = data.work_state;
                                    state.is_on = data.is_boot;
                                    return { ...state };
                                });
                            });
                        })
                        .catch(reportErrorE);
                })
                .catch((err) => {
                    setAirState((state) => {
                        state.available = false;
                        return { ...state };
                    });
                    reportErrorE(err);
                });

            const connChart = document.getElementById('conn-chart');
            if (connChart === null) {
                return;
            }

            chartMain(connChart, 3, 1);

            const connChart2 = document.getElementById('conn-chart-2');
            if (connChart2 === null) {
                return;
            }
            chartMain(connChart2, 3, 2);
        }, []);

        const queryHandler = useCallback((query) => {
            return adminService.GetConnectedSlaves(query.page + 1, query.pageSize).then((resp) => {
                return adminService.GetRoomCount().then((resp2) => {
                    return {
                        data: resp.data,
                        page: query.page,
                        totalCount: unwrap(resp2),
                    };
                });
            });
        }, []);

        const onSetBoot = useCallback(() => {
            if (airState.is_on) {
                adminService
                    .ShutdownMaster()
                    .then((resp) => {
                        matchResponse(resp, () =>
                            setAirState((state) => {
                                state.is_on = false;
                                return { ...state };
                            })
                        );
                    })
                    .catch(reportErrorE);
            } else {
                adminService
                    .BootMaster()
                    .then((resp) => {
                        matchResponse(resp, () =>
                            setAirState((state) => {
                                state.is_on = true;
                                return { ...state };
                            })
                        );
                    })
                    .catch(reportErrorE);
            }
        }, [airState.is_on]);

        return (
            <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                    <div style={{ display: 'flex', justifyContent: 'space-around', fontSize: '2vh' }}>
                        <div style={{ width: '20vh', textAlign: 'center' }}>
                            <p style={{ margin: '0', height: '5vh' }}>
                                &nbsp;
                                <br />
                                {dashboard.current_connection_cnt}
                            </p>
                            <div style={{ width: '20vh', height: '20vh' }}>
                                <div id={'conn-chart'} style={{ margin: '0' }} />
                            </div>
                        </div>
                        <div style={{ width: '20vh', textAlign: 'center' }}>
                            <p style={{ margin: '0', height: '5vh' }}>
                                {dashboard.max_connection_cnt_seg_1}
                                <br />
                                {dashboard.max_connection_cnt_seg_2}
                            </p>
                            <div style={{ width: '20vh', height: '20vh' }}>
                                <div id={'conn-chart-2'} style={{ margin: '0' }} />
                            </div>
                        </div>
                    </div>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Paper className={classes.paper} style={{ height: '25vh' }}>
                        {dashboard.real_time_performance_graph}
                        <br />
                        {dashboard.incoming}
                    </Paper>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <MaterialTable
                        localization={i18n.statics.global.material_table_localization}
                        title={''}
                        columns={[
                            { title: dashboard.room_inc_id, field: 'id' },
                            { title: dashboard.room_id, field: 'room_id' },
                            { title: dashboard.slave_connected, field: 'connected' },
                            // {
                            //     title: 'Birth Place',
                            //     field: 'birthCity',
                            //     lookup: { 34: 'İstanbul', 63: 'Şanlıurfa' },
                            // },
                        ]}
                        data={queryHandler}
                        actions={[
                            {
                                icon: 'more_vert',
                                tooltip: dashboard.inspect_slave_tooltip,
                                onClick: (
                                    _: any,
                                    rowData:
                                        | Pick<Connection, 'id' | 'room_id' | 'connected'>
                                        | Pick<Connection, 'id' | 'room_id' | 'connected'>[]
                                ) => {
                                    if (rowData instanceof Array) {
                                    } else {
                                        props.history.push(`/app/room/inspect?id=${rowData.id}`);
                                    }
                                },
                            },
                            {
                                icon: 'assessment',
                                tooltip: dashboard.report_slave_tooltip,
                                onClick: (
                                    _: any,
                                    rowData:
                                        | Pick<Connection, 'id' | 'room_id' | 'connected'>
                                        | Pick<Connection, 'id' | 'room_id' | 'connected'>[]
                                ) => {
                                    if (rowData instanceof Array) {
                                    } else {
                                        props.history.push(`/app/room/report?id=${rowData.id}`);
                                    }
                                },
                            },
                        ]}
                        options={{
                            sorting: true,
                            actionsColumnIndex: -1,
                            toolbar: false,
                        }}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <div>
                        <Button
                            variant="outlined"
                            color="primary"
                            onClick={swapEdit}
                            type="button"
                            style={{
                                marginRight: '1em',
                                float: 'right',
                            }}
                        >
                            {edit ? 'Cancel' : 'Edit'}
                        </Button>
                        {edit && (
                            <Button
                                variant="outlined"
                                color="primary"
                                onClick={onSave}
                                type="button"
                                style={{
                                    marginRight: '1em',
                                    float: 'right',
                                }}
                            >
                                Save
                            </Button>
                        )}
                    </div>
                    <div style={{ clear: 'both' }} />
                    <Paper className={classes.paper}>
                        <div className={styles['form-sub-title']}>
                            <span
                                style={{
                                    background: airState?.is_on
                                        ? '#52c41a'
                                        : airState?.available
                                        ? '#f5222d'
                                        : '#d9d9d9',
                                    marginRight: '0.5em',
                                }}
                                className={styles['state-dot']}
                            >
                                &nbsp;
                            </span>
                            <span>{dashboard.master_state_title}</span>
                        </div>
                        <table className={styles['form-item-table']}>
                            <tbody>
                                <tr>
                                    <td colSpan={1}>
                                        {dashboard.server_open_label}
                                        {airState?.is_on
                                            ? i18n.statics.global.general.yes
                                            : i18n.statics.global.general.no}
                                    </td>
                                    <td colSpan={1}>
                                        {dashboard.server_available_label}
                                        {airState?.available
                                            ? i18n.statics.global.general.yes
                                            : i18n.statics.global.general.no}
                                    </td>
                                </tr>
                                <tr>
                                    <td colSpan={1}>
                                        {dashboard.master_working_state_label}
                                        {airState?.work_state}
                                    </td>
                                    <td colSpan={1}>
                                        {dashboard.daemon_open_label}
                                        {airState?.daemon_available
                                            ? i18n.statics.global.general.yes
                                            : i18n.statics.global.general.no}
                                    </td>
                                </tr>
                                <tr>
                                    {edit ? (
                                        <td colSpan={1}>
                                            {dashboard.set_current_temperature_label}
                                            <TextField
                                                style={{ minHeight: '60px', width: '80%' }}
                                                controller={formController}
                                                field="current_degree"
                                            />
                                        </td>
                                    ) : (
                                        <td colSpan={1}>
                                            {dashboard.current_temperature_label}
                                            {airState?.current_degree}℃
                                        </td>
                                    )}
                                    {edit ? (
                                        <td colSpan={1}>
                                            {dashboard.set_current_air_mode}
                                            <TextField
                                                style={{ minHeight: '60px', width: '80%' }}
                                                controller={formController}
                                                field="mode"
                                            />
                                        </td>
                                    ) : (
                                        <td colSpan={1}>
                                            {dashboard.current_air_mode}
                                            {airState?.mode}
                                        </td>
                                    )}
                                </tr>
                                <tr>
                                    {edit ? (
                                        <td colSpan={1}>
                                            {dashboard.set_slave_push_metrics_delay_label}
                                            <TextField
                                                style={{ minHeight: '60px', width: '80%' }}
                                                controller={formController}
                                                field="metrics_delay"
                                            />
                                        </td>
                                    ) : (
                                        <td colSpan={1}>
                                            {dashboard.slave_push_metrics_delay_label}
                                            {airState?.metrics_delay}
                                        </td>
                                    )}
                                    {edit ? (
                                        <td colSpan={1}>
                                            {dashboard.set_slave_update_statistics_delay_label}
                                            <TextField
                                                style={{ minHeight: '60px', width: '80%' }}
                                                controller={formController}
                                                field="update_delay"
                                            />
                                        </td>
                                    ) : (
                                        <td colSpan={1}>
                                            {dashboard.slave_update_statistics_delay_label}
                                            {airState?.update_delay}
                                        </td>
                                    )}
                                </tr>
                            </tbody>
                        </table>
                    </Paper>
                    <Button
                        variant="outlined"
                        color="primary"
                        onClick={onSetBoot}
                        type="button"
                        style={{
                            marginRight: '1em',
                            float: 'right',
                        }}
                    >
                        {airState?.is_on ? '关机' : '开机'}
                    </Button>
                </Grid>
                {/*<Grid item xs={6} sm={3}>*/}
                {/*    <Paper className={classes.paper}>xs=6 sm=3</Paper>*/}
                {/*</Grid>*/}
                {/*<Grid item xs={6} sm={3}>*/}
                {/*    <Paper className={classes.paper}>xs=6 sm=3</Paper>*/}
                {/*</Grid>*/}
                {/*<Grid item xs={6} sm={3}>*/}
                {/*    <Paper className={classes.paper}>xs=6 sm=3</Paper>*/}
                {/*</Grid>*/}
                {/*<Grid item xs={6} sm={3}>*/}
                {/*    <Paper className={classes.paper}>xs=6 sm=3</Paper>*/}
                {/*</Grid>*/}
            </Grid>
        );
    };
}
