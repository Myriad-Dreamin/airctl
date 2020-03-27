import React, { useCallback, useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import queryString from 'query-string';
import { DependencyContainer } from '../../../lib/common';
import { SimplifiedResponse, unwrap } from '../../../dependency/protocol';
import styles from './inspect.css';
import { AirState } from '../../../dependency/concept';
import { antd } from '../../../dependency/antd';
import { SlidersOutlined } from '@ant-design/icons';

interface ErrorWithData extends Error, SimplifiedResponse<any> {}

function reportError(err: ErrorWithData) {
    console.log(err, err.stack);
    const modal = antd.Modal.error({
        title: '错误发生',
        content: `${err.name}: ${err.message}${err.data === undefined ? '' : ', ' + err.data.toString()}`,
    });
    setTimeout(() => {
        modal.destroy();
    }, 3000);
}

interface QueryState {
    serial_number?: string;
    aid?: string;
    raw?: string;
}

export function AirInspect({ airService }: DependencyContainer) {
    return (props: RouteComponentProps) => {
        const [, setAirID] = useState(0);
        const [airState, setAirState] = useState<AirState | undefined>(undefined);
        const [query, setQuery] = useState<QueryState>({});
        const [editing, setEditing] = useState(false);
        const swapEdit = () => setEditing(!editing);
        console.log('rerender', props.location.search);

        if (query.raw !== props.location.search) {
            let newQuery = queryString.parse(props.location.search);
            newQuery.raw = props.location.search;
            setQuery(newQuery);
        }

        const fetchState = useCallback(() => {
            let aid: number;
            if (query.aid !== undefined) {
                aid = Number.parseInt(query.aid);
                if (aid === undefined) {
                    console.log('error');
                }
            } else if (query.serial_number !== undefined) {
                aid = unwrap(airService.GetID(query.serial_number));
            } else {
                reportError({
                    code: 0,
                    message: '需要一个serial_number或者一个aid',
                    name: '不合法的参数',
                });
                return;
            }

            setAirID(aid);
            setAirState(unwrap(airService.CheckState(aid)));
        }, [query]);
        useEffect(fetchState);

        const modify = () => console.log('click todo');

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
                    <antd.Card>
                        {airState && (
                            <div>
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
                                    <antd.Button
                                        onClick={swapEdit}
                                        type="link"
                                        icon={<SlidersOutlined />}
                                        style={{
                                            marginRight: '1em',
                                            float: 'right',
                                        }}
                                    />
                                </div>
                                <table className={styles['form-item-table']}>
                                    <tbody>
                                        <tr>
                                            <td colSpan={1}>当前是否开启：{airState?.is_on ? '是' : '否'}</td>
                                            <td colSpan={1}>当前是否可用：{airState?.available ? '是' : '否'}</td>
                                        </tr>
                                        <tr>
                                            <td colSpan={1}>当前空调温度：{airState?.degree}℃</td>
                                            <td colSpan={1}>目标空调温度：{airState?.target_degree}℃</td>
                                        </tr>
                                    </tbody>
                                </table>
                                <antd.Divider />
                                <div className={styles['form-sub-title']}>硬件信息</div>
                                <table className={styles['form-item-table']}>
                                    <tbody>
                                        <tr>
                                            <td colSpan={1}>空调产品序列号：{airState?.serialNumber}</td>
                                            <td colSpan={1}>能效等级：二级能效</td>
                                        </tr>
                                        <tr>
                                            <td colSpan={1}>冷暖类型：冷暖型</td>
                                            <td colSpan={1}>能效比：暂无数据</td>
                                        </tr>
                                        <tr>
                                            <td colSpan={1}>制冷量：5090W</td>
                                            <td colSpan={1}>室内机噪音：33-41dB</td>
                                        </tr>
                                        <tr>
                                            <td colSpan={1}>制热量：5750W</td>
                                            <td colSpan={1}>室外机噪音：42-56dB</td>
                                        </tr>
                                    </tbody>
                                </table>
                                <antd.Divider />
                                <div className={styles['form-sub-title']}>
                                    <span>保修信息</span>
                                    <a
                                        onClick={modify}
                                        style={{
                                            marginRight: '1em',
                                            float: 'right',
                                        }}
                                    >
                                        [报修]
                                    </a>
                                </div>
                                <table className={styles['form-item-table']}>
                                    <tbody>
                                        <tr>
                                            <td colSpan={1}>保修政策：全国联保，享受三包服务</td>
                                            <td colSpan={1}>
                                                质保到期时间：{new Date(Date.now() + 233333333333).toISOString()}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td colSpan={1}>质保备注：目前可保主要部件，整机已经不能保修</td>
                                            <td colSpan={1}>客服电话：233-333-3333</td>
                                        </tr>
                                        <tr>
                                            <td colSpan={1}>电话备注：24小时电话服务</td>
                                            <td colSpan={1}>负责人：老王</td>
                                        </tr>
                                        <tr>
                                            <td colSpan={2}>
                                                详细说明：2010年1月1日以后购买的无氟空调，其保修期为10年；保修期会因购买地区的不同以及购买时间的不同而有一定的差异，如您有疑问，请详询海尔公司客服电话；售后服务由品牌厂商提供，支持全国联保，可享有三包服务。如出现产品质量问题或故障，您可查询最近的维修点，由厂商的售后解决。您也可以电话咨询海尔24小时电话服务热线。
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </antd.Card>
                </div>
            </div>
        );
    };
}
