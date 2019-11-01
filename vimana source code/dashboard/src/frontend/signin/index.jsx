import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import Auth from './pages/index';

import { Provider } from 'react-redux';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import store from './store';

ReactDOM.render(
    <Provider store={store}>
        <BrowserRouter>
            <Switch>
                <Route path="/" component={Auth} />
            </Switch>
        </BrowserRouter>
    </Provider>,
    document.getElementById('root')
);
