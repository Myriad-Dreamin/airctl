import { I18nStaticVars } from '../dependency/i18n';

// 中文I18n
export const I18nSimplifiedChineseDataProvider: I18nStaticVars = {
    global: {
        general: {
            yes: '是',
            no: '否',
        },
        material_table_localization: {
            body: {
                emptyDataSourceMessage: '没有信息',
                // filterRow: {
                //     filterTooltip: ''
                // },
                // editRow: {
                //     saveTooltip: '',
                //     cancelTooltip: '',
                //     deleteText: ''
                // },
                // addTooltip: '',
                // deleteTooltip: '',
                // editTooltip: ''
            },
            header: {
                actions: '动作',
            },
            // grouping: {
            //     groupedBy: '',
            //     placeholder: ''
            // },
            pagination: {
                firstTooltip: '第一页',
                // firstAriaLabel: '',
                previousTooltip: '上一页',
                // previousAriaLabel: '',
                nextTooltip: '下一页',
                // nextAriaLabel: '',
                // labelDisplayedRows: '',
                // labelRowsPerPage: '',
                lastTooltip: '最后一页',
                // lastAriaLabel: '',
                labelRowsSelect: '行每页',
            },
            toolbar: {
                // addRemoveColumns: '',
                // nRowsSelected: '',
                // showColumnsTitle: '',
                // showColumnsAriaLabel: '',
                // exportTitle: '',
                // exportAriaLabel: '',
                // exportName: '',
                // searchTooltip: '',
                // searchPlaceholder: ''
            },
        },
        locale_name: { en: '英文', zh: '中文' },
        sidebar_name: {
            admin: { profile: '个人中心', resources: '资源表单' },
            air: { inspect: '详情页', list: '列表', report_repair: '报修', title: '空调服务清单' },
            overview: { dashboard: 'Dashboard', forms: '表单汇总', lists: '列表汇总' },
            room: { inspect: '详情页', title: '房间服务清单', report: 'Report' },
            user: {
                list: '列表',
                payment: '预缴服务费',
                privilege_control: '特权控制',
                profile: '查询详情',
                register: '登记用户',
                title: '用户服务清单',
            },
        },
        dashboard: {
            current_connection_cnt: '目前处理请求数',
            max_connection_cnt_seg_1: '最近5分钟',
            max_connection_cnt_seg_2: '最大处理请求数',
            real_time_performance_graph: '实时性能监测图',
            incoming: '（敬请期待）',
            room_inc_id: '房间序号',
            room_id: '房间名',
            slave_connected: '从控连接',
            inspect_slave_tooltip: '查看详情',
            report_slave_tooltip: '查看报表',
            master_state_title: '主控状态',
            server_open_label: '服务器是否开启：',
            server_available_label: '服务器是否可用：',
            daemon_open_label: '服务器守护是否开启：',
            master_working_state_label: '主控工作状态：',
            set_current_temperature_label: '设置当前空调温度(℃)：',
            current_temperature_label: '当前空调温度(℃)：',
            set_current_air_mode: '设置当前空调模式：',
            current_air_mode: '当前空调模式：',
            set_slave_push_metrics_delay_label: '设置从控更新周期(ms)：',
            slave_push_metrics_delay_label: '从控更新周期(ms)：',
            set_slave_update_statistics_delay_label: '设置从控拉取周期(ms)：',
            slave_update_statistics_delay_label: '从控拉取周期(ms)：',
        },
    },
};
