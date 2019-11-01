export const changeLinkTitleReducer = (state, action) => ({
    ...state,
    linkPanel: {
        ...state.linkPanel,
        title: action.title,
        successSend: false,
        failed: false
    }
});
