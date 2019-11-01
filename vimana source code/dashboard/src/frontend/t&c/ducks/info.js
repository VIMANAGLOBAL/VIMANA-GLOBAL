import { handleFetch } from '../../common/helpers/fetch';
import { internalError } from '../../common/helpers/alert';

const GET_STATS = 'GET_STATS';
const GET_BALANCE = 'GET_BALANCE';
const SHOW_ALERT = 'SHOW_ALERT';
const HIDE_ALERT = 'HIDE_ALERT';

const initialState = {
    email: '',
    country: '',
    enable2fa: null,
    balance: 0,
    alert: {
        show: false,
        title: ''
    }
};

export default (state = initialState, { type, payload }) => {
    switch (type) {
        case GET_STATS:
            return {
                ...state,
                email: payload.email,
                country: payload.country,
                enable2fa: payload.enabled2fa
            };
        case GET_BALANCE:
            return {
                ...state,
                balance: payload
            };
        case SHOW_ALERT:
            return {
                ...state,
                alert: {
                    title: payload.title,
                    show: true,
                    type: payload.type
                }
            };
        case HIDE_ALERT:
            return {
                ...state,
                alert: {
                    ...state.alert,
                    show: false
                }
            };
        default:
            return state;
    }
};

const getUserInfoAction = (payload) => ({
    type: GET_STATS,
    payload
});

const getUserBalanceAction = (payload) => ({
    type: GET_BALANCE,
    payload
});

export const showAlertAction = (payload) => (dispatch) => {
    dispatch({ type: SHOW_ALERT, payload });
    setTimeout(() => dispatch({ type: HIDE_ALERT }), 2500);
};

export const getUserInfo = () => (dispatch) => {
    handleFetch('/dashboard/user-info', 'GET')
        .then(({ payload }) => dispatch(getUserInfoAction(payload)))
        .catch(() => dispatch(showAlertAction({ title: internalError, type: 'error' })));
};

export const getBalanceInfo = () => (dispatch) => {
    handleFetch('/dashboard/balance', 'GET')
        .then(({ payload }) => dispatch(getUserBalanceAction(payload.balance)))
        .catch(() => dispatch(showAlertAction({ title: internalError, type: 'error' })));
};

export const acceptTerms = () => (dispatch) => {
    handleFetch('/dashboard/accept', 'GET')
        .then((res) => {
            if (res.success) {
                document.location = '/';
            } else {
                throw new Error(res.errorCode);
            }
        })
        .catch(() => dispatch(showAlertAction({ title: internalError, type: 'error' })));
};

export const logout = () => (dispatch) => {
    handleFetch('/signin/logout', 'GET')
        .then((res) => {
            if (res.success) {
                document.location = '/';
            } else {
                throw new Error(res.errorCode);
            }
        })
        .catch(() => dispatch(showAlertAction({ title: internalError, type: 'error' })));
};
