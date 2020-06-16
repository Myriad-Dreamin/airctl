import { Localization as MaterialTableLocalization } from 'material-table';

// I18n接口
export interface I18nStaticVars {
    global: {
        general: {
            yes: string;
            no: string;
        };
        material_table_localization?: MaterialTableLocalization;
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
                inspect: string;
                report: string;
            };
            admin: {
                resources: string;
                profile: string;
            };
        };
        dashboard: {
            current_connection_cnt: string;
            max_connection_cnt_seg_1: string;
            max_connection_cnt_seg_2: string;
            real_time_performance_graph: string;
            incoming: string;
            room_inc_id: string;
            room_id: string;
            slave_connected: string;
            inspect_slave_tooltip: string;
            report_slave_tooltip: string;
            master_state_title: string;
            server_open_label: string;
            server_available_label: string;
            daemon_open_label: string;
            master_working_state_label: string;
            set_current_temperature_label: string;
            current_temperature_label: string;
            set_current_air_mode: string;
            current_air_mode: string;
            set_slave_push_metrics_delay_label: string;
            slave_push_metrics_delay_label: string;
            set_slave_update_statistics_delay_label: string;
            slave_update_statistics_delay_label: string;
        };
    };
}
export interface I18nProvider {
    statics: I18nStaticVars;
}
