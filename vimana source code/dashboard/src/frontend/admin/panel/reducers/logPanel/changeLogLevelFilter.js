export const changeLogLevelFilterReducer = (state, action) => ({
    ...state,
    logPanel: {
        ...state.logPanel,
        filter: {
            ...state.logPanel.filter,
            level: action.payload,
        }
    }
});