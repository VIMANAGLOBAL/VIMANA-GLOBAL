export const changeLinkEmailReducer = (state, action) => ({
    ...state,
    linkPanel: {
        ...state.linkPanel,
        email: action.email,
        successSend: false,
        failed: false,
    }
});
