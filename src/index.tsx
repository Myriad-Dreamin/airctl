import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { AppDependencyContainer, AppRouter } from './view';
import { MockAirService } from './service/mock/air';
import { MockData } from './mock/indes';
import { context } from './context';
import cookie from 'js-cookie';
import { MockUserService } from './service/mock/user';
import axios from 'axios';
import { DaemonAdminServiceAxiosImpl } from './service/axios/daemon';
import { AdminServiceAxiosImpl } from './service/axios/admin';
import { provideLocale } from './locale';
// 获取基本配置
import config from '../config';

// 初始化上下文
function initContext() {
    context.Cookie = cookie;
    context.subscribeLocale(provideLocale);
    context.subscribeToken((event) => {
        context.Cookie.set('admin_token', event.detail);
        console.log('set');
    });
}

// 初始化依赖
const initDependencies: () => Promise<AppDependencyContainer> = async () => {
    // 假数据，由于软件工程大作业已经不需要这两个服务了，但为了方便仍然提供测试数据
    const { default: airData } = await MockData.airData();
    const { default: userData } = await MockData.userData();

    const ai = axios.create();

    ai.interceptors.request.use(
        (config) => {
            if (context.Cookie.get('admin_token')) {
                config.headers.Authorization = context.Cookie.get('admin_token');
            }
            return config;
        },
        (error: any) => {
            return Promise.reject(error);
        }
    );

    // deps: 定义为依赖容器，供所有页面使用
    return {
        airService: new MockAirService({
            initialAirs: airData,
        }),
        userService: new MockUserService({
            initialUsers: userData,
        }),
        daemonAdminService: new DaemonAdminServiceAxiosImpl(ai, config.urlProvider),
        adminService: new AdminServiceAxiosImpl(ai, config.urlProvider),
        i18n: provideLocale(context.getLocale()),
    };
};

// 异步主函数，初始化整个前端
async function main() {
    // 初始化上下文
    initContext();

    // 初始化依赖
    const deps = await initDependencies();

    // 将依赖注入到前端Router中
    const App = AppRouter(deps);

    // 实例化ReactDom虚拟节点，并绑定到index.html的<div id="app"/>上
    ReactDOM.render(<App />, document.querySelector('#app'));
}

// 运行主函数
main().catch(console.error);
