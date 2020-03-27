import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { AppRouter, AppDependencyContainer } from './view';
import { MockAirService } from './service/mock/air';
import { MockData } from './mock/indes';

let deps: AppDependencyContainer;

async function main() {
    const { default: airData } = await MockData.airData();

    deps = {
        airService: new MockAirService({
            initialAirs: airData,
        }),
    };

    ReactDOM.render(
        <div>
            <AppRouter {...deps} />
        </div>,
        document.querySelector('#app')
    );
}

main().catch(console.error);
