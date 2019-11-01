import { logout } from './logout';
import { fetchFiles } from './logPanel/fetchFiles';
import { fetchContent } from './logPanel/fetchContent';
import { changeLogLevelFilter } from './logPanel/changeLogLevelFilter';
import { changeReqIdFilter } from './logPanel/changeReqIdFilter';
import { changeTextFilter } from './logPanel/changeTextFilter';
import { createLink } from './linkPanel/createLink';
import { changeLinkEmail } from './linkPanel/changeLinkEmail';
import { changeLinkContactMail } from './linkPanel/changeLinkContactMail';
import { changeLinkContactPhone } from './linkPanel/changeLinkContactPhone';
import { changeLinkTitle } from './linkPanel/changeLinkTitle';
import { changeLinkName } from './linkPanel/changeLinkName';
import { changeLinkContactName } from './linkPanel/changeLinkContactName';
import { send } from './linkPanel/send';

export {
    logout,
    fetchFiles,
    fetchContent,
    changeTextFilter,
    changeReqIdFilter,
    changeLogLevelFilter,
    send,
    createLink,
    changeLinkName,
    changeLinkEmail,
    changeLinkContactName,
    changeLinkContactMail,
    changeLinkContactPhone,
    changeLinkTitle
};
