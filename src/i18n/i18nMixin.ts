import { LitElement } from 'lit-element';
import { getLanguage, i18next, loadLanguages, loadNamespaces, StringMap, TFunction, TOptions, translate } from './i18n';

export { translate, loadNamespaces, loadLanguages, getLanguage };

type Constructor<T> = new (...args: any[]) => T;

export function i18nMixin<T extends Constructor<LitElement>>(Base: T) {
    return class extends Base {
        constructor(...args: any[]) {
            super(...args);
        }

        firstUpdated(props: any) {
            i18next.on('initialized', () => {
                this.requestUpdate();
            });
            i18next.on('languageChanged', () => {
                this.requestUpdate();
            });
            super.firstUpdated && super.firstUpdated(props);
        }

        async changeLanguage(lang: string) {
            return i18next.changeLanguage(lang);
        }

        localize: TFunction = (key: string | string[], options?: string | TOptions<StringMap> | undefined) => {
            if (typeof key === 'string') {
                if (key.includes(':')) {
                    const tmp = key.split(':')[1];
                    key = [key, `${this.tagName.toLowerCase()}:${tmp}`, tmp];
                } else {
                    key = [`${this.tagName.toLowerCase()}:${key}`, key];
                }
            }
            return i18next.t(key, options) ?? '';
        };
    };
}
