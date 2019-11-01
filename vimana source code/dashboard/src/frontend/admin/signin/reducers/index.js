import {changePasswordReducer} from "./changePassword";
import {changeUsernameReducer} from "./changeUsername";
import {loginSendReducer} from "./login";
import {loginSuccessReducer} from "./login";
import {loginFailedReducer} from "./login";
import {CHANGE_PASSWORD, CHANGE_USERNAME, LOGIN_FAILED, LOGIN_SEND, LOGIN_SUCCESS} from "../constants/ActionType";

export default function (state, action) {
    switch (action.type) {
        case CHANGE_USERNAME:
            return changeUsernameReducer(state, action);
        case CHANGE_PASSWORD:
            return changePasswordReducer(state, action);
        case LOGIN_SEND:
            return loginSendReducer(state);
        case LOGIN_SUCCESS:
            return loginSuccessReducer(state);
        case LOGIN_FAILED:
            return loginFailedReducer(state, action);
        default:
            return state;
    }
}