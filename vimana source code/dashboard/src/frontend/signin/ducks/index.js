import { handleFetch } from '../../common/helpers/fetch';
import { SubmissionError } from 'redux-form';
import { internalError, tooEarly } from '../../common/helpers/alert';
import { getCookie } from '../../common/helpers/cookie';

const START_FETCHING = 'START_FETCHING';
const STOP_FETCHING = 'STOP_FETCHING';
const SET_2FA = 'SET_2FA';
const SHOW_ALERT = 'SHOW_ALERT';
const HIDE_ALERT = 'HIDE_ALERT';
const COOKIE_AGREE = 'COOKIE_AGREE';

const initialState = {
    isFetching: false,
    showPreloader: false,
    enabled2FA: false,
    cookieAgree: !!getCookie('cookieAgree'),
    alert: {
        show: false,
        title: ''
    }
};

export default (state = initialState, { type, payload }) => {
    switch (type) {
        case START_FETCHING:
            return {
                ...state,
                isFetching: true,
                showPreloader: payload
            };
        case STOP_FETCHING:
            return {
                ...state,
                isFetching: false,
                showPreloader: false
            };
        case SET_2FA:
            return {
                ...state,
                enabled2FA: true
            };
        case COOKIE_AGREE:
            return {
                ...state,
                cookieAgree: true
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

// actions

const startFetching = (payload) => ({ type: START_FETCHING, payload });
const stopFetching = () => ({ type: STOP_FETCHING });
const set2FA = () => ({ type: SET_2FA });
export const cookieAgreeAction = () => ({ type: COOKIE_AGREE });

// actions creators
export const showAlertAction = (payload) => (dispatch) => {
    dispatch({ type: SHOW_ALERT, payload });
    setTimeout(() => dispatch({ type: HIDE_ALERT }), 2500);
};

export const loginSubmit = (value) => (dispatch) => {
    dispatch(startFetching(false));
    return handleFetch('/signin/login', 'POST', value)
        .then((res) => {
            dispatch(stopFetching());
            if (!res.success) {
                throw new Error(res.errorCode);
            } else {
                document.location.href = '/';
            }
        })
        .catch((e) => {
            switch (e.message) {
                case 'REQUIRED_2FA':
                    dispatch(set2FA());
                    throw new SubmissionError({
                        token: e.message
                    });
                case 'WRONG_TOKEN':
                    throw new SubmissionError({
                        token: e.message
                    });
                case 'WRONG_EMAIL_OR_PASS':
                    throw new SubmissionError({
                        email: e.message,
                        password: e.message
                    });
                default:
                    dispatch(showAlertAction({ title: internalError, type: 'error' }));
            }
        });
};

export const registerSubmit = (value) => (dispatch) => {
    dispatch(startFetching(true));
    return handleFetch('/signup/register', 'POST', value)
        .then((res) => {
            dispatch(stopFetching());
            if (!res.success) {
                throw new Error(res.errorCode);
            } else {
                document.cookie = `succeed=true;path=/`;
                document.location = `/success/register`;
            }
        })
        .catch((e) => {
            switch (e.message) {
                case 'FIRST_NAME_NOT_VALID':
                    throw new SubmissionError({
                        firstName: e.message
                    });
                case 'LAST_NAME_NOT_VALID':
                    throw new SubmissionError({
                        lastName: e.message
                    });
                case 'EMAIL_NOT_VALID':
                    throw new SubmissionError({
                        email: e.message
                    });
                case 'PASSWORD_NOT_VALID':
                    throw new SubmissionError({
                        password: e.message
                    });
                case 'CONFIRM_NOT_VALID':
                    throw new SubmissionError({
                        confirm: e.message
                    });
                case 'COUNTRY_NOT_VALID':
                    throw new SubmissionError({
                        country: e.message
                    });
                case 'ADDRESS_NOT_VALID':
                    throw new SubmissionError({
                        address: e.message
                    });
                case 'CITY_NOT_VALID':
                    throw new SubmissionError({
                        city: e.message
                    });
                case 'STATE_NOT_VALID':
                    throw new SubmissionError({
                        state: e.message
                    });
                case 'ZIP_CODE_NOT_VALID':
                    throw new SubmissionError({
                        zipCode: e.message
                    });
                case 'PHONE_NOT_VALID':
                    throw new SubmissionError({
                        phone: e.message
                    });
                case 'PASSWORD_MISMATCH':
                    throw new SubmissionError({
                        password: e.message,
                        confirm: e.message
                    });
                case 'EMAIL_NOT_UNIQUE':
                    throw new SubmissionError({
                        email: e.message
                    });
                default:
                    dispatch(showAlertAction({ title: internalError, type: 'error' }));
            }
        });
};

export const recoverSubmit = (value) => (dispatch) => {
    dispatch(startFetching(true));
    return handleFetch('/signin/recover', 'POST', value)
        .then((res) => {
            dispatch(stopFetching());
            if (!res.success) {
                throw new Error(res.errorCode);
            } else {
                document.cookie = `succeed=true;path=/`;
                document.location = `/success/recover`;
            }
        })
        .catch((e) => {
            switch (e.message) {
                case 'NOT_FOUND':
                    throw new SubmissionError({
                        email: e.message
                    });
                case 'TOO_EARLY':
                    dispatch(showAlertAction({ title: tooEarly, type: 'error' }));
                    break;
                default:
                    dispatch(showAlertAction({ title: internalError, type: 'error' }));
            }
        });
};

export const resentVerify = (value) => (dispatch) => {
    dispatch(startFetching(true));
    return handleFetch('/signup/resend', 'POST', value)
        .then((res) => {
            dispatch(stopFetching());

            if (!res.success) {
                throw new Error(res.errorCode);
            } else {
                document.cookie = `succeed=true;path=/`;
                document.location = `/success/resend`;
            }
        })
        .catch((e) => {
            switch (e.message) {
                case 'USER_ALREADY_VERIFIED':
                    dispatch(showAlertAction({ title: internalError, type: 'error' }));
                    break;
                case 'TOO_EARLY':
                    dispatch(showAlertAction({ title: tooEarly, type: 'error' }));
                    break;
                case 'NOT_FOUND':
                case 'EMAIL_NOT_VALID':
                    throw new SubmissionError({
                        email: e.message
                    });
                default:
                    dispatch(showAlertAction({ title: internalError, type: 'error' }));
            }
        });
};
