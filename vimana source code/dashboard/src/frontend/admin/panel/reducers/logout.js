export const logoutSendReducer = state => ({
    ...state,
    locked: true,
});

export const logoutSuccessReducer = state => ({
    ...state,
    locked: false,
    failed: false,
    errorCode: "",
});

export const logoutFailedReducer = (state, action) => ({
    ...state,
    locked: false,
    failed: true,
    errorCode: action.errorCode,
});
