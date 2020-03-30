import * as React from 'react';
import { useCallback, useEffect, useState } from 'react';
import { Avatar, Button, List, Skeleton } from 'antd';
import styles from './list.css';
import { User } from '../../../dependency/concept';
import { DependencyContainer } from '../../../lib/common';
import { matchResponse } from '../../../dependency/protocol';

export function UserList({ userService }: DependencyContainer) {
    return function () {
        const [loading, setLoading] = useState(true);
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

        const onLoadMore = useCallback(() => {
            console.log('onLoadMore');
            // this.setState({
            //     loading: true,
            //     list: this.state.data.concat([...new Array(count)].map(() => ({ loading: true, name: {} }))),
            // });
            // this.getData(res => {
            //     const data = this.state.data.concat(res.results);
            //     this.setState(
            //         {
            //             data,
            //             list: data,
            //             loading: false,
            //         },
            //         () => {
            //             // Resetting window's offsetTop so as to display react-virtualized demo underfloor.
            //             // In real scene, you can using public method of react-virtualized:
            //             // https://stackoverflow.com/questions/46700726/how-to-use-public-method-updateposition-of-react-virtualized
            //             window.dispatchEvent(new Event('resize'));
            //         },
            //     );
            // });
        }, []);

        const loadMore = !loading ? (
            <div
                style={{
                    textAlign: 'center',
                    marginTop: 12,
                    height: 32,
                    lineHeight: '32px',
                }}
            >
                <Button onClick={onLoadMore}>loading more</Button>
            </div>
        ) : null;

        return (
            <List
                className={styles['demo-load-more-list']}
                loading={loading}
                itemLayout="horizontal"
                loadMore={loadMore}
                dataSource={data}
                renderItem={(item: User) => (
                    <List.Item actions={[<a key="list-loadmore-edit">edit</a>, <a key="list-loadmore-more">more</a>]}>
                        <Skeleton avatar title={false} loading={false} active>
                            <List.Item.Meta
                                avatar={
                                    <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
                                }
                                title={<a href="https://ant.design">{item.name}</a>}
                                description={
                                    <React.Fragment>
                                        <div>id：{item.id}</div>
                                        <div>phone number: {item.phone_number}</div>
                                        <div>money: {item.money}</div>
                                    </React.Fragment>
                                }
                            />
                        </Skeleton>
                    </List.Item>
                )}
            />
        );
    };
}
