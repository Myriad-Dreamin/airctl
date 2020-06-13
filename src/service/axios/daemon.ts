import { DaemonAdminService } from '../../dependency/x-service-concept';
import { AxiosInstance } from 'axios';
import { Response } from '../../dependency/protocol';

interface RawAdminLoginResponse {
    code: number;
    jwt_token: string;
    data?: string;
}

export class DaemonAdminServiceAxiosImpl implements DaemonAdminService {
    private readonly sender: AxiosInstance;
    private readonly url_provider: { [p: string]: string };

    constructor(sender: AxiosInstance, url_provider: { [index: string]: string }) {
        this.sender = sender;
        this.url_provider = url_provider;
    }

    async Ping(): Promise<Response<void>> {
        return (await this.sender.get<Response<void>>(this.url_provider['PingDaemon'])).data;
    }

    async AdminLogin(admin_token: string): Promise<Response<string>> {
        const res = await this.sender.post<RawAdminLoginResponse>(this.url_provider['AdminLogin'], { admin_token });
        res.data.data = res.data.jwt_token;
        return res.data;
    }
}
