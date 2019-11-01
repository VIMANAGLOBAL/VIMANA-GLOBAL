export const changeLinkContactMailReducer = (state, action) => ({
    ...state,
    linkPanel: {
        ...state.linkPanel,
        contactMail: action.contactMail,
        successSend: false,
        failed: false,
    }
});
