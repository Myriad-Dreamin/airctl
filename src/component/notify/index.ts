import { antd } from '../../dependency/antd';
import { SimplifiedResponse } from '../../dependency/protocol';

interface ErrorWithData extends Error, SimplifiedResponse<any> {}

function reportBase(
    factory: (props: {
        title: string;
        content: string;
    }) => {
        destroy: () => void;
    },
    title: string,
    message: string
) {
    const modal = factory({
        title: title,
        content: message,
    });
    setTimeout(() => {
        modal.destroy();
    }, 3000);
}

export function reportInfoS(message: string) {
    reportBase(antd.Modal.info, '通知', message);
}

export function reportErrorS(message: string) {
    reportBase(antd.Modal.error, '错误发生', message);
}

export function reportError(err: ErrorWithData) {
    if (err.stack) {
        console.error(err.stack);
    }

    return reportErrorS(`${err.name}: ${err.message}${err.data === undefined ? '' : ', ' + JSON.stringify(err.data)}`);
}
