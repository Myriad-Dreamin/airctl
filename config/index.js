
let config = {
    // 主控服务器的守护服务器，提供HTTP服务
    // DaemonURL: 'http://localhost:23102',
    DaemonURL: 'http://112.126.65.59:2024',
    // 主控服务器，提供HTTP服务和Websocket服务
    // MasterURL: 'http://localhost:23101',
    MasterURL: 'http://112.126.65.59:2022',

    urlProvider: {},
};

const { DaemonURL, MasterURL } = config;

config.urlProvider = {
    AdminLogin: DaemonURL + '/v1/admin/login',
    PingDaemon: DaemonURL + '/ping',
    PingMaster: MasterURL + '/ping',
    GetConnectedSlaves: MasterURL + '/v1/admin/pool-list',
    GetConnectedSlave: MasterURL + '/v1/admin/pool',
    GetServerStatus: MasterURL + '/v1/admin/status',
    SetCurrentTemperature: MasterURL + '/v1/admin/current-temp',
    SetMode: MasterURL + '/v1/admin/mode',
    GetSlaveStatistics: MasterURL + '/v2/admin/slave/statistics',
    GetRoomCount: MasterURL + '/v1/admin/slave/pool-list-count',
    MasterBootMaster: MasterURL + '/v1/admin/boot',
    MasterShutdownMaster: MasterURL + '/v1/admin/shutdown',
    SetMetricsDelay: MasterURL + '/v1/admin/metrics-delay',
    SetUpdateDelay: MasterURL + '/v1/admin/update-delay',
    GetReport: MasterURL + '/v1/admin/report'
};

export default config;
