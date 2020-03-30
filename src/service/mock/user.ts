import { UserService } from '../../dependency/service-concept';
import { BAuth, User, UserID, UserIdentifiers } from '../../dependency/concept';
import { OK, Response, SimplifiedResponse } from '../../dependency/protocol';
import { MockService, MockServiceIndex } from './mock';

class PNIndex extends MockServiceIndex<'phone_number', User> {
}

export class MockUserService extends MockService<User> implements UserService {
    protected pnIndex: PNIndex;

    constructor(options?: { initialUsers?: User[] }) {
        super(options?.initialUsers);
        this.pnIndex = new PNIndex('phone_number', options?.initialUsers);
    }

    Register(ids: UserIdentifiers): Response<UserID> {
        return this.pnIndex.shouldNotExist(ids.phone_number) || (() => {
            let user: User = {
                id: this.inc++,
                money: 0,
                ...ids
            };
            this.appendData(user);
            return OK<UserID>({
                code: 0,
                data: user.id
            });
        })();
    }

    Delete(id: UserID): SimplifiedResponse<any> {
        return super.delete(id) || (() => {
            this.pnIndex.deleteData(this.mockData[id - 1]);
            return OK<undefined>({ code: 0, data: undefined });
        })();
    }

    loginBy(id: BAuth, index: MockServiceIndex<keyof User, User>): SimplifiedResponse<any> | undefined {
        let prop = (id as any)[index.indexName];
        if (prop !== undefined) {
            return index.getData(prop);
        }
        return undefined;
    }
}



