// import * as chai from 'chai';
import { UserService } from '../../dependency/service-concept';
import { matchResponse } from '../../dependency/protocol';
// import { ServiceCode } from '../errors';
import { MockUserService } from './user';

// const expect = chai.expect;

interface TestCase<C> {
    name: string;
    testFunc: (ctx: C) => () => void;
}

interface ASTCCtx {
    svcFac: () => UserService;
}

const StdUserSvcTestCases: TestCase<ASTCCtx>[] = [
    {
        name: 'register-ok',
        testFunc: ({ svcFac }: ASTCCtx) => () => {
            matchResponse(svcFac().Register({
                phone_number: 'qwq',
            }), () => 0);
        }
    },
    {
        name: 'delete-id-ok',
        testFunc: ({ svcFac }: ASTCCtx) => () => {
            let userID: number = 0;
            const svc = svcFac();
            matchResponse(svc.Register({
                phone_number: 'qwq',
            }), (id: number) => {
                userID = id;
            });
            matchResponse(svc.Delete(userID));
        }
    },
    // {
    //     name: 'get-id-ok',
    //     testFunc: ({ svcFac }: ASTCCtx) => () => {
    //         let userID: number;
    //         const svc = svcFac();
    //         matchResponse(svc.Create('qwq'), function(id: number) {
    //             userID = id;
    //         });
    //         matchResponse(svc.GetID('qwq'), function(id: number) {
    //             expect(userID).to.be.eq(id);
    //         });
    //         matchResponse(svc.GetID('QAQ'), function() {
    //             expect.fail('show not be ok');
    //         }, (code, data) => {
    //             expect(code).to.be.eq(ServiceCode.MockNotFound);
    //             expect(data).to.be.deep.eq({index: 'QAQ'});
    //         });
    //     }
    // }
];

describe('MockUserService', () => {
    const ctx: ASTCCtx = {
        svcFac: () => new MockUserService()
    };
    for (const tc of StdUserSvcTestCases) {
        it(tc.name, tc.testFunc(ctx));
    }
});
