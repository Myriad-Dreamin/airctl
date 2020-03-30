// 用户在系统中被分配的增量ID: number <= 2^61
export type UserID = number;
// 房间在系统中被分配的增量ID
export type RoomID = number;
// 空调在系统中被分配的增量ID
export type AirID = number;
// 摄氏度
export type CelsiusDegree = number;
// 温度单位 = 摄氏度 | （如果是美国人，用华氏度，等等）
export type DegreeUnit = CelsiusDegree;

// 一个用户可以被哪些字段唯一确认？
export interface FullUserIdentifiers {
    phone_number: string;
    // 用户在系统中被分配的增量ID
    id: UserID;
    // 昵称
    // name?: string;
    // email?: string;
}

export type UserIdentifiers = Pick<FullUserIdentifiers, 'phone_number'>;

// 一个用户可以被哪些字段唯一确认？
export type BAuth = Partial<UserIdentifiers>;
// 一个注册过的用户可以被哪些字段唯一确认？
export type Auth = Partial<FullUserIdentifiers>;

// 描述一个真实世界的用户对象
export interface User extends FullUserIdentifiers {
    money: number;
}

// 描述一个空调数据对象
export interface FullAirState {
    aid: AirID;
    serial_number: string;
    available: boolean;
    is_on: boolean;
    // 在未来的版本中可能会开启
    // repairing: boolean;
    target_degree: CelsiusDegree;
    // 空调造成的环境温度，只读
    degree: CelsiusDegree;
}

// 描述一个真实世界的空调对象
export type AirState = Omit<FullAirState, 'aid'>;

// 描述一个空调对象中可以修改的字段
export type SettableAirState = Pick<FullAirState, 'available' | 'is_on' | 'target_degree' /* | 'repairing' */>;

// 描述一个房间数据对象
export interface FullRoom {
    rid: RoomID;
    roomNumber: string;
}
