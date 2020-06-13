import React from 'react';
import { I18nProvider } from '../dependency/i18n';
import { CookieX } from '../dependency/cookie';
import { I18nContentProvider } from '../service';
import { I18nEnglishDataProvider } from '../language/en';
import Cookie from 'js-cookie';

const reactContextInner = { locale: 'en' };
const reactContext = React.createContext(reactContextInner);

type contextType = {
    I18nContext: I18nProvider;
    Cookie: CookieX;
    ReactContext: typeof reactContext;
    _localeCallbacks: ((locale: string) => void | Promise<string>)[];
    dispatchToken(token: string): void;
    subscribeToken(cb: (token: CustomEvent<string>) => void): void;
    removeSubscribeToken(cb: (token: CustomEvent<string>) => void): void;
    getLocale(): string;
    dispatchLocale(locale: string): Promise<void>;
    subscribeLocale(cb: (locale: string) => void): void;
};

export const context: contextType = {
    I18nContext: new I18nContentProvider(I18nEnglishDataProvider),
    Cookie: Cookie,
    ReactContext: reactContext,
    dispatchToken(token: string) {
        let event = new CustomEvent<string>('jwt_token_updated', { detail: token });

        window.dispatchEvent(event);
    },
    subscribeToken(cb: (token: CustomEvent<string>) => void) {
        window.addEventListener('jwt_token_updated', cb as EventListener);
    },
    removeSubscribeToken(cb: (token: CustomEvent<string>) => void) {
        window.removeEventListener('jwt_token_updated', cb as EventListener);
    },

    getLocale() {
        return this.Cookie.get('locale') || 'en';
    },
    _localeCallbacks: [],
    async dispatchLocale(locale: string) {
        console.log(locale);
        this.Cookie.set('locale', locale);
        for (const cb of this._localeCallbacks) {
            await cb(locale);
        }
    },
    subscribeLocale(cb: (locale: string) => void) {
        this._localeCallbacks.push(cb);
    }
};
