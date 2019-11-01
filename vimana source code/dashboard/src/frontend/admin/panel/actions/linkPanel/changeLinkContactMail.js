import {CHANGE_LINK_CONTACT_MAIL} from "../../constants/ActionType";

export const changeLinkContactMail = contactMail => ({
    type: CHANGE_LINK_CONTACT_MAIL,
    contactMail,
});
