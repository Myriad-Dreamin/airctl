import * as React from 'react';
import { useEffect, useState } from 'react';
import { DependencyContainer } from '../../../lib/common';
import styles from './list.css';
import { antd } from '../../../dependency/antd';
import { FullAirState } from '../../../dependency/concept';
import { matchResponse } from '../../../dependency/protocol';
import { RouteComponentProps } from 'react-router-dom';

export function AirList({ airService }: DependencyContainer) {
    return function (props: RouteComponentProps) {
        const [data, setData] = useState<FullAirState[]>([]);

        useEffect(() => {
            matchResponse(airService.Filter(), setData, console.error);
        }, []);
        return (
            <React.Fragment>
                <div className={styles['list-container']}>
                    {data.map((item) => {
                        return (
                            <antd.Card key={item.aid} className={styles['list-item']}>
                                <div className={styles['title']}>
                                    <a href="https://ant.design">
                                        {item.aid}
                                        <span
                                            style={{
                                                background: item?.is_on
                                                    ? '#52c41a'
                                                    : item?.available
                                                    ? '#f5222d'
                                                    : '#d9d9d9',
                                                marginRight: '0.5em',
                                            }}
                                            className={styles['state-dot']}
                                        />
                                    </a>
                                </div>
                                <div style={{ clear: 'both', margin: '5px 0', width: '1px', height: '1px' }}>
                                    &nbsp;
                                </div>
                                <div>
                                    degree: <span style={{ float: 'right' }}>{item.degree}</span>
                                </div>
                                <div>
                                    target_degree: <span style={{ float: 'right' }}>{item.target_degree}</span>
                                </div>
                                <antd.Divider style={{ margin: '10px 0' }} />
                                <antd.Button style={{ float: 'left' }}>edit</antd.Button>
                                <antd.Button
                                    style={{ float: 'right' }}
                                    onClick={() => props.history.push('/app/air/inspect?aid=' + item.aid)}
                                >
                                    inspect
                                </antd.Button>
                            </antd.Card>
                        );
                    })}
                </div>
            </React.Fragment>
        );
    };
}
