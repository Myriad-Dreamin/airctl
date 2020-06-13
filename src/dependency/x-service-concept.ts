import { Response } from './protocol';

export type Mode = 'heat' | 'cool' | 'non';
export type ReportType = 'day' | 'week' | 'month';
export type FanSpeed = 'low' | 'mid' | 'high';

export interface ServerStatus {
    server_state: 'busy' | 'working' | 'idle';
    mode: Mode;
}

export interface SlaveStatistics {
    energy: number;
    cost: number;
}

export type todo = undefined;

export interface Report {
    room_list: todo;
}

export interface Report {
    id: number;
    room_id: string;
    connected: boolean;
    current_temperature: number;
    need_fan: boolean;
    fan_speed: FanSpeed;
}


export interface DaemonAdminService {
    AdminLogin(admin_token: string): Promise<Response<string>>;
}


export interface AdminService {
    SetMode(mode: Mode): Response<undefined>;

    SetCurrentTemperature(temperature: number): Response<undefined>;

    GetServerStatus(): Response<ServerStatus>;

    GetSlaveStatistics(room_id: number, start_time: Date, stop_time: Date): Response<SlaveStatistics>;

    GetReport(room_id: number, report_type: ReportType, stop_time: Date): Response<Report>;

    GetConnectedSlaves(page_number: number, page_size: number): Response<SlaveStatistics>;
}
