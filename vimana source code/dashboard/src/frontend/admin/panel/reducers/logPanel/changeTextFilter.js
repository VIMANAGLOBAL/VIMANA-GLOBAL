export const changeTextFilterReducer = (state, action) => ({
    ...state,
    logPanel: {
        ...state.logPanel,
        filter: {
            ...state.logPanel.filter,
            text: action.payload,
        },
    },
});
