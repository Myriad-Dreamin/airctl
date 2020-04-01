import { MockService, MockServiceIndex, Pick } from './mock';
import { FullRoom, RoomID } from '../../dependency/concept';
import { AirService, RoomService } from '../../dependency/service-concept';
import { OK, Payload, SimplifiedResponse } from '../../dependency/protocol';
import { MockAirService } from './air';


class RNIndex extends MockServiceIndex<'room_number', FullRoom> {}

export class MockRoomService extends MockService<FullRoom> implements RoomService {
    protected rnIndex: RNIndex;
    protected airService: AirService;

    constructor(options?: { initialRooms?: FullRoom[], airService: AirService }) {
        super(options?.initialRooms);
        this.rnIndex = new RNIndex('room_number', options?.initialRooms);
        this.airService = options?.airService || new MockAirService();
    }

    Create(roomNumber: string): Payload<RoomID> | SimplifiedResponse<any> {
        return (
            this.rnIndex.shouldNotExist(roomNumber) ||
            (() => {
                const room: FullRoom = {
                    rid: this.inc++,
                    room_number: roomNumber,
                };
                this.appendData(room);
                this.rnIndex.appendData(room);
                return OK<RoomID>({
                    code: 0,
                    data: room.rid,
                });
            })()
        );
    }

    GetID(roomNumber: string): Payload<number> | SimplifiedResponse<any> {
        return Pick('rid', this.rnIndex.getData(roomNumber));
    }

    Filter(cond: any): Payload<FullRoom[]> | SimplifiedResponse<any> {
        return OK<FullRoom[]>({
            code: 0,
            data: this.mockData,
        });
    }
}
