import { Localization as MaterialTableLocalization } from 'material-table';

// I18n接口
export interface I18nStaticVars {
    global: {
        general: {
            yes: string;
            no: string;
            available: string;
            not_available: string;
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
            shutdown: string;
            boot: string;
        };
        room_inspect: {
            slave_state_title: string;
            latest_table_name: string;
            room_number_label: string;
            room_name_label: string;
            is_connected_label: string;
            current_temperature_label: string;
            is_waiting_scheduling_label: string;
            scheduling_fan_speed_label: string;
            table: {
                id: string;
                start_time: string;
                stop_time: string;
                consumed_energy: string;
                cost: string;
                fan_speed: string;
            };
        };
        room_report: {
            daily_button_title: string;
            weekly_button_title: string;
            monthly_button_title: string;
            slave_report_table_name: string;
            slave_report_ps: string;
            room_name_label: string;
            boot_shutdown_times_label: string;
            total_consumed_energy_label: string;
            total_cost_label: string;
            table: {
                id: string;
                start_time: string;
                stop_time: string;
                start_temperature: string;
                stop_temperature: string;
                consumed_energy: string;
                cost: string;
            };
        };
    };
}
export interface I18nProvider {
    statics: I18nStaticVars;
}
