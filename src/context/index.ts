import { I18nProvider } from '../dependency/i18n';
import { I18nContentProvider } from '../service';
import { I18nEnglishDataProvider } from '../language/en';

export const context: { I18nContext: I18nProvider } = {
    I18nContext: new I18nContentProvider(I18nEnglishDataProvider),
};
