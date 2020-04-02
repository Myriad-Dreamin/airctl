import { AirService } from '../../dependency/service-concept';
import { JustOK, OK, Payload, Response, SimplifiedResponse } from '../../dependency/protocol';
import { AirID, AirState, Auth, FullAirState, SettableAirState } from '../../dependency/concept';
import { MockService, MockServiceIndex, Pick } from './mock';
import { MockNotFound, MockTodo } from '../errors';

class SNIndex extends MockServiceIndex<'serial_number', FullAirState> {}
export class MockAirService extends MockService<FullAirState> implements AirService {
    protected snIndex: SNIndex;

    constructor(options?: { initialAirs?: FullAirState[] }) {
        super(options?.initialAirs);
        this.snIndex = new SNIndex('serial_number', options?.initialAirs);
    }

    Create(serialNumber: string): Payload<AirID> | SimplifiedResponse<any> {
        return (
            this.snIndex.shouldNotExist(serialNumber) ||
            (() => {
                const air: FullAirState = {
                    aid: this.inc++,
                    available: false,
                    degree: 0,
                    is_on: false,
                    serial_number: serialNumber,
                    target_degree: 0,
                };
                this.snIndex.appendData(air);
                this.appendData(air);
                return OK<AirID>({
                    code: 0,
                    data: air.aid,
                });
            })()
        );
    }

    GetID(serialNumber: string): Response<AirID> {
        return Pick('aid', this.snIndex.getData(serialNumber));
    }

    CheckState(aid: number): Payload<AirState> | SimplifiedResponse<any> {
        return this.Get(aid);
    }

    SetState(aid: number, airState: SettableAirState): SimplifiedResponse<any> {
        if (aid >= this.inc) {
            return MockNotFound({
                aid,
            });
        }
        const state = this.mockData[aid - 1];
        this.mockData[aid - 1] = Object.assign(state, airState);
        this.snIndex.set(state.serial_number, state);
        return JustOK;
    }

    Grant(aid: number, id: Auth): SimplifiedResponse<any> {
        return MockTodo();
    }

    Revoke(aid: number, id: Auth): SimplifiedResponse<any> {
        return MockTodo();
    }

    Filter(cond: any): Payload<FullAirState[]> | SimplifiedResponse<any> {
        return OK<FullAirState[]>({
            code: 0,
            data: this.mockData,
        });
    }

    RequireRepair(aid: number): SimplifiedResponse<any> {
        return OK<undefined>({
            code: 0,
            data: undefined,
        });
    }

    SetTargetDegree(aid: number, tDeg: number): SimplifiedResponse<any> {
        return this.SetState(aid, { target_degree: tDeg });
    }
}
