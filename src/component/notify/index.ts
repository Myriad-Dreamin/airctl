import { antd } from '../../dependency/antd';
import { SimplifiedResponse } from '../../dependency/protocol';

interface ErrorWithData extends Error, SimplifiedResponse<any> {}

// 错误警告，不能使用在UI未初始化的地方，可替代的方案是console.error（UI安全的）
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

// 错误警告辅助函数
export function reportInfoS(message: string) {
    reportBase(antd.Modal.info, '通知', message);
}

// 错误警告辅助函数
export function reportErrorS(message: string) {
    reportBase(antd.Modal.error, '错误发生', message);
}

// 错误警告辅助函数
export function reportErrorE(err: Error) {
    reportBase(antd.Modal.error, '错误发生', err.message);
}

// 错误警告辅助函数
export function reportError(err: ErrorWithData) {
    if (err.stack) {
        console.error(err.stack);
    }

    return reportErrorS(`${err.name}: ${err.message}${err.data === undefined ? '' : ', ' + JSON.stringify(err.data)}`);
}

export function reportErrorC(code: number, error: any) {
    return reportErrorS(`Code(${code}): ${JSON.stringify(error)}`);
}
