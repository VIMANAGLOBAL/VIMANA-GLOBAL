export const changeLinkContactNameReducer = (state, action) => ({
    ...state,
    linkPanel: {
        ...state.linkPanel,
        contactName: action.contactName,
        successSend: false,
        failed: false,
    }
});
