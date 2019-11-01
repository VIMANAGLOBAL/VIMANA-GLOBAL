export const changePasswordReducer = (state, action) => {
    const password = /^[\w\d_\-.]*$/.test(action.payload) ? action.payload : state.password;
    const submitDisabled = !(state.username && state.username.length && password && password.length);

    return {
        ...state,
        password,
        submitDisabled,
    }
};