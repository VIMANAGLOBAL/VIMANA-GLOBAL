export const changeLinkNameReducer = (state, action) => ({
    ...state,
    linkPanel: {
        ...state.linkPanel,
        name: action.name,
        successSend: false,
        failed: false,
    }
});
