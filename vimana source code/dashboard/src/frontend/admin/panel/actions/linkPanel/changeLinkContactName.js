import {CHANGE_LINK_CONTACT_NAME} from "../../constants/ActionType";

export const changeLinkContactName = contactName => ({
    type: CHANGE_LINK_CONTACT_NAME,
    contactName,
});
