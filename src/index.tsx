import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { AppRouter, AppDependencyContainer } from './view';

const deps: AppDependencyContainer = {};

ReactDOM.render(
    <div>
        <AppRouter {...deps} />
    </div>,
    document.querySelector('#app')
);
