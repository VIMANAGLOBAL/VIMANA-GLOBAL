export const loginSendReducer = state => ({
    ...state,
    locked: true,
    failed: false,
    errorCode: "",
});

export const loginSuccessReducer = state => ({
    ...state,
    locked: false,
});

export const loginFailedReducer = (state, action) => ({
    ...state,
    locked: false,
    failed: true,
    errorCode: action.errorCode,
});