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


    async AdminLogin(admin_token: string): Promise<Response<string>> {
        let res = await this.sender.post<RawAdminLoginResponse>(this.url_provider['AdminLogin'],
            { admin_token });
        res.data.data = res.data.jwt_token;
        return res.data;
    }
}


