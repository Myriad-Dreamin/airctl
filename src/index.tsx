import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { AppDependencyContainer, AppRouter } from './view';
import { MockAirService } from './service/mock/air';
import { MockData } from './mock/indes';
import { I18nContentProvider } from './service';
import { I18nSimplifiedChineseDataProvider } from './language/zh';
import { context } from './context';
import { I18nEnglishDataProvider } from './language/en';
import cookie from 'js-cookie';
import { MockUserService } from './service/mock/user';
import axios from 'axios';
import { DaemonAdminServiceAxiosImpl } from './service/axios/daemon';

let deps: AppDependencyContainer;

enum I18nLanguageSupport {
    English,
    SimplifiedChinese,
}

function provideLocale(locale: string) {
    let parsed: I18nLanguageSupport = 0;

    if (/^zh/.test(locale)) {
        parsed = I18nLanguageSupport.SimplifiedChinese;
    } else if (/^en/.test(locale)) {
        parsed = I18nLanguageSupport.English;
    }
    let contentProvider: I18nContentProvider;
    switch (parsed) {
        case I18nLanguageSupport.SimplifiedChinese:
            contentProvider = new I18nContentProvider(I18nSimplifiedChineseDataProvider);
            break;
        case I18nLanguageSupport.English:
        default:
            contentProvider = new I18nContentProvider(I18nEnglishDataProvider);
    }

    context.I18nContext = contentProvider;
    return contentProvider;
}

async function main() {
    const { default: airData } = await MockData.airData();
    const { default: userData } = await MockData.userData();
    // var lang: string = navigator.language || 'en';
    const locale = context.getLocale();
    const contentProvider = provideLocale(locale);

    context.Cookie = cookie;
    context.I18nContext = contentProvider;
    context.subscribeLocale(provideLocale);

    let ai = axios.create();

    context.subscribeToken((event) => {
        context.Cookie.set('admin_token', event.detail);
        console.log('set');
    });

    ai.interceptors.request.use((config) => {
        if (context.Cookie.get('admin_token')) {
            config.headers.Authorization = context.Cookie.get('admin_token');
            console.log("getting", context.Cookie.get('admin_token'));
        }
        return config;
    }, (error: any) => {
        return Promise.reject(error);
    });

    let urlProvider = {
        AdminLogin: 'http://localhost:23102/v1/admin/login'
    };

    deps = {
        airService: new MockAirService({
            initialAirs: airData,
        }),
        userService: new MockUserService({
            initialUsers: userData,
        }),
        daemonAdminService: new DaemonAdminServiceAxiosImpl (
            ai,
            urlProvider,
        ),
        i18n: contentProvider,
    };

    const App = AppRouter(deps);

    ReactDOM.render(<App />, document.querySelector('#app'));
}

main().catch(console.error);
