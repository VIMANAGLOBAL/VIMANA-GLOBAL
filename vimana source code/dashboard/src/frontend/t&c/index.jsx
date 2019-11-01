import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import App from './pages';

import { Provider } from 'react-redux';
import { BrowserRouter, Route } from 'react-router-dom';
import store from './store';

ReactDOM.render(
    <Provider store={store}>
        <BrowserRouter>
            <Route path="/terms-conditions" component={App} />
        </BrowserRouter>
    </Provider>,
    document.getElementById('root')
);
