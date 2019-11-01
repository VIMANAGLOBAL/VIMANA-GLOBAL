export const changeLinkContactPhoneReducer = (state, action) => ({
    ...state,
    linkPanel: {
        ...state.linkPanel,
        contactPhone: action.contactPhone,
        successSend: false,
        failed: false,
    }
});
