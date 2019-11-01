import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import App from './pages';

import { Provider } from 'react-redux';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import store from './store';

ReactDOM.render(
    <Provider store={store}>
        <BrowserRouter>
            <Switch>
                <Route path="/dashboard" component={App} />
            </Switch>
        </BrowserRouter>
    </Provider>,
    document.getElementById('root')
);
