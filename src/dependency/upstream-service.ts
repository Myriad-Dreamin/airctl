import { AirID, AirState, Auth, BAuth, FullAirState, FullRoom, RoomID, SettableAirState } from './concept';
import { MResponse, Response } from './protocol';
import { AirService, RoomService, UserService } from './service-concept';

interface UserRegisterRequest extends BAuth {}

interface UserDeleteRequest extends Auth {}

interface UserPayRequest extends Auth {
    money: number;
}

export interface RemoteUserService extends UserService {
    register(req: UserRegisterRequest): MResponse;

    delete(req: UserDeleteRequest): MResponse;

    pay(req: UserPayRequest): MResponse;
}

interface AirModifyContext {
    aid: AirID;
}

interface AirCreateRequest {
    serialNumber: string;
}

interface AirQueryRequest {
    serialNumber: string;
}

interface AirGrantRequest extends AirModifyContext {
    id: Auth;
    force: boolean;
}

interface AirRevokeRequest extends AirModifyContext {
    id: Auth;
    force: boolean;
}

interface AirCheckStateRequest extends AirModifyContext {}

interface AirRequireRepairRequest extends AirModifyContext {}

interface AirSetStateRequest extends AirModifyContext, SettableAirState {}

export interface RemoteAirService extends AirService {
    create(req: AirCreateRequest): Response<AirID>;

    getID(req: AirQueryRequest): Response<AirID>;

    grant(req: AirGrantRequest): MResponse;

    revoke(req: AirRevokeRequest): MResponse;

    checkState(req: AirCheckStateRequest): Response<AirState>;

    requireRepair(req: AirRequireRepairRequest): MResponse;

    setState(req: AirSetStateRequest): MResponse;
}

interface RoomModifyContext {
    rid: RoomID;
}

interface RoomGrantRequest extends RoomModifyContext {
    id: Auth;
    force: boolean;
}

interface RoomCreateRequest {
    roomNumber: string;
}

interface RoomQueryRequest {
    roomNumber: string;
}

type RoomListRequest = any;

interface RoomRevokeRequest extends RoomModifyContext {
    id: Auth;
    force: boolean;
}

interface RoomCheckAirStateRequest extends RoomModifyContext {}

export interface RemoteRoomService extends RoomService {
    create(req: RoomCreateRequest): Response<RoomID>;

    getID(req: RoomQueryRequest): Response<RoomID>;

    list(cond: RoomListRequest): Response<FullRoom[]>;

    grant(req: RoomGrantRequest): MResponse;

    revoke(req: RoomRevokeRequest): MResponse;

    checkAirState(req: RoomCheckAirStateRequest): Response<FullAirState[]>;
}
