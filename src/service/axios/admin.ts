import { AxiosInstance } from 'axios';
import { AdminService, Connection, Report, ServerStatus, SlaveStatistics } from '../../dependency/x-service-concept';
import { Response } from '../../dependency/protocol';

export class AdminServiceAxiosImpl implements AdminService {
    private readonly sender: AxiosInstance;
    private readonly url_provider: { [p: string]: string };

    constructor(sender: AxiosInstance, url_provider: { [index: string]: string }) {
        this.sender = sender;
        this.url_provider = url_provider;
    }

    async Ping(): Promise<Response<void>> {
        return (await this.sender.get<Response<void>>(this.url_provider['PingMaster'])).data;
    }

    async GetConnectedSlaves(page_number: number, page_size: number): Promise<Response<Connection[]>> {
        return (
            await this.sender.get<Response<Connection[]>>(this.url_provider['GetConnectedSlaves'], {
                params: { page_number, page_size },
            })
        ).data;
    }

    async GetConnectedSlave(id: number): Promise<Response<Connection[]>> {
        return (
            await this.sender.get<Response<Connection>>(this.url_provider['GetConnectedSlave'], {
                params: { id },
            })
        ).data;
    }

    async GetReport(
        room_id: number,
        report_type: 'day' | 'week' | 'month',
        stop_time: Date
    ): Promise<Response<Report>> {
        throw Error('todo');
    }

    async GetServerStatus(): Promise<Response<ServerStatus>> {
        const res = await this.sender.get<Response<ServerStatus>>(this.url_provider['GetServerStatus']);
        res.data.data = res.data;
        return res.data;
    }

    async GetSlaveStatistics(room_id: number, start_time: Date, stop_time: Date): Promise<Response<SlaveStatistics>> {
        throw Error('todo');
    }

    async SetCurrentTemperature(target: number): Promise<Response<undefined>> {
        return (await this.sender.post<Response<undefined>>(this.url_provider['SetCurrentTemperature'], { target }))
            .data;
    }

    async SetMode(mode: 'heat' | 'cool' | 'non'): Promise<Response<undefined>> {
        return (await this.sender.post<Response<undefined>>(this.url_provider['SetMode'], { mode })).data;
    }
}
