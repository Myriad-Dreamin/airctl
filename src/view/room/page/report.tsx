import { DependencyContainer } from '../../../lib/common';
import { RouteComponentProps } from 'react-router-dom';
import React, { useCallback, useEffect, useState } from 'react';
import Button from '@material-ui/core/Button';
import MaterialTable from 'material-table';
import { context } from '../../../context';
import { Report, ReportType } from '../../../dependency/x-service-concept';
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
        const room_report = i18n.statics.global.room_report;
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
            } else {
                reportError({
                    code: 0,
                    message: '需要一个房间数据库序号(id)',
                    name: '不合法的参数',
                });
                return;
            }

            setRoomID(id);
        }, [query.raw]);

        const [totalData, setTotalData] = useState<Report | undefined>(undefined);
        const [tableData, setTableData] = useState([]);

        useEffect(() => {
            console.log('querying');
            if (roomID === 0) {
                setTotalData(undefined);
                setTableData([]);
                return;
            }

            adminService.GetReport(roomID, reportType, new Date(Date.now())).then((resp) => {
                const data = matchResponse(resp, (data) => data, reportErrorC);
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

        const onExport = useCallback(() => {
            if (!totalData) {
                return;
            }
            console.log(totalData);
            const file = new Blob([JSON.stringify(totalData)]),
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
        }, [totalData]);

        const onChange = useCallback(
            (event) => {
                let button = event.target;
                if (button.tagName === 'SPAN') {
                    button = button.parentNode;
                }
                setReportType(button.value);
            },
            [reportType]
        );

        return (
            <React.Fragment>
                <ButtonGroup
                    variant="text"
                    color="primary"
                    style={{
                        margin: '0 auto',
                        display: 'block',
                        width: i18n.statics.global.general.yes == 'Yes' ? '180px' : '140px',
                    }}
                    aria-label="text primary button group"
                    onClick={onChange}
                >
                    <Button value={'day'}>{room_report.daily_button_title}</Button>
                    <Button value={'week'}>{room_report.weekly_button_title}</Button>
                    <Button value={'month'}>{room_report.monthly_button_title}</Button>
                </ButtonGroup>

                <div>
                    <p style={{ margin: '20px 0' }}>&nbsp;&nbsp;&nbsp;&nbsp;{room_report.slave_report_ps}</p>
                </div>
                <Paper className={classes.paper}>
                    <div className={classes.title}>
                        {room_report.slave_report_table_name}
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
                    {totalData && (
                        <table className={styles['form-item-table']}>
                            <tbody>
                                <tr>
                                    <td colSpan={1}>
                                        {room_report.room_name_label}
                                        {totalData?.room_id}
                                    </td>
                                    <td colSpan={1}>
                                        {room_report.boot_shutdown_times_label}
                                        {totalData?.count}
                                    </td>
                                </tr>
                                <tr>
                                    <td colSpan={1}>
                                        {room_report.total_consumed_energy_label}
                                        {totalData?.total_energy.toFixed(2)}
                                    </td>
                                    <td colSpan={1}>
                                        {room_report.total_cost_label}
                                        {totalData?.total_cost.toFixed(2)}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    )}
                    <MaterialTable
                        localization={i18n.statics.global.material_table_localization}
                        title={''}
                        columns={[
                            { title: room_report.table.id, field: 'report_no' },
                            { title: room_report.table.start_time, field: 'start_time', type: 'datetime' },
                            { title: room_report.table.stop_time, field: 'stop_time', type: 'datetime' },
                            { title: room_report.table.start_temperature, field: 'start_temperature' },
                            { title: room_report.table.stop_temperature, field: 'end_temperature' },
                            { title: room_report.table.cost, field: 'cost' },
                            { title: room_report.table.consumed_energy, field: 'energy' },
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
