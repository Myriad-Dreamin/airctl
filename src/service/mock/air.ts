import { AirService } from '../../dependency/service-concept';
import { OK, JustOK, Payload, Response, SimplifiedResponse } from '../../dependency/protocol';
import { AirID, AirState, Auth, FullAirState, SettableAirState } from '../../dependency/concept';

const mockCode: number = 1 << 22;

interface DuplicateErrData {
    field: string;
    value: any;
}

interface NotFoundErrData {
    [index: string]: any;
}

function MockDuplicateKey(data: DuplicateErrData): Response<DuplicateErrData> {
    return {
        code: mockCode + 1,
        data: data,
    };
}

function MockNotFound(data: NotFoundErrData): Response<NotFoundErrData> {
    return {
        code: mockCode + 2,
        data: data,
    };
}

function MockTodo(): Response<undefined> {
    return { code: mockCode + 3 };
}

export class MockAirService implements AirService {
    protected readonly airs: FullAirState[];
    protected airMp: Map<string, FullAirState>;
    protected inc = 0;

    constructor(options?: { initialAirs?: FullAirState[] }) {
        this.airMp = new Map<string, FullAirState>();
        if (options?.initialAirs) {
            const airs = options?.initialAirs;
            this.airs = airs;
            for (const air of airs) {
                this.airMp.set(air.serialNumber, air);
            }
        } else {
            this.airs = [];
        }
        this.inc = this.airs.length + 1;
    }

    Create(serialNumber: string): Payload<AirID> | SimplifiedResponse<any> {
        if (this.airMp.has(serialNumber)) {
            return MockDuplicateKey({
                field: 'serialNumber',
                value: serialNumber,
            });
        }
        const air: FullAirState = {
            aid: this.inc++,
            available: false,
            degree: 0,
            is_on: false,
            serialNumber: '',
            target_degree: 0,
        };
        this.airs.push(air);
        this.airMp.set(serialNumber, air);
        return OK<AirID>({
            code: 0,
            data: air.aid,
        });
    }

    GetID(serialNumber: string): Payload<AirID> | SimplifiedResponse<any> {
        const maybeState = this.airMp.get(serialNumber);
        if (maybeState === undefined) {
            return MockNotFound({
                serialNumber,
            });
        }
        return OK<AirID>({
            code: 0,
            data: maybeState.aid,
        });
    }

    CheckState(aid: number): Payload<AirState> | SimplifiedResponse<any> {
        if (aid >= this.inc) {
            return MockNotFound({
                aid,
            });
        }

        return OK<AirState>({
            code: 0,
            data: this.airs[aid - 1],
        });
    }

    Grant(aid: number, id: Auth): SimplifiedResponse<any> {
        return MockTodo();
    }

    Revoke(aid: number, id: Auth): SimplifiedResponse<any> {
        return MockTodo();
    }

    SetState(aid: number, airState: SettableAirState): SimplifiedResponse<any> {
        if (aid >= this.inc) {
            return MockNotFound({
                aid,
            });
        }
        const state = this.airs[aid - 1];
        this.airs[aid - 1] = Object.assign(state, airState);
        this.airMp.set(state.serialNumber, state);
        return JustOK;
    }
}
