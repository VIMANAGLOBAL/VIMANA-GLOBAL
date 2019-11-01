export const changeUsernameReducer = (state, action) => {
    const username = /^[\w\d_\-.]*$/.test(action.payload) ? action.payload : state.username;
    const submitDisabled = !(state.password && state.password.length && username && username.length);

    return {
        ...state,
        username,
        submitDisabled,
    }
};