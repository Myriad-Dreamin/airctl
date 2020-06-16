import React, { useCallback, useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import queryString from 'query-string';
import { DependencyContainer } from '../../../lib/common';
import { unwrap } from '../../../dependency/protocol';
import styles from './inspect.css';
import { reportError } from '../../../component/notify';
import { Connection, SlaveStatistics } from '../../../dependency/x-service-concept';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { Theme } from '@material-ui/core/styles/createMuiTheme';
import createStyles from '@material-ui/core/styles/createStyles';
import Paper from '@material-ui/core/Paper';
import { Divider } from '@material-ui/core';
import MaterialTable from 'material-table';
import { context } from '../../../context';
import Button from '@material-ui/core/Button';

interface QueryState {
    room_id?: string;
    id?: string;
    raw?: string;
}

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

export function RoomInspect({ adminService }: DependencyContainer) {
    return (props: RouteComponentProps) => {
        const { I18nContext: i18n } = context;
        const room_inspect = i18n.statics.global.room_inspect;
        const classes = useStyles();
        const [roomID, setRoomID] = useState(0);
        const [connection, setConnection] = useState<Connection | undefined>(undefined);
        // const [, setEditing] = useState(false);
        // const swapEdit = () => useCallback(() => setEditing((e) => !e), []);
        console.log('rerender');

        const [query, setQuery] = useState<QueryState>({});
        if (query.raw !== props.location.search) {
            const newQuery = queryString.parse(props.location.search);
            newQuery.raw = props.location.search;
            setQuery(newQuery);
        }

        useEffect(() => {
            let id: number;
            if (query.id !== undefined) {
                id = Number.parseInt(query.id);
                if (id === undefined) {
                    reportError({
                        code: 0,
                        message: '需要一个房间数据库序号(id)',
                        name: '不合法的参数',
                    });
                }
            }
            //     if (query.room_id !== undefined)
            //     {
            //     id = unwrap(airService.GetID(query.room_id));
            // } else
            else {
                // reportError({
                //     code: 0,
                //     message: '需要一个房间号(room_id)或者一个房间数据库序号(id)',
                //     name: '不合法的参数',
                // });

                reportError({
                    code: 0,
                    message: '需要一个房间数据库序号(id)',
                    name: '不合法的参数',
                });
                return;
            }

            setRoomID(id);
            adminService
                .GetConnectedSlave(id)
                .then((resp) => {
                    setConnection(unwrap(resp));
                })
                .catch(console.error);
        }, [query]);

        // const modify = () => console.log('click');

        const [exportData, setExportData] = useState<SlaveStatistics[] | undefined>(undefined);

        const queryHandler = useCallback(() => {
            return adminService.GetSlaveStatistics(roomID, new Date(2000, 0), new Date(Date.now())).then((resp) => {
                const data = unwrap(resp);
                setExportData(data);
                return {
                    data: data,
                    page: 0,
                    totalCount: data.length,
                };
            });
        }, [roomID]);

        const onExport = useCallback(() => {
            if (!exportData) {
                return;
            }
            console.log(exportData);
            const file = new Blob([JSON.stringify(exportData)]),
                filename = 'export_' + roomID + '.json';
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
        }, [exportData, roomID]);

        return (
            <div className={styles['form-container']} key="form-container">
                <div
                    style={{
                        width: '1px',
                        height: '24px',
                    }}
                >
                    &nbsp;
                </div>
                <div className={styles['card']}>
                    <Paper className={classes.paper}>
                        {connection && (
                            <div>
                                <div className={styles['form-sub-title']}>
                                    <span
                                        style={{
                                            background: connection?.connected
                                                ? '#52c41a'
                                                : // : connection?.available
                                                  '#f5222d',
                                            // : '#d9d9d9'
                                            marginRight: '0.5em',
                                        }}
                                        className={styles['state-dot']}
                                    >
                                        &nbsp;
                                    </span>
                                    <span>{room_inspect.slave_state_title}</span>
                                    {/*<antd.Button*/}
                                    {/*    onClick={swapEdit}*/}
                                    {/*    type="link"*/}
                                    {/*    icon={<SlidersOutlined />}*/}
                                    {/*    style={{*/}
                                    {/*        marginRight: '1em',*/}
                                    {/*        float: 'right',*/}
                                    {/*    }}*/}
                                    {/*/>*/}
                                </div>
                                <table className={styles['form-item-table']}>
                                    <tbody>
                                        <tr>
                                            <td colSpan={1}>
                                                {room_inspect.room_number_label}
                                                {connection?.id}
                                            </td>
                                            <td colSpan={1}>
                                                {room_inspect.room_name_label}
                                                {connection?.room_id}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td colSpan={1}>
                                                {room_inspect.is_connected_label}
                                                {connection?.connected
                                                    ? i18n.statics.global.general.yes
                                                    : i18n.statics.global.general.no}
                                            </td>
                                            <td colSpan={1}>
                                                {room_inspect.current_temperature_label}
                                                {connection?.connected
                                                    ? connection?.current_temperature
                                                    : i18n.statics.global.general.not_available}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td colSpan={1}>
                                                {room_inspect.is_waiting_scheduling_label}
                                                {connection?.connected
                                                    ? connection?.need_fan
                                                        ? i18n.statics.global.general.yes
                                                        : i18n.statics.global.general.no
                                                    : i18n.statics.global.general.not_available}
                                            </td>
                                            <td colSpan={1}>
                                                {room_inspect.scheduling_fan_speed_label}
                                                {connection?.connected
                                                    ? connection?.fan_speed
                                                    : i18n.statics.global.general.not_available}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                                {/*<antd.Divider />*/}
                                <Divider style={{ margin: '2vh 0' }} />
                                <div className={styles['form-sub-title']}>
                                    {room_inspect.latest_table_name}
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
                                <MaterialTable
                                    localization={i18n.statics.global.material_table_localization}
                                    title={''}
                                    columns={[
                                        { title: room_inspect.table.id, field: 'room_id' },
                                        { title: room_inspect.table.start_time, field: 'start_time', type: 'datetime' },
                                        { title: room_inspect.table.stop_time, field: 'stop_time', type: 'datetime' },
                                        { title: room_inspect.table.consumed_energy, field: 'energy' },
                                        { title: room_inspect.table.cost, field: 'cost' },
                                        { title: room_inspect.table.fan_speed, field: 'fan_speed' },
                                    ]}
                                    data={queryHandler}
                                    options={{
                                        sorting: true,
                                        actionsColumnIndex: -1,
                                        toolbar: false,
                                        paging: false,
                                    }}
                                />
                            </div>
                        )}
                    </Paper>
                </div>
            </div>
        );
    };
}
