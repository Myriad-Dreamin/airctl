import * as React from 'react';
import { useCallback, useEffect, useState } from 'react';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import makeStyles from '@material-ui/core/styles/makeStyles';
import createStyles from '@material-ui/core/styles/createStyles';
import { Theme } from '@material-ui/core/styles/createMuiTheme';

import { Chart, registerShape } from '@antv/g2';
import MaterialTable from 'material-table';
import styles from '../../air/page/inspect.css';
import { DependencyContainer } from '../../../lib/common';
import { matchResponse } from '../../../dependency/protocol';
import { Connection, Mode } from '../../../dependency/x-service-concept';
import { RouteComponentProps } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import { TextField, useFormData } from '../../../component/form';
import { context } from '../../../context';

// 自定义Shape 部分
registerShape('point', 'pointer', {
    draw(cfg, container) {
        const group = container.addGroup();
        const center = (this as any).parsePoint({ x: 0, y: 0 }); // 获取极坐标系下画布中心点
        // 绘制指针
        group.addShape('line', {
            attrs: {
                x1: center.x,
                y1: center.y,
                x2: cfg.x,
                y2: cfg.y,
                stroke: cfg.color,
                lineWidth: 1,
                lineCap: 'round',
            },
        });
        group.addShape('circle', {
            attrs: {
                x: center.x,
                y: center.y,
                r: 2,
                stroke: cfg.color,
                lineWidth: 1,
                fill: '#fff',
            },
        });

        return group;
    },
});

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

function chartMain(hook: HTMLElement, totalValue: number, actualValue: number) {
    let fmt: (v: unknown) => {};
    let tickScale: number;
    let scaledValue: number;
    let maxValue: number;
    const chart = new Chart({
        container: hook,
        autoFit: true,
        padding: [0, 0, 30, 0],
    });

    if (totalValue % 3 == 0) {
        tickScale = totalValue / 3;
        scaledValue = actualValue;
        maxValue = totalValue;
        fmt = (v) => {
            return `${v}`;
        };
        chart.scale('value', {
            min: 0,
            max: totalValue,
            tickInterval: tickScale,
        });
        chart.data([{ value: actualValue }]);
    } else if (totalValue % 5 == 0) {
        tickScale = totalValue / 5;
        scaledValue = actualValue;
        maxValue = totalValue;
        fmt = (v) => {
            return `${v}`;
        };
        chart.scale('value', {
            min: 0,
            max: maxValue,
            tickInterval: tickScale,
        });
        chart.data([{ value: actualValue }]);
    } else {
        tickScale = totalValue / 10.0;
        scaledValue = (actualValue / totalValue) * 10;
        maxValue = 10;
        chart.scale('value', {
            min: 0,
            max: maxValue,
            tickInterval: 1,
        });
        fmt = (v: unknown) => {
            if ((v as number) & 1) {
                return '';
            }
            return `${((v as number) * tickScale).toFixed(1)}`;
        };
        chart.data([{ value: scaledValue }]);
    }
    chart.coordinate('polar', {
        startAngle: (-9 / 8) * Math.PI,
        endAngle: (1 / 8) * Math.PI,
        radius: 0.75,
    });

    chart.axis('1', false);
    chart.axis('value', {
        line: null,
        label: {
            offset: -10,
            style: {
                fontSize: 12,
                textAlign: 'center',
                textBaseline: 'middle',
            },

            formatter: fmt,
        },
        subTickLine: {
            count: 4,
            length: -4,
        },
        tickLine: {
            length: -6,
        },
        grid: null,
    });
    chart.legend(false);
    chart
        .point()
        .position('value*1')
        .shape('pointer')
        .color('#1890FF')
        .animate({
            appear: {
                animation: 'fade-in',
            },
        });

    // 绘制仪表盘背景
    chart.annotation().arc({
        top: false,
        start: [0, 1],
        end: [maxValue, 1],
        style: {
            // 底灰色
            stroke: '#CBCBCB',
            lineWidth: 3,
            lineDash: null,
        },
    });

    // 绘制指标
    chart.annotation().arc({
        start: [0, 1],
        end: [scaledValue, 1],
        style: {
            stroke: '#1890FF',
            lineWidth: 3,
            lineDash: null,
        },
    });
    // 绘制指标数字
    //     chart.annotation().text({
    //         position: ['50%', '85%'],
    //         content: '合格率',
    //         style: {
    //             fontSize: 20,
    //             fill: '#545454',
    //             textAlign: 'center',
    //         },
    //     });
    chart.annotation().text({
        position: ['50%', '90%'],
        content: actualValue + '',
        style: {
            fontSize: 10,
            fill: '#545454',
            textAlign: 'center',
        },
        offsetY: 15,
    });

    chart.render();
}

function checkDegree(deg: string) {
    if (deg === '') {
        return 'required';
    }
    if (isNaN(parseFloat(deg))) {
        return 'not a valid float number';
    }
    return;
}

function checkMode(mode: string) {
    if (mode === '') {
        return 'required';
    }
    if (mode !== 'heat' && mode !== 'cool') {
        return '\'heat\' or \'cool\' value required';
    }
    return;
}

function checkDelay(delay: string) {
    if (delay === '') {
        return 'required';
    }
    console.log(isNaN(parseInt(delay)));
    if (isNaN(parseInt(delay))) {
        return 'not a valid integer number';
    }
    return;
}

export function Dashboard({ daemonAdminService, adminService }: DependencyContainer) {
    return function (props: RouteComponentProps) {
        const classes = useStyles();
        const { I18nContext: i18n } = context;
        const dashboard = i18n.statics.global.dashboard;

        const [airState, setAirState] = useState<{
            is_on: boolean;
            available: boolean;
            current_degree: number;
            metrics_delay: number;
            update_delay: number;
            mode: Mode;
            work_state: string;
        }>({
            is_on: false,
            available: false,
            current_degree: 27.0,
            metrics_delay: 0,
            update_delay: 0,
            mode: 'heat',
            work_state: 'unknown',
        });
        const [edit, setEditing] = useState(false);

        const formController = useFormData(
            {
                current_degree: airState.current_degree,
                mode: airState.mode,
                metrics_delay: airState.metrics_delay,
                update_delay: airState.update_delay,
            },
            {
                current_degree: checkDegree,
                mode: checkMode,
                metrics_delay: checkDelay,
                update_delay: checkDelay,
            }
        );

        const onSave = useCallback(() => {
            if (formController.state.current_degree !== airState.current_degree) {
                console.log(formController.state.current_degree, airState.current_degree);
                adminService
                    .SetCurrentTemperature(formController.state.current_degree)
                    .then((resp) => {
                        matchResponse(resp, () =>
                            setAirState((state) => {
                                state.current_degree = formController.state.current_degree;
                                return { ...state };
                            })
                        );
                    })
                    .catch(console.error);
            }

            if (formController.state.mode !== airState.mode) {
                console.log(formController.state.mode, airState.mode);
                adminService
                    .SetMode(formController.state.mode)
                    .then((resp) => {
                        matchResponse(resp, () =>
                            setAirState((state) => {
                                state.mode = formController.state.mode;
                                return { ...state };
                            })
                        );
                    })
                    .catch(console.error);
            }

            if (formController.state.metrics_delay !== airState.metrics_delay) {
                console.log(formController.state.metrics_delay, airState.metrics_delay);
            }

            if (formController.state.update_delay !== airState.update_delay) {
                console.log(formController.state.update_delay, airState.update_delay);
            }
            setEditing(false);
        }, [formController, airState]);

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
                            state.is_on = true;
                            return { ...state };
                        });
                    });
                })
                .catch((err) => {
                    setAirState((state) => {
                        state.is_on = false;
                        return { ...state };
                    });
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
                                    return { ...state };
                                });
                            });
                        })
                        .catch(console.error);
                })
                .catch((err) => {
                    setAirState((state) => {
                        state.available = false;
                        return { ...state };
                    });
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
                console.log(resp);
                return {
                    data: resp.data,
                    page: 1,
                    totalCount: 10,
                };
            });
        }, []);

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
                                        {dashboard.daemon_open_label}
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
                                    <td colSpan={1} />
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
