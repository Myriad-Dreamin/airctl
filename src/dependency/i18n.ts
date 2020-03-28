export interface I18nStaticVars {
    global: {
        locale_name: {
            zh: string;
            en: string;
        };
        sidebar_name: {
            overview: {
                dashboard: string;
                forms: string;
                lists: string;
            };
            user: {
                title: string;
                register: string;
                list: string;
                profile: string;
                privilege_control: string;
                payment: string;
            };
            air: {
                title: string;
                list: string;
                inspect: string;
                report_repair: string;
            };
            room: {
                title: string;
            };
            admin: {
                resources: string;
                profile: string;
            };
        };
    };
}
export interface I18nProvider {
    statics: I18nStaticVars;
}
