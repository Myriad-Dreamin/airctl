import { DependencyContainer } from '../../../lib/common';
import { RouteComponentProps } from 'react-router-dom';
import React, { useCallback, useEffect, useState } from 'react';
import Button from '@material-ui/core/Button';
import MaterialTable from 'material-table';
import { context } from '../../../context';
import { Report, ReportType, SlaveStatistics } from '../../../dependency/x-service-concept';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { Theme } from '@material-ui/core/styles/createMuiTheme';
import createStyles from '@material-ui/core/styles/createStyles';
import { matchResponse } from '../../../dependency/protocol';
import styles from './inspect.css';
import { ButtonGroup, Paper } from '@material-ui/core';
import queryString from 'query-string';
import { reportError, reportErrorC } from '../../../component/notify';

interface QueryState {
    id?: string;
    raw?: string;
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        title: {
            textAlign: 'center',
            marginBottom: '20px',
            fontWeight: 700,
            fontSize: '16px',
            lineHeight: 1.5715,
        },
        paper: {
            padding: theme.spacing(2),
            textAlign: 'center',
            color: theme.palette.text.secondary,
        },
    })
);

export function RoomReport({ adminService }: DependencyContainer) {
    return (props: RouteComponentProps) => {
        const { I18nContext: i18n } = context;
        const classes = useStyles();

        const [query, setQuery] = useState<QueryState>({});
        const [roomID, setRoomID] = useState(0);
        const [reportType, setReportType] = useState<ReportType>('day');
        if (query.raw !== props.location.search) {
            const newQuery = queryString.parse(props.location.search);
            newQuery.raw = props.location.search;
            setQuery(newQuery);
        }

        useEffect(() => {

            let id: number;
            if (query.id !== undefined) {
                id = Number.parseInt(query.id);
                if (id === undefined || isNaN(id)) {
                    reportError({
                        code: 0,
                        message: '需要一个房间数据库序号(id)',
                        name: '不合法的参数',
                    });
                }
            }
            else {
                reportError({
                    code: 0,
                    message: '需要一个房间数据库序号(id)',
                    name: '不合法的参数',
                });
                return;
            }

            setRoomID(id);
        }, [query.raw]);

        const [totalData, setTotalData] = useState<Report|undefined>(undefined);
        const [tableData, setTableData] = useState([]);

        useEffect(() => {
            console.log('querying');
            if (roomID === 0) {
                setTotalData(undefined);
                setTableData([]);
                return;
            }

            adminService
                .GetReport(roomID, reportType, new Date(Date.now()))
                .then((resp) => {
                    const data = matchResponse(resp, data => data, reportErrorC);
                    // setExportData(data);
                    if (data === undefined) {
                        setTotalData(undefined);
                        setTableData([]);
                        return;
                    }
                    setTotalData(data);
                    setTableData(data.items);
                });
        }, [roomID, reportType]);

        const [exportData] = useState<SlaveStatistics[] | undefined>(undefined);

        const onExport = useCallback(() => {
            if (!exportData) {
                return;
            }
            console.log(exportData);
            const file = new Blob([JSON.stringify(exportData)]),
                filename = 'report_' + '.json';
            if (window.navigator.msSaveOrOpenBlob) {
                window.navigator.msSaveOrOpenBlob(file, filename);
            } else {
                const a = document.createElement('a'),
                    url = URL.createObjectURL(file);
                a.href = url;
                a.download = filename;
                document.body.appendChild(a);
                a.click();
                setTimeout(function () {
                    document.body.removeChild(a);
                    window.URL.revokeObjectURL(url);
                }, 0);
            }
        }, [exportData]);

        const onChange = useCallback((event) => {
            let button = event.target;
            if (button.tagName === 'SPAN') {
                button = button.parentNode;
            }
            setReportType(button.value);
        }, [reportType]);

        return (
            <React.Fragment>
                <ButtonGroup variant="text" color="primary"
                             style={{margin: '0 auto', display: 'block', width: '140px'}}
                             aria-label="text primary button group"
                             onClick={onChange}>
                    <Button value={"day"}>日报</Button>
                    <Button value={"week"}>周报</Button>
                    <Button value={"month"}>月报</Button>
                </ButtonGroup>


                <div>
                    <p style={{margin:"20px 0"}}>
                        &nbsp;&nbsp;&nbsp;&nbsp;ID如果为0，说明是虚表数据；如果不为零说明该项数据来自经过压缩的数据库中冷数据存储。</p>
                </div>
                <Paper className={classes.paper}>
                    <div className={classes.title}>
                        从控报表
                        <Button
                            variant="outlined"
                            color="primary"
                            onClick={onExport}
                            type="button"
                            style={{
                                marginRight: '1em',
                                float: 'right',
                            }}
                        >
                            Export
                        </Button>
                    </div>
                    {totalData && <table className={styles['form-item-table']}>
                        <tbody>
                        <tr>
                            <td colSpan={1}>房间名称：{totalData?.room_id}</td>
                            <td colSpan={1}>开关机次数：{totalData?.count}</td>
                        </tr>
                        <tr>
                            <td colSpan={1}>能量总消耗：{totalData?.total_energy.toFixed(2)}</td>
                            <td colSpan={1}>花费总金额：{totalData?.total_cost.toFixed(2)}</td>
                        </tr>
                        </tbody>
                    </table>}
                    <MaterialTable


                        localization={i18n.statics.global.material_table_localization}
                        title={''}
                        columns={[
                            { title: 'ID', field: 'report_no' },
                            { title: '开始时间', field: 'start_time', type: 'datetime' },
                            { title: '停止时间', field: 'stop_time', type: 'datetime' },
                            { title: '开始温度', field: 'start_temperature' },
                            { title: '停止温度', field: 'end_temperature' },
                            { title: '花费金额', field: 'cost' },
                            { title: '能量消耗', field: 'energy' }
                            ]}
                        data={tableData}
                        options={{
                            sorting: true,
                            actionsColumnIndex: -1,
                            toolbar: false,
                            paging: false,
                        }}
                    />
                </Paper>
            </React.Fragment>
        );
    };
}
