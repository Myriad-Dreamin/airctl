import * as React from 'react';
import { useEffect } from 'react';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import makeStyles from '@material-ui/core/styles/makeStyles';
import createStyles from '@material-ui/core/styles/createStyles';
import { Theme } from '@material-ui/core/styles/createMuiTheme';

import { Chart, registerShape } from '@antv/g2';
import MaterialTable from 'material-table';
import styles from '../../air/page/inspect.css';

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
                lineCap: 'round'
            }
        });
        group.addShape('circle', {
            attrs: {
                x: center.x,
                y: center.y,
                r: 2,
                stroke: cfg.color,
                lineWidth: 1,
                fill: '#fff'
            }
        });

        return group;
    }
});

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            flexGrow: 1
        },
        paper: {
            padding: theme.spacing(2),
            textAlign: 'center',
            color: theme.palette.text.secondary
        }
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
        padding: [0, 0, 30, 0]
    });

    if (totalValue % 3 == 0) {
        tickScale = totalValue / 3;
        scaledValue = actualValue;
        maxValue = totalValue;
        fmt = v => {
            return `${v}`;
        };
        chart.scale('value', {
            min: 0,
            max: totalValue,
            tickInterval: tickScale
        });
        chart.data([{ value: actualValue }]);
    } else if (totalValue % 5 == 0) {
        tickScale = totalValue / 5;
        scaledValue = actualValue;
        maxValue = totalValue;
        fmt = v => {
            return `${v}`;
        };
        chart.scale('value', {
            min: 0,
            max: maxValue,
            tickInterval: tickScale
        });
        chart.data([{ value: actualValue }]);
    } else {
        tickScale = totalValue / 10.0;
        scaledValue = actualValue / totalValue * 10;
        maxValue = 10;
        chart.scale('value', {
            min: 0,
            max: maxValue,
            tickInterval: 1
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
        radius: 0.75
    });

    chart.axis('1', false);
    chart.axis('value', {
        line: null,
        label: {
            offset: -10,
            style: {
                fontSize: 12,
                textAlign: 'center',
                textBaseline: 'middle'
            },

            formatter: fmt
        },
        subTickLine: {
            count: 4,
            length: -4
        },
        tickLine: {
            length: -6
        },
        grid: null
    });
    chart.legend(false);
    chart
        .point()
        .position('value*1')
        .shape('pointer')
        .color('#1890FF')
        .animate({
            appear: {
                animation: 'fade-in'
            }
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
            lineDash: null
        }
    });

// 绘制指标
    chart.annotation().arc({
        start: [0, 1],
        end: [scaledValue, 1],
        style: {
            stroke: '#1890FF',
            lineWidth: 3,
            lineDash: null
        }
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
            textAlign: 'center'
        },
        offsetY: 15
    });

    chart.render();
}


export function Dashboard() {
    return function() {
        const classes = useStyles();

        useEffect(() => {
            let connChart = document.getElementById('conn-chart');
            if (connChart === null) {
                return;
            }

            chartMain(connChart, 3, 1);

            let connChart2 = document.getElementById('conn-chart-2');
            if (connChart2 === null) {
                return;
            }
            chartMain(connChart2, 3, 2);
        }, []);

        let airState = {
            is_on: false,
            available: false,
            current_degree: 27.0
        };

        return <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
                <div style={{ display: 'flex', justifyContent: 'space-around', fontSize: '2vh' }}>
                    <div style={{ width: '20vh', textAlign: 'center' }}>
                        <p style={{ margin: '0', height: '5vh' }}>&nbsp;<br/>目前处理请求数</p>
                        <div style={{ width: '20vh', height: '20vh' }}>
                            <div id={'conn-chart'} style={{ margin: '0' }}/>
                        </div>
                    </div>
                    <div style={{ width: '20vh', textAlign: 'center' }}>
                        <p style={{ margin: '0', height: '5vh' }}>最近5分钟<br/>最大处理请求数</p>
                        <div style={{ width: '20vh', height: '20vh' }}>
                            <div id={'conn-chart-2'} style={{ margin: '0' }}/>
                        </div>
                    </div>
                </div>
            </Grid>
            <Grid item xs={12} sm={6}>
                <Paper className={classes.paper} style={{ 'height': '25vh' }}>实时性能监测图<br/>（敬请期待）</Paper>
            </Grid>
            <Grid item xs={12} sm={6}>
                <MaterialTable
                    title={''}
                    columns={[
                        { title: 'ID', field: 'id' },
                        { title: 'RoomID', field: 'name' },
                        { title: 'Status', field: 'status' }
                        // {
                        //     title: 'Birth Place',
                        //     field: 'birthCity',
                        //     lookup: { 34: 'İstanbul', 63: 'Şanlıurfa' },
                        // },
                    ]}
                    data={[]}
                    actions={[
                        {
                            icon: 'more_vert',
                            tooltip: 'Inspect User',
                            onClick: (event: any, rowData: any[]) => {
                                console.log(event);
                                // if (rowData instanceof Array) {
                                // } else {
                                //     props.history.push(`/app/user/profile?id=${rowData.id}`);
                                // }
                            }
                        }
                    ]}
                    options={{
                        sorting: true,
                        actionsColumnIndex: -1,
                        toolbar: false
                    }}
                />
            </Grid>
            <Grid item xs={12} sm={6}>
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
                        <span>空调状态</span>
                    </div>
                    <table className={styles['form-item-table']}>
                        <tbody>
                        <tr>
                            <td colSpan={1}>当前是否开启：{airState?.is_on ? '是' : '否'}</td>
                            <td colSpan={1}>当前是否可用：{airState?.available ? '是' : '否'}</td>
                        </tr>
                        <tr>
                            <td colSpan={1}>当前空调温度：{airState?.current_degree}℃</td>
                            <td colSpan={1}/>
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
        </Grid>;
    };
}
