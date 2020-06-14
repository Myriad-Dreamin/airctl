import React, { useCallback, useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import queryString from 'query-string';
import { DependencyContainer } from '../../../lib/common';
import { unwrap } from '../../../dependency/protocol';
import styles from './inspect.css';
import { reportError } from '../../../component/notify';
import { Connection } from '../../../dependency/x-service-concept';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { Theme } from '@material-ui/core/styles/createMuiTheme';
import createStyles from '@material-ui/core/styles/createStyles';
import Paper from '@material-ui/core/Paper';
import { Divider } from '@material-ui/core';
import MaterialTable from 'material-table';
import { context } from '../../../context';

interface QueryState {
    room_id?: string;
    id?: string;
    raw?: string;
}

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

export function RoomInspect({ adminService }: DependencyContainer) {
    return (props: RouteComponentProps) => {
        const { I18nContext: i18n } = context;
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
                    console.log('error');
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
                    name: '不合法的参数'
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

        const queryHandler = useCallback((query) => {

            return adminService.GetSlaveStatistics(roomID,
                new Date(Date.now() - 2000000), new Date(Date.now())).then(
                (resp) => {
                    let data = unwrap(resp);
                    console.log(data);
                    return {
                        data: data,
                        page: 0,
                        totalCount: data.length
                    };
                });
        }, [roomID]);

        return (
            <div className={styles['form-container']} key="form-container">
                <div
                    style={{
                        width: '1px',
                        height: '24px'
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
                                            marginRight: '0.5em'
                                        }}
                                        className={styles['state-dot']}
                                    >
                                        &nbsp;
                                    </span>
                                    <span>从控状态</span>
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
                                        <td colSpan={1}>房间编号：{connection?.id}</td>
                                        <td colSpan={1}>房间名称：{connection?.room_id}</td>
                                    </tr>
                                    <tr>
                                        <td colSpan={1}>当前是否已连接：{connection?.connected ? '是' : '否'}</td>
                                        <td colSpan={1}>
                                            当前温度：
                                            {connection?.connected ? connection?.current_temperature : '不可用'}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td colSpan={1}>
                                            是否需要调度：{connection?.connected ? connection?.need_fan : '不可用'}
                                        </td>
                                        <td colSpan={1}>
                                            正在调度风速：{connection?.connected ? connection?.fan_speed : '不可用'}
                                        </td>
                                    </tr>
                                    </tbody>
                                </table>
                                {/*<antd.Divider />*/}
                                <Divider style={{ margin: '2vh 0' }}/>
                                <div className={styles['form-sub-title']}>最近更新详单</div>
                                <MaterialTable
                                    localization={i18n.statics.global.material_table_localization}
                                    title={''}
                                    columns={[
                                        { title: 'id', field: 'room_id' },
                                        { title: '开始时间', field: 'start_time', type: 'datetime' },
                                        { title: '停止时间', field: 'stop_time', type: 'datetime' },
                                        { title: '消耗能量', field: 'energy' },
                                        { title: '消耗金额', field: 'cost' },
                                        { title: '风速', field: 'fan_speed' }
                                    ]}
                                    data={queryHandler}
                                    options={{
                                        sorting: true,
                                        actionsColumnIndex: -1,
                                        toolbar: false
                                    }}
                                />
                                {/*<antd.Divider />*/}
                                {/*<div className={styles['form-sub-title']}>*/}
                                {/*    <span>保修信息</span>*/}
                                {/*    <a*/}
                                {/*        onClick={modify}*/}
                                {/*        style={{*/}
                                {/*            marginRight: '1em',*/}
                                {/*            float: 'right',*/}
                                {/*        }}*/}
                                {/*    >*/}
                                {/*        [报修]*/}
                                {/*    </a>*/}
                                {/*</div>*/}
                                {/*<table className={styles['form-item-table']}>*/}
                                {/*    <tbody>*/}
                                {/*        <tr>*/}
                                {/*            <td colSpan={1}>保修政策：全国联保，享受三包服务</td>*/}
                                {/*            <td colSpan={1}>*/}
                                {/*                质保到期时间：{new Date(Date.now() + 233333333333).toISOString()}*/}
                                {/*            </td>*/}
                                {/*        </tr>*/}
                                {/*        <tr>*/}
                                {/*            <td colSpan={1}>质保备注：目前可保主要部件，整机已经不能保修</td>*/}
                                {/*            <td colSpan={1}>客服电话：233-333-3333</td>*/}
                                {/*        </tr>*/}
                                {/*        <tr>*/}
                                {/*            <td colSpan={1}>电话备注：24小时电话服务</td>*/}
                                {/*            <td colSpan={1}>负责人：老王</td>*/}
                                {/*        </tr>*/}
                                {/*        <tr>*/}
                                {/*            <td colSpan={2}>*/}
                                {/*                详细说明：2010年1月1日以后购买的无氟空调，其保修期为10年；保修期会因购买地区的不同以及购买时间的不同而有一定的差异，如您有疑问，请详询海尔公司客服电话；售后服务由品牌厂商提供，支持全国联保，可享有三包服务。如出现产品质量问题或故障，您可查询最近的维修点，由厂商的售后解决。您也可以电话咨询海尔24小时电话服务热线。*/}
                                {/*            </td>*/}
                                {/*        </tr>*/}
                                {/*    </tbody>*/}
                                {/*</table>*/}
                            </div>
                        )}
                    </Paper>
                </div>
            </div>
        );
    };
}
