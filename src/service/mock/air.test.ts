import * as chai from 'chai';
import { AirService } from '../../dependency/service-concept';
import { matchResponse } from '../../dependency/protocol';
import { ServiceCode } from '../errors';
import { MockAirService } from './air';

const expect = chai.expect;

interface TestCase<C> {
    name: string;
    testFunc: (ctx: C) => () => void;
}

interface ASTCCtx {
    svcFac: () => AirService;
}

const StdAirSvcTestCases: TestCase<ASTCCtx>[] = [
    {
        name: 'create-ok',
        testFunc: ({ svcFac }: ASTCCtx) => () => {
            matchResponse(svcFac().Create('qwq'), () => 0);
        }
    },
    {
        name: 'get-id-ok',
        testFunc: ({ svcFac }: ASTCCtx) => () => {
            let aid: number;
            const svc = svcFac();
            matchResponse(svc.Create('qwq'), function(id: number) {
                aid = id;
            });
            matchResponse(svc.GetID('qwq'), function(id: number) {
                expect(aid).to.be.eq(id);
            });
            matchResponse(svc.GetID('QAQ'), function() {
                expect.fail('show not be ok');
            }, (code, data) => {
                expect(code).to.be.eq(ServiceCode.MockNotFound);
                expect(data).to.be.deep.eq({index: 'QAQ'});
            });
        }
    }
];

describe('MockAirService', () => {
    const ctx: ASTCCtx = {
        svcFac: () => new MockAirService()
    };
    for (const tc of StdAirSvcTestCases) {
        it(tc.name, tc.testFunc(ctx));
    }
});
