import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { App } from './components/App';
import { actionRunner } from './ts/app';

ReactDOM.render(
    <App appState={actionRunner.stack}
        handleClickOnWidgetSample={actionRunner.handleMouseDown}
    />,
    document.getElementById('root'),
);
