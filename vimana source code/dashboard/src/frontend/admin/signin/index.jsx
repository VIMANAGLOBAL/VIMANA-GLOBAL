import './index.scss';
import React from 'react';
import ReactDOM from 'react-dom';
import thunk from 'redux-thunk';
import { createLogger } from 'redux-logger';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import reducer from './reducers';
import Main from './containers/Main';
import { initialState } from './state';

const store = createStore(reducer, initialState, applyMiddleware(thunk, createLogger()));
ReactDOM.render(
    <Provider store={store}>
        <BrowserRouter>
            <Switch>
                <Route path="/admin/signin" component={Main} />
            </Switch>
        </BrowserRouter>
    </Provider>,
    document.getElementById('root')
);
