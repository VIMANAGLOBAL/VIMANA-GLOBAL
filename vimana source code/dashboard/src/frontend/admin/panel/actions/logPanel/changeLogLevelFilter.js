import {CHANGE_LOG_LEVEL_FILTER} from "../../constants/ActionType";

export const changeLogLevelFilter = level => ({
    type: CHANGE_LOG_LEVEL_FILTER,
    payload: level,
});