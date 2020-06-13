import { AirService, UserService } from '../dependency/service-concept';
import { I18nProvider } from '../dependency/i18n';
import { DaemonAdminService } from '../dependency/x-service-concept';

export interface DependencyContainer {
    airService: AirService;
    userService: UserService;
    daemonAdminService: DaemonAdminService;
    i18n: I18nProvider;
}
