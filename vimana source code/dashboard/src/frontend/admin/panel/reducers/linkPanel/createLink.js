export const createLinkSendReducer = state => ({
    ...state,
    locked: true,
});

export const createLinkSuccessReducer = (state, action) => ({
    ...state,
    locked: false,

    linkPanel: {
        ...state.linkPanel,
        link: action.payload,
        failed: false,
        errorCode: "",
    },
});

export const createLinkFailedReducer = (state, action) => ({
    ...state,
    locked: false,

    linkPanel: {
        ...state.linkPanel,
        failed: true,
        errorCode: action.errorCode,
    },
});
