import React from 'react';
import { I18nProvider } from '../dependency/i18n';
import { CookieX } from '../dependency/cookie';
import { I18nContentProvider } from '../service';
import { I18nEnglishDataProvider } from '../language/en';
import Cookie from 'js-cookie';

let reactContextInner = {locale: 'en'};
let reactContext = React.createContext(reactContextInner);


type contextType = {
    I18nContext: I18nProvider,
    Cookie: CookieX,
    ReactContext: typeof reactContext,
    _localeCallbacks: ((locale: string) => void | Promise<string>)[],
    getLocale(): string,
    dispatchLocale(locale: string): Promise<void>,
    subscribeLocale(cb: (locale: string) => void): void,
};
export const context: contextType = {
    I18nContext: new I18nContentProvider(I18nEnglishDataProvider),
    Cookie: Cookie,
    ReactContext: reactContext,

    getLocale() {
        return this.Cookie.get('locale') || 'en';
    },
    _localeCallbacks: [],
    async dispatchLocale(locale: string) {
        console.log(locale);
        this.Cookie.set('locale', locale);
        for (let cb of this._localeCallbacks) {
            await cb(locale)
        }
    },
    subscribeLocale(cb: (locale: string) => void) {
        this._localeCallbacks.push(cb);
    }
};
