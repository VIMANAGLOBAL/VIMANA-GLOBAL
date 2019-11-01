export const sendSendReducer = state => ({
    ...state,
    locked: true,
});

export const sendSuccessReducer = state => ({
    ...state,
    locked: false,

    linkPanel: {
        ...state.linkPanel,
        failed: false,
        errorCode: "",
        successSend: true,
    },
});

export const sendFailedReducer = (state, action) => ({
    ...state,
    locked: false,

    linkPanel: {
        ...state.linkPanel,
        failed: true,
        successSend: false,
        errorCode: action.errorCode,
    },
});
