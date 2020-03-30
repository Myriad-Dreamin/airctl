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

function assertError() {
    expect.fail('show not be ok');
}

const StdAirSvcTestCases: TestCase<ASTCCtx>[] = [
    {
        name: 'create-ok',
        testFunc: ({ svcFac }: ASTCCtx) => () => {
            const svc = svcFac();
            matchResponse(svc.Create('qwq'), (id) => expect(id > 0).to.true);
            matchResponse(svc.Create('qwq'), assertError, (code, data) => {
                expect(code).to.be.eq(ServiceCode.MockDuplicateKey);
                expect(data).to.instanceOf(Array);
                data.map((field: string) => expect(typeof field === 'string').to.be.true);
            });
        },
    },
    {
        name: 'get-id-ok',
        testFunc: ({ svcFac }: ASTCCtx) => () => {
            let aid: number;
            const svc = svcFac();
            const willNotExists = (index: string) =>
                matchResponse(svc.GetID(index), assertError, (code, data) => {
                    expect(code).to.be.eq(ServiceCode.MockNotFound);
                    expect(data).to.be.deep.eq({ index: index });
                });
            willNotExists('qwq');
            matchResponse(svc.Create('qwq'), function (id: number) {
                aid = id;
                expect(id > 0).to.true;
            });
            matchResponse(svc.GetID('qwq'), function (id: number) {
                expect(aid).to.be.eq(id);
            });
            willNotExists('QAQ');
        },
    },
];

describe('MockAirService', () => {
    const ctx: ASTCCtx = {
        svcFac: () => new MockAirService(),
    };
    for (const tc of StdAirSvcTestCases) {
        it(tc.name, tc.testFunc(ctx));
    }
});
