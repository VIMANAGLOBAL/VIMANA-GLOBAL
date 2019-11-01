import { LOGIN_FAILED, LOGIN_SEND, LOGIN_SUCCESS } from '../constants/ActionType';
import { getFetchInitProps } from '../../common/util/request';

export const loginSend = (username, password) => ({
    type: LOGIN_SEND,
    payload: {
        username,
        password
    }
});

export const loginSuccess = () => ({
    type: LOGIN_SUCCESS
});

export const loginFailed = (errorCode) => ({
    type: LOGIN_FAILED,
    errorCode
});

export const login = (username, password) => (dispatch) => {
    const url = '/api/admin/login';

    dispatch(loginSend(username, password));

    fetch(url, getFetchInitProps('POST', JSON.stringify({ username, password })))
        .then((res) => res.json())
        .then((res) => {
            if (res && res.success) {
                dispatch(loginSuccess(res.payload));
                document.location.href = `/admin/panel`;
            } else {
                throw new Error(res.errorCode);
            }
        })
        .catch((err) => {
            dispatch(loginFailed(err.message));
        });
};
