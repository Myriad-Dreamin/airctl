import { I18nContentProvider } from './service';
import { I18nSimplifiedChineseDataProvider } from './language/zh';
import { I18nEnglishDataProvider } from './language/en';
import { context } from './context';

// I18nLanguageSupport: Internationalization (中间省略18个字符)的缩写。不使用其他库
// ，而是自行定义一套国际化方案。
// 此处定义枚举供本模块使用
enum I18nLanguageSupport {
    English,
    SimplifiedChinese,
}

// 根据网页信息猜测管理员母语
export function provideLocale(locale: string) {
    let parsed: I18nLanguageSupport = 0;

    // 中文
    if (/^zh/.test(locale)) {
        parsed = I18nLanguageSupport.SimplifiedChinese;
        // 英文
    } else if (/^en/.test(locale)) {
        parsed = I18nLanguageSupport.English;
    }

    let contentProvider: I18nContentProvider;
    switch (parsed) {
        // 中文语义集合
        case I18nLanguageSupport.SimplifiedChinese:
            contentProvider = new I18nContentProvider(I18nSimplifiedChineseDataProvider);
            break;
        // 英文语义集合
        case I18nLanguageSupport.English:
        // 默认为英语
        default:
            contentProvider = new I18nContentProvider(I18nEnglishDataProvider);
    }

    // js为单线程，单个语句的赋值不需要lock
    context.I18nContext = contentProvider;
    return contentProvider;
}
