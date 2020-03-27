import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { AppDependencyContainer, AppRouter } from './view';
import { MockAirService } from './service/mock/air';
import { MockData } from './mock/indes';
import { I18nContentProvider } from './service';
import { I18nSimplifiedChineseDataProvider } from './language/zh';
import { context } from './context';
import { I18nEnglishDataProvider } from './language/en';

let deps: AppDependencyContainer;
enum I18nLanguageSupport {
    English,
    SimplifiedChinese,
}
// var lang: string = navigator.language || 'en';
const lang = 'en';
let parsed: I18nLanguageSupport = 0;
if (/^zh/.test(lang)) {
    parsed = I18nLanguageSupport.SimplifiedChinese;
} else if (/^en/.test(lang)) {
    parsed = I18nLanguageSupport.English;
}

async function main() {
    const { default: airData } = await MockData.airData();
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

    deps = {
        airService: new MockAirService({
            initialAirs: airData,
        }),
        i18n: contentProvider,
    };

    const App = AppRouter(deps);

    ReactDOM.render(<App />, document.querySelector('#app'));
}

main().catch(console.error);
