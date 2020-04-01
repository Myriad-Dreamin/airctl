import * as React from 'react';
import { useEffect, useState } from 'react';
import styles from './list.css';
import { User } from '../../../dependency/concept';
import { DependencyContainer } from '../../../lib/common';
import { matchResponse } from '../../../dependency/protocol';
import { antd } from '../../../dependency/antd';

export function UserList({ userService }: DependencyContainer) {
    return function () {
        const [, setLoading] = useState(true);
        const [data, setData] = useState<User[]>([]);
        // let [list, setList] = useState([]);

        useEffect(() => {
            setLoading(true);
            matchResponse(
                userService.Filter(),
                (users) => {
                    setData(users);
                    setLoading(false);
                },
                console.error
            );
        }, []);

        // const onLoadMore = useCallback(() => {
        //     console.log('onLoadMore');
        //     // this.setState({
        //     //     loading: true,
        //     //     list: this.state.data.concat([...new Array(count)].map(() => ({ loading: true, name: {} }))),
        //     // });
        //     // this.getData(res => {
        //     //     const data = this.state.data.concat(res.results);
        //     //     this.setState(
        //     //         {
        //     //             data,
        //     //             list: data,
        //     //             loading: false,
        //     //         },
        //     //         () => {
        //     //             // Resetting window's offsetTop so as to display react-virtualized demo underfloor.
        //     //             // In real scene, you can using public method of react-virtualized:
        //     //             // https://stackoverflow.com/questions/46700726/how-to-use-public-method-updateposition-of-react-virtualized
        //     //             window.dispatchEvent(new Event('resize'));
        //     //         },
        //     //     );
        //     // });
        // }, []);

        // const loadMore = !loading ? (
        //     <div
        //         style={{
        //             textAlign: 'center',
        //             marginTop: 12,
        //             height: 32,
        //             lineHeight: '32px',
        //         }}
        //     >
        //         <antd.Button onClick={onLoadMore}>loading more</antd.Button>
        //     </div>
        // ) : null;

        return (
            <React.Fragment>
                <div className={styles['list-container']}>
                    {data.map((item) => {
                        return (
                            <antd.Card key={item.id} className={styles['list-item']}>
                                <div className={styles['name']}>
                                    <a href="https://ant.design">{item.name}</a>
                                </div>
                                <div style={{ clear: 'both', margin: '5px 0', width: '1px', height: '1px' }}>
                                    &nbsp;
                                </div>
                                <div className={styles['phone-number']}>
                                    phone number: <span style={{ float: 'right' }}>{item.phone_number}</span>
                                </div>
                                <div className={styles['balance']}>
                                    balance: <span style={{ float: 'right' }}>{item.balance}</span>
                                </div>
                                <antd.Divider style={{ margin: '10px 0' }} />
                                <antd.Button style={{ float: 'left' }}>edit</antd.Button>
                                <antd.Button style={{ float: 'right' }}>pay</antd.Button>
                            </antd.Card>
                        );
                    })}
                </div>
            </React.Fragment>
        );
    };
}
