import { handleFetch } from '../../common/helpers/fetch';
import { internalError, successInvestment } from '../../common/helpers/alert';
import {getInvestmentInfo} from "./info";

const START_FETCHING = 'START_FETCHING';
const STOP_FETCHING = 'STOP_FETCHING';
const GET_TRANSACTIONS = 'GET_TRANSACTIONS';
const SHOW_ALERT = 'SHOW_ALERT';
const HIDE_ALERT = 'HIDE_ALERT';
const SHOW_MODAL = 'SHOW_MODAL';
const HIDE_MODAL = 'HIDE_MODAL';
const CROWDSALE_DATE = 'CROWDSALE_DATE';
const SUCCESS_SUBMIT_FORM = 'SUCCESS_SUBMIT_FORM';
const CLEAR_SUBMIT_FORM = 'CLEAR_SUBMIT_FORM';

const initialState = {
    isFetching: false,
    transactions: [],
    transactionsCount: 5,
    alert: {
        show: false,
        title: '',
        type: ''
    },
    modal: {
        show: false
    },
    crowdsaleDate: new Date('2018-08-20T24:00:00Z'),
    submitedForm: false
};

export default (state = initialState, { type, payload }) => {
    switch (type) {
        case START_FETCHING:
            return {
                ...state,
                isFetching: true
            };
        case STOP_FETCHING:
            return {
                ...state,
                isFetching: false
            };
        case CLEAR_SUBMIT_FORM:
            return {
                ...state,
                submitedForm: false
            };
        case SUCCESS_SUBMIT_FORM:
            return {
                ...state,
                submitedForm: true
            };
        case GET_TRANSACTIONS:
            return {
                ...state,
                transactions: [...state.transactions, ...payload.history],
                transactionsCount: payload.count
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
        case SHOW_MODAL:
            return {
                ...state,
                modal: {
                    show: true
                }
            };
        case HIDE_MODAL:
            return {
                ...state,
                modal: {
                    show: false
                }
            };
        case CROWDSALE_DATE:
            return {
                ...state,
                crowdsaleDate: payload
            };
        default:
            return state;
    }
};

export const startFetching = () => ({ type: START_FETCHING });
export const stopFetching = () => ({ type: STOP_FETCHING });
export const clearSubmitForm = () => ({ type: CLEAR_SUBMIT_FORM });
export const successSubmitForm = () => ({ type: SUCCESS_SUBMIT_FORM });
export const transactionsAction = (payload) => ({ type: GET_TRANSACTIONS, payload });
export const crowdsaleDateAction = (payload) => ({ type: CROWDSALE_DATE, payload });
export const saveInvestmentAction = (payload) => ({ type: CROWDSALE_DATE, payload });
export const showModalAction = () => ({ type: SHOW_MODAL });
export const hideModalAction = () => ({ type: HIDE_MODAL });

export const showAlertAction = (payload) => (dispatch) => {
    dispatch({ type: SHOW_ALERT, payload });
    setTimeout(() => dispatch({ type: HIDE_ALERT }), 2500);
};

export const getTransactions = (page) => (dispatch) => {
    handleFetch(`/dashboard/history/${page}`, 'POST', { count: 5 })
        .then((res) => {
            if (res.success) {
                dispatch(transactionsAction(res.payload));
            } else {
                throw new Error(res.errorCode);
            }
        })
        .catch(() => dispatch(showAlertAction({ title: internalError, type: 'error' })));
};

export const buyTokens = (val) => (dispatch) => {
    dispatch(clearSubmitForm());
    handleFetch(`/dashboard/save-investment`, 'POST', val)
        .then((res) => {
            if (res.success) {
                dispatch(getInvestmentInfo());
                dispatch(successSubmitForm());
            } else {
                dispatch(clearSubmitForm());
                throw new Error(res.errorCode);
            }
        })
        .catch(() => dispatch(showAlertAction({ title: internalError, type: 'error' })));
};

export const getCrowdsaleDate = () => (dispatch) =>
    handleFetch(`/dashboard/timestamp`, 'GET')
        .then((res) => {
            if (res.success) {
                dispatch(crowdsaleDateAction(res.payload.date));
            } else {
                throw new Error(res.errorCode);
            }
        })
        .catch(() => dispatch(showAlertAction({ title: internalError, type: 'error' })));

export const logout = () => (dispatch) => {
    dispatch(startFetching());
    handleFetch('/signin/logout', 'GET')
        .then((res) => {
            dispatch(stopFetching());
            if (res.success) {
                document.location = `/login`;
            } else {
                throw new Error('something go wrong');
            }
        })
        .catch(() => dispatch(showAlertAction({ title: internalError, type: 'error' })));
};

export const deleteAccount = () => (dispatch) => {
    handleFetch('/settings/delete-account', 'DELETE')
        .then((res) => {
            dispatch(stopFetching());
            if (res.success) {
                document.location = `/login`;
            } else {
                throw new Error('something go wrong');
            }
        })
        .catch(() => dispatch(showAlertAction({ title: internalError, type: 'error' })));
};
