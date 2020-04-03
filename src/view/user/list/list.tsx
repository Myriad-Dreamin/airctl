import * as React from 'react';
import { useEffect, useState } from 'react';
import { User } from '../../../dependency/concept';
import { DependencyContainer } from '../../../lib/common';
import { matchResponse } from '../../../dependency/protocol';
import MaterialTable from 'material-table';
import { RouteComponentProps } from 'react-router-dom';

export function UserList({ userService }: DependencyContainer) {
    return function (props: RouteComponentProps) {
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
        //
        return (
            <MaterialTable
                title="User List Preview"
                columns={[
                    { title: 'ID', field: 'id' },
                    { title: 'Name', field: 'name' },
                    { title: 'Phone Number', field: 'phone_number' },
                    { title: 'Balance', field: 'balance', type: 'numeric' },
                    // {
                    //     title: 'Birth Place',
                    //     field: 'birthCity',
                    //     lookup: { 34: 'İstanbul', 63: 'Şanlıurfa' },
                    // },
                ]}
                data={data}
                actions={[
                    {
                        icon: 'more_vert',
                        tooltip: 'Inspect User',
                        onClick: (event: any, rowData: User | User[]) => {
                            console.log(event);
                            if (rowData instanceof Array) {
                            } else {
                                props.history.push(`/app/user/profile?id=${rowData.id}`);
                            }
                        },
                    },
                ]}
                options={{
                    sorting: true,
                    actionsColumnIndex: -1,
                }}
            />
        );
    };
}
