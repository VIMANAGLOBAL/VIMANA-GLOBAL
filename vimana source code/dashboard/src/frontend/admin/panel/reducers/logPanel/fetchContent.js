export const fetchContentSendReducer = (state, action) => ({
    ...state,
    locked: true,

    logPanel: {
        ...state.logPanel,
        failed: false,
        errorCode: "",

        current: action.payload.current,
        part: action.payload.part,
    }
});

export const fetchContentSuccessReducer = (state, action) => ({
    ...state,
    locked: false,

    logPanel: {
        ...state.logPanel,

        content: action.payload,
    },
});

export const fetchContentFailedReducer = (state, action) => ({
    ...state,
    locked: false,

    logPanel: {
        ...state.logPanel,

        failed: true,
        errorCode: action.errorCode,
    },
});