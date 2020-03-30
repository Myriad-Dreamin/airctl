import * as chai from 'chai';
import { UserService } from '../../dependency/service-concept';
import { matchResponse } from '../../dependency/protocol';
import { ServiceCode } from '../errors';
import { MockUserService } from './user';

const expect = chai.expect;

interface TestCase<C> {
    name: string;
    testFunc: (ctx: C) => () => void;
}

interface ASTCCtx {
    svcFac: () => UserService;
}

function assertError() {
    expect.fail('show not be ok');
}

const StdUserSvcTestCases: TestCase<ASTCCtx>[] = [
    {
        name: 'register-ok',
        testFunc: ({ svcFac }: ASTCCtx) => () => {
            const svc = svcFac();
            matchResponse(
                svc.Register({
                    phone_number: 'qwq',
                }),
                () => 0
            );
            matchResponse(
                svc.Register({
                    phone_number: 'qwq',
                }),
                assertError,
                (code, data) => {
                    expect(code).to.be.eq(ServiceCode.MockDuplicateKey);
                    expect(data).to.instanceOf(Array);
                    data.map((field: string) => expect(typeof field === 'string').to.be.true);
                }
            );
        },
    },
    {
        name: 'delete-id-ok',
        testFunc: ({ svcFac }: ASTCCtx) => () => {
            let userID = 0;
            const svc = svcFac();
            matchResponse(
                svc.Register({
                    phone_number: 'qwq',
                }),
                (id: number) => {
                    userID = id;
                }
            );
            matchResponse(svc.Delete(userID));
        },
    },
    {
        name: 'get-id-ok',
        testFunc: ({ svcFac }: ASTCCtx) => () => {
            let aid: number;
            const svc = svcFac();
            const willNotExists = (index: string) =>
                matchResponse(svc.GetID({ phone_number: index }), assertError, (code, data) => {
                    expect(code).to.be.eq(ServiceCode.MockNotFound);
                    expect(data).to.be.deep.eq({ index: index });
                });
            willNotExists('qwq');
            matchResponse(svc.Register({ phone_number: 'qwq' }), function (id: number) {
                aid = id;
                expect(id > 0).to.true;
            });
            matchResponse(svc.GetID({ phone_number: 'qwq' }), function (id: number) {
                expect(aid).to.be.eq(id);
            });
            willNotExists('QAQ');
        },
    },
];

describe('MockUserService', () => {
    const ctx: ASTCCtx = {
        svcFac: () => new MockUserService(),
    };
    for (const tc of StdUserSvcTestCases) {
        it(tc.name, tc.testFunc(ctx));
    }
});
