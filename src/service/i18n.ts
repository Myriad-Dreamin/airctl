import { I18nProvider, I18nStaticVars } from '../dependency/i18n';

export class InternalI18nContentProvider implements I18nProvider {
    public readonly statics: I18nStaticVars;
    constructor(staticVars: I18nStaticVars) {
        this.statics = staticVars;
    }
}
