import { UserService } from '../../dependency/service-concept';
import { AirID, BAuth, User, UserID, UserIdentifiers } from '../../dependency/concept';
import { OK, Response, SimplifiedResponse } from '../../dependency/protocol';
import { MockService, MockServiceIndex, Pick } from './mock';
import { MockRequiredOneOf } from '../errors';

class PNIndex extends MockServiceIndex<'phone_number', User> {}

export class MockUserService extends MockService<User> implements UserService {
    protected pnIndex: PNIndex;

    constructor(options?: { initialUsers?: User[] }) {
        super(options?.initialUsers);
        this.pnIndex = new PNIndex('phone_number', options?.initialUsers);
    }

    Register(ids: UserIdentifiers): Response<UserID> {
        return (
            this.pnIndex.shouldNotExist(ids.phone_number) ||
            (() => {
                const user: User = {
                    id: this.inc++,
                    money: 0,
                    ...ids,
                };
                this.appendData(user);
                this.pnIndex.appendData(user);
                return OK<UserID>({
                    code: 0,
                    data: user.id,
                });
            })()
        );
    }

    GetID({ phone_number }: BAuth): Response<AirID> {
        if (!phone_number) {
            return MockRequiredOneOf(['phone_number']);
        }
        return Pick('id', this.pnIndex.getData(phone_number));
    }

    Filter(): Response<User[]> {
        return OK<User[]>({
            code: 0,
            data: this.mockData,
        });
    }

    Delete(id: UserID): SimplifiedResponse<any> {
        return (
            super.delete(id) ||
            (() => {
                this.pnIndex.deleteData(this.mockData[id - 1]);
                return OK<undefined>({ code: 0, data: undefined });
            })()
        );
    }

    loginBy(id: BAuth, index: MockServiceIndex<keyof User, User>): SimplifiedResponse<any> | undefined {
        const prop = (id as any)[index.indexName];
        if (prop !== undefined) {
            return index.getData(prop);
        }
        return undefined;
    }
}
