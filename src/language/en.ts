import { I18nStaticVars } from '../dependency/i18n';

// 英文I18n
export const I18nEnglishDataProvider: I18nStaticVars = {
    global: {
        general: {
            yes: 'Yes',
            no: 'No',
        },
        locale_name: { en: 'English', zh: 'Chinese' },
        sidebar_name: {
            admin: { profile: 'Profile', resources: 'Resources' },
            air: { inspect: 'Inspect', list: 'List', report_repair: 'Report Repair', title: 'Air' },
            overview: { dashboard: 'Dashboard', forms: 'Forms', lists: 'Lists' },
            room: { title: 'Room', inspect: 'Inspect', report: 'Report' },
            user: {
                list: 'List',
                payment: 'Payment',
                privilege_control: 'Privilege Control',
                profile: 'Profile',
                register: 'Register',
                title: 'User',
            },
        },
        dashboard: {
            current_connection_cnt: 'Current conn count',
            max_connection_cnt_seg_1: 'Max conn count',
            max_connection_cnt_seg_2: 'in latest 5 min',
            real_time_performance_graph: 'Real Time Performance Graph',
            incoming: '(Incoming)',
            room_inc_id: 'ID',
            room_id: 'RoomID',
            slave_connected: 'Connected',
            inspect_slave_tooltip: 'Inspect Slave',
            report_slave_tooltip: 'Slave Report',
            master_state_title: 'Master State',
            server_open_label: 'Server Opened:',
            server_available_label: 'Server Available:',
            daemon_open_label: 'Daemon Opened:',
            master_working_state_label: 'Master Working State:',
            set_current_temperature_label: 'Set Current Temperature (℃):',
            current_temperature_label: 'Current Temperature (℃):',
            set_current_air_mode: 'Set Current Air Mode:',
            current_air_mode: 'Current Air Mode:',
            set_slave_push_metrics_delay_label: 'Set Slave Push Metrics Delay(ms):',
            slave_push_metrics_delay_label: 'Slave Push Metrics Delay(ms):',
            set_slave_update_statistics_delay_label: 'Set Slave Update Statistics Delay(ms):',
            slave_update_statistics_delay_label: 'Slave Update Statistics Delay(ms):',
        },
    },
};
