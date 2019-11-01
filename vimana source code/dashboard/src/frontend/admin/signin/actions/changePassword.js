import {CHANGE_PASSWORD} from "../constants/ActionType";

export const changePassword = password => ({
    type: CHANGE_PASSWORD,
    payload: password,
});