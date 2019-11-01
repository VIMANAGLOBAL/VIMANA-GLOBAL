import { LOGOUT_FAILED, LOGOUT_SEND, LOGOUT_SUCCESS } from '../constants/ActionType';
import { getFetchInitProps } from '../../common/util/request';

export const logoutSend = () => ({
    type: LOGOUT_SEND
});

export const logoutSuccess = () => ({
    type: LOGOUT_SUCCESS
});

export const logoutFailed = (errorCode) => ({
    type: LOGOUT_FAILED,
    errorCode
});

export const logout = () => (dispatch) => {
    const url = '/api/admin/logout';

    dispatch(logoutSend());

    fetch(url, getFetchInitProps('GET'))
        .then((res) => res.json())
        .then((res) => {
            if (res && res.success) {
                dispatch(logoutSuccess());
                document.location.href = `/admin/signin`;
            } else {
                throw new Error(res.errorCode);
            }
        })
        .catch((err) => {
            dispatch(logoutFailed(err.message));
        });
};
