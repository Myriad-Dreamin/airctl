import { AirService } from '../dependency/service-concept';
import { I18nProvider } from '../dependency/i18n';

export interface DependencyContainer {
    airService: AirService;
    i18n: I18nProvider;
}
