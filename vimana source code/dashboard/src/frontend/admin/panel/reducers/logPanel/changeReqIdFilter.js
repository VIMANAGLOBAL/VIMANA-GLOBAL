export const changeReqIdFilterReducer = (state, action) => ({
    ...state,
    logPanel: {
        ...state.logPanel,
        filter: {
            ...state.logPanel.filter,
            reqId: action.payload,
        },
    },
});
