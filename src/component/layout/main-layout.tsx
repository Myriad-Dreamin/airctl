import * as React from 'react';
import { FunctionComponent, useCallback, useState } from 'react';
import { antd } from '../../dependency/antd';
import { MenuFoldOutlined, MenuUnfoldOutlined, UserOutlined } from '@ant-design/icons';
import styles from './main-layout.css';
import { Link } from 'react-router-dom';

export function MainLayout(C: FunctionComponent<any>) {
    return function (props: any) {
        const [collapsed, setCollapsed] = useState(false);
        const swapCollapsed = useCallback(() => setCollapsed((c) => !c), []);
        return (
            <antd.Layout key="global-layout" className={styles['global-layout']}>
                <antd.Layout.Sider
                    breakpoint="lg"
                    collapsedWidth="0"
                    trigger={null}
                    onBreakpoint={(broken) => {
                        console.log(broken);
                    }}
                    onCollapse={(collapsed, type) => {
                        console.log(collapsed, type);
                    }}
                    collapsible
                    collapsed={collapsed}
                    key="global-sider"
                >
                    <div className={styles['logo']}>
                        <span className={styles['logo-left']}>Air</span>
                        <span className={styles['logo-mid']}>Control</span>
                        <span className={styles['logo-right']}>Sys</span>
                    </div>
                    <antd.Menu theme="dark" mode="inline" defaultSelectedKeys={['4']} key="global-menu">
                        <antd.Menu.Item key="1">
                            <UserOutlined />
                            <Link to="/app/air/list" className="nav-text">
                                list
                            </Link>
                        </antd.Menu.Item>
                        <antd.Menu.Item key="2">
                            <UserOutlined />
                            <Link to="/app/air/inspect?aid=2" className="nav-text">
                                inpsect
                            </Link>
                        </antd.Menu.Item>
                    </antd.Menu>
                </antd.Layout.Sider>
                <antd.Layout key="global-sub-layout">
                    <antd.Layout.Header className={styles['site-layout-sub-header-background']} style={{ padding: 0 }}>
                        {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
                            className: styles['trigger'],
                            onClick: swapCollapsed,
                        })}
                    </antd.Layout.Header>
                    <antd.Layout.Content style={{ margin: '24px 16px 0' }}>
                        <div className={styles['site-layout-background']} style={{ padding: 24, minHeight: 360 }}>
                            <C {...props} />
                        </div>
                    </antd.Layout.Content>
                    <antd.Layout.Footer style={{ textAlign: 'center' }} />
                </antd.Layout>
            </antd.Layout>
        );
    };
}
