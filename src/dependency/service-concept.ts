import { MResponse, Response } from './protocol';
import {
    AirID,
    AirState,
    Auth,
    DegreeUnit,
    FullAirState,
    FullRoom,
    RoomID,
    SettableAirState,
    User,
    UserID,
    UserIdentifiers
} from './concept';

export interface UserService {
    // 用户注册
    // BAuth即Before Register Auth，标记用户唯一标识，要求BAuth中至少有一个标识非空
    // 生成临时账户或永久账户
    Register(id: UserIdentifiers): Response<UserID>;

    // 用户删除
    // 标记用户唯一标识，要求Auth中至少有一个标识非空
    // 当临时账户离开酒店时，可以强制销毁账户
    Delete(id: UserID): MResponse;
}

// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
interface UserServiceV2 extends UserService {
    // 用户充值
    // 充值的钱用于多种功能，这里只能用来给空调预交款
    Pay(id: Auth, money: number): MResponse;

    // 检查用户状态
    // 用来给前台小哥判断用户身份、账户余额
    CheckState(id: Auth): Response<User>;
}

export interface AirService {
    // 登记空调
    // 添加空调到系统
    Create(serialNumber: string): Response<AirID>;

    // 获取空调ID
    // 获取空调在系统中的ID
    GetID(serialNumber: string): Response<AirID>;

    // 授权空调
    // 给用户授权该空调的控制权
    Grant(aid: AirID, id: Auth): MResponse;

    // 回收空调权力
    // 回收授予给用户的空调的控制权
    Revoke(aid: AirID, id: Auth): MResponse;

    // 检查空调状态
    // 方便前台在旅客未进入房门的时候告知空调状态
    CheckState(aid: AirID): Response<AirState>;

    // 设置空调状态
    // 方便前台小哥帮忙远程操作空调
    SetState(aid: AirID, airState: SettableAirState): MResponse;
}

interface AirServiceV3 extends AirService {
    // 授权空调
    // 可以无视用户是否欠费，强制给用户控制空调的权力
    Grant(aid: AirID, id: Auth, force?: boolean): MResponse;

    // 回收空调权力
    // 可以无视用户是否欠费，强制回收授予给用户的空调的控制权
    Revoke(aid: AirID, id: Auth, force?: boolean): MResponse;
}

// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
interface AirServiceV4 extends AirServiceV3 {
    // 提交检修订单
    // 前台小哥发现空调用不了了，向系统提交检修订单
    RequireRepair(aid: AirID): MResponse;

    // 查看多个空调
    // 管理系统，根据条件查询空调
    List(cond: any): Response<FullAirState[]>;

    // 设置目标温度
    // 是SetState的包装接口，无需单独说明
    SetTargetDegree(aid: AirID, tDeg: DegreeUnit): MResponse;

    // 删除空调
    // 空调被淘汰了，将空调从系统中删除
    Delete(aid: AirID): MResponse;
}

export interface RoomService {
    // 登记房间
    // 添加房间到系统
    Create(roomNumber: string): Response<RoomID>;

    // 获取房间ID
    // 获取房间在系统中的ID
    GetID(roomNumber: string): Response<RoomID>;

    // 查看多个房间
    // 管理系统，根据条件查询房间
    List(cond: any): Response<FullRoom[]>;
}

interface RoomServiceV2 extends RoomService {
    // 授权房间
    // 给用户授权该房间中设备的控制权
    Grant(rid: RoomID, id: Auth): MResponse;

    // 回收房间权力
    // 回收授予给用户的房间中设备的控制权
    Revoke(rid: RoomID, id: Auth): MResponse;

    // 检查房间中的空调
    // 如果有问题，提前告知旅客
    CheckAirState(rid: RoomID): Response<FullAirState[]>;
}

// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
interface RoomServiceV3 extends RoomServiceV2 {
    // 授权房间
    // 可以无视用户是否欠费，强制给用户控制房间中设备的权力
    Grant(rid: RoomID, id: Auth, force?: boolean): MResponse;

    // 回收房间权力
    // 可以无视用户是否欠费，强制回收授予给用户的房间中设备的控制权
    Revoke(rid: RoomID, id: Auth, force?: boolean): MResponse;

    // 删除房间
    // 房间被炸了，将房间从系统中删除
    Delete(rid: RoomID): MResponse;
}

//
