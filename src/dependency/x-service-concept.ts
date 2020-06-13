import { Response } from './protocol';

export type Mode = 'heat' | 'cool' | 'non';
export type ReportType = 'day' | 'week' | 'month';
export type FanSpeed = 'low' | 'mid' | 'high';

export interface ServerStatus {
    mode: Mode;
    work_state: 'busy' | 'working' | 'idle';
    current_temperature: number;
    metric_delay: number;
    update_delay: number;
}

export interface SlaveStatistics {
    energy: number;
    cost: number;
}

export type todo = undefined;

export interface Report {
    room_list: todo;
}

export interface DaemonAdminService {
    Ping(): Promise<Response<void>>;

    AdminLogin(admin_token: string): Promise<Response<string>>;
}

export interface Connection {
    id: number;
    room_id: string;
    connected: boolean;
    current_temperature?: number;
    need_fan?: boolean;
    fan_speed?: FanSpeed;
}

export interface AdminService {
    Ping(): Promise<Response<void>>;

    SetMode(mode: Mode): Promise<Response<undefined>>;

    SetCurrentTemperature(temperature: number): Promise<Response<undefined>>;

    GetServerStatus(): Promise<Response<ServerStatus>>;

    GetSlaveStatistics(room_id: number, start_time: Date, stop_time: Date): Promise<Response<SlaveStatistics>>;

    GetReport(room_id: number, report_type: ReportType, stop_time: Date): Promise<Response<Report>>;

    GetConnectedSlaves(page_number: number, page_size: number): Promise<Response<Connection[]>>;
}
