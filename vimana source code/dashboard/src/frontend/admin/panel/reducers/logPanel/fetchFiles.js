export const fetchFilesSendReducer = state => ({
    ...state,
    locked: true,

    logPanel: {
        ...state.logPanel,
    },
});

export const fetchFilesSuccessReducer = (state, action) => ({
    ...state,
    locked: false,

    logPanel: {
        ...state.logPanel,

        files: action.payload,
    },
});

export const fetchFilesFailedReducer = (state, action) => ({
    ...state,
    locked: false,

    logPanel: {
        ...state.logPanel,
        failed: true,
        errorCode: action.errorCode,
    },
});
