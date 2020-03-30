import * as React from 'react';
import { useEffect, useState } from 'react';
import { DependencyContainer } from '../../../lib/common';
import { Descriptions } from 'antd';
import { User } from '../../../dependency/concept';
import { matchResponse } from '../../../dependency/protocol';
import queryString from 'query-string';
import { RouteComponentProps } from 'react-router-dom';

interface QueryState {
    raw?: string;
    id?: string;
}

export function UserProfile({ userService }: DependencyContainer) {
    return function (props: RouteComponentProps) {
        const [loading, setLoading] = useState(true);
        const [data, setData] = useState<User | undefined>(undefined);
        // let [list, setList] = useState([]);

        const [query, setQuery] = useState<QueryState>({});
        if (query.raw !== props.location.search) {
            const newQuery = queryString.parse(props.location.search);
            newQuery.raw = props.location.search;
            setQuery(newQuery);
        }

        useEffect(() => {
            setLoading(true);
            const id = Number.parseInt(query.id || 'NaN');
            if (isNaN(id)) {
                console.error(`search id is not a valid number`);
                return;
            }
            matchResponse(
                userService.CheckState(id),
                (user) => {
                    setData(user);
                    setLoading(false);
                },
                console.error
            );
        }, [query]);
        return (
            <div hidden={loading}>
                {data && (
                    <Descriptions title="User Info" bordered column={4}>
                        <Descriptions.Item label="UserName" span={2}>
                            {data.name}
                        </Descriptions.Item>
                        <Descriptions.Item label="Telephone" span={2}>
                            {data.phone_number}
                        </Descriptions.Item>
                        <Descriptions.Item label="Identifier" span={2}>
                            {data.id}
                        </Descriptions.Item>
                        <Descriptions.Item label="Money" span={2}>
                            {data.money}
                        </Descriptions.Item>
                        <Descriptions.Item label="Ordering Room" span={4}>
                            Room1 <br />
                            Room2 <br />
                            Room3 <br />
                            Room4 <br />
                            Room5 <br />
                            Room6 <br />
                            Room7 <br />
                            Room8 <br />
                        </Descriptions.Item>
                        <Descriptions.Item label="Controlling Devices" span={4}>
                            Device1 <br />
                            Device2 <br />
                            Device3 <br />
                            Device4 <br />
                            Device5 <br />
                            Device6 <br />
                            Device7 <br />
                            Device8 <br />
                        </Descriptions.Item>
                    </Descriptions>
                )}
            </div>
        );
    };
}
