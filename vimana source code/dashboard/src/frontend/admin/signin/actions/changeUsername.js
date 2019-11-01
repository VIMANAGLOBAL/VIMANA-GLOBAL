import {CHANGE_USERNAME} from "../constants/ActionType";

export const changeUsername = username => ({
    type: CHANGE_USERNAME,
    payload: username,
});