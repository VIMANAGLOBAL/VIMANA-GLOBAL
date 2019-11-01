import {handleFetch, handleUpload} from '../../common/helpers/fetch';
import { showAlertAction } from './main';
import { SubmissionError, clearFields, reset } from 'redux-form';
import { success, internalError, emptySubmit, successVerification } from '../../common/helpers/alert';
import {initWs} from "../util/wsUtil";

const GET_STATS = 'GET_STATS';
const GET_BALANCE = 'GET_BALANCE';
const GET_INVESTMENT = 'GET_INVESTMENT';
const VERIFY_SUCCESS = "VERIFY_SUCCESS";
const VERIFY_SEND = "VERIFY_SEND";
const VERIFY_FAILED = "VERIFY_FAILED";
const KYC_PASSED = "KYC_PASSED";
const KYC_FAILED = "KYC_FAILED";

const initialState = {
    isLocked: false,

    firstName: '',
    lastName: '',
    address: '',
    city: '',
    description: [],
    phone: '',
    state: '',
    vip: false,
    zipCode: '',
    email: '',
    country: '',
    enable2fa: null,
    balance: 0,
    investment: {
        currency: 'ETH'
    },
    kyc: {
        loaded: false,
        inProgress: false,
        passed: false,
        failed: false,
    }
};

export default (state = initialState, { type, payload }) => {
    switch (type) {
        case VERIFY_SUCCESS:
            return {
                ...state,
                isLocked: false,
                kyc: {
                    ...state.kyc,
                    inProgress: true,
                }
            };
        case VERIFY_SEND:
            return {
                ...state,
                isLocked: true,
            };
        case VERIFY_FAILED:
            return {
                ...state,
                isLocked: false,
            };
        case KYC_PASSED:
            return {
                ...state,
                kyc: {
                    loaded: true,
                    inProgress: false,
                    passed: true,
                    failed: false,
                }
            };
        case KYC_FAILED:
            return {
                ...state,
                kyc: {
                    loaded: true,
                    inProgress: false,
                    passed: false,
                    failed: true,
                }
            };
        case GET_STATS:
            return {
                ...state,
                firstName: payload.firstName,
                lastName: payload.lastName,
                email: payload.email,
                country: payload.country,
                enable2fa: payload.enabled2fa,
                address: payload.address,
                city: payload.city,
                description: [payload.description],
                phone: payload.phone,
                state: payload.state,
                vip: payload.vip,
                zipCode: payload.zipCode,
                kyc: {
                    loaded: true,
                    ...payload.kyc,
                },
            };
        case GET_BALANCE:
            return {
                ...state,
                balance: payload
            };
        case GET_INVESTMENT:
            return {
                ...state,
                investment: payload
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

const getUserInvestmentAction = (payload) => ({
    type: GET_INVESTMENT,
    payload
});

export const getUserInfo = () => (dispatch) => {
    handleFetch('/dashboard/user-info', 'GET')
        .then(({ payload }) => {
            dispatch(getUserInfoAction(payload));
            initWs(dispatch, payload.id);
        })
        .catch(() => dispatch(showAlertAction({ title: internalError, type: 'error' })));
};

export const getBalanceInfo = () => (dispatch) => {
    handleFetch('/dashboard/balance', 'GET')
        .then(({ payload }) => {
            dispatch(getUserBalanceAction(payload.balance));
        })
        .catch(() => dispatch(showAlertAction({ title: internalError, type: 'error' })));
};

export const getInvestmentInfo = () => (dispatch) => {
    handleFetch('/dashboard/investment', 'GET')
        .then(({ payload }) => {
            dispatch(getUserInvestmentAction(payload.investment));
        })
        .catch(() => dispatch(showAlertAction({ title: internalError, type: 'error' })));
};

export const saveSettings = (value, touched) => (dispatch) => {
    if (touched) {
        if (!value.description[0]) {
            value.description = [];
        }
        return handleFetch('/settings/save', 'POST', value)
            .then((res) => {
                if (!res.success) {
                    throw new Error(res.errorCode);
                } else {
                    dispatch(showAlertAction({ title: success, type: 'success' }));
                    dispatch(getUserInfo());
                    dispatch(
                        clearFields(
                            'changePassword',
                            false,
                            false,
                            'currentPass',
                            'newPass',
                            'confirm',
                            'token'
                        )
                    );
                }
            })
            .catch((e) => {
                switch (e.message) {
                    case 'WRONG_TOKEN':
                        throw new SubmissionError({
                            token: e.message
                        });
                    case 'FIRST_NAME_NOT_VALID':
                        throw new SubmissionError({
                            firstName: e.message
                        });
                    case 'LAST_NAME_NOT_VALID':
                        throw new SubmissionError({
                            lastName: e.message
                        });
                    case 'WRONG_PASSWORD':
                        throw new SubmissionError({
                            currentPass: e.message
                        });
                    case 'NEW_PASSWORD_NOT_VALID':
                        throw new SubmissionError({
                            newPass: e.message
                        });
                    case 'CONFIRM_NOT_VALID':
                        throw new SubmissionError({
                            confirm: e.message
                        });
                    case 'PASSWORD_MISMATCH':
                        throw new SubmissionError({
                            newPass: e.message,
                            confirm: e.message
                        });
                    case 'PASSWORD_NOT_VALID':
                        throw new SubmissionError({
                            currentPass: e.message
                        });
                    default:
                        dispatch(showAlertAction({ title: internalError, type: 'error' }));
                }
            });
    }
    dispatch(showAlertAction({ title: emptySubmit, type: 'warning' }));
};

export const verifyUser = (value, touched) => async (dispatch) => {
    if (touched) {
        const form = new FormData();

        for (const k in value) {
            if (k === "files") {
                for (const file of value[k]) {
                    form.append(file.name, file);
                }
            } else if (value[k]) form.append(k, value[k]);
        }

        dispatch({
            type: VERIFY_SEND,
        });

        return handleUpload('/onfido/verify', form)
            .then((res) => {
                if (!res.success) {
                    throw new Error(res.errorCode);
                } else {
                    dispatch(showAlertAction({ title: successVerification, type: 'success' }));
                    dispatch({type: VERIFY_SUCCESS});
                    dispatch(reset('verifyUser'));
                }
            })
            .catch((e) => {
                dispatch({
                    type: VERIFY_FAILED,
                });

                switch (e.message) {
                    case 'UNSUPPORTED_COUNTRY':
                        dispatch(showAlertAction({title: "Selected country is not supported!", type: 'error'}));
                        break;

                    case 'WRONG_TOKEN':
                        throw new SubmissionError({
                            token: e.message
                        });
                    case 'FIRST_NAME_NOT_VALID':
                        throw new SubmissionError({
                            firstName: e.message
                        });
                    case 'LAST_NAME_NOT_VALID':
                        throw new SubmissionError({
                            lastName: e.message
                        });
                    case 'COUNTRY_NOT_VALID':
                        throw new SubmissionError({
                            country: e.message
                        });
                    case 'IDENTIFICATION_TYPE_NOT_VALID':
                        throw new SubmissionError({
                            identificationType: e.message
                        });
                    default:
                        dispatch(showAlertAction({title: e.message, type: 'error'}));
                }
            });
    }
    dispatch(showAlertAction({ title: emptySubmit, type: 'warning' }));
};
