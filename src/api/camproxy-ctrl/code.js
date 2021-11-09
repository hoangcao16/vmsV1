import Notification from "../../components/vms/notification/Notification";
import {handleForbiddenCode} from "../authz/forbidden";

const KPandaSuccess = 12000;
const KPandaMissingFieldDomainOrUser = 12101
const KPandaBadRequest = 12102
export const KPandaInternalServer = 12103
const KPandaCamproxyNotFound = 12104
const KPandaCamNotFound = 12105
const StatusForbidden = 605;

export const handleErrCode = ({code, message, payload, deny_permission_codes}) => {
    const errCode = {
        type: "error",
        title: "Code:" + code,
        description: '',
    };
    switch (code) {
        case KPandaSuccess:
            return payload
        case KPandaMissingFieldDomainOrUser:
            errCode.description = 'Missing domain or user'
            Notification(errCode)
            return null
        case KPandaBadRequest:
            errCode.description = 'Bad request'
            Notification(errCode)
            return null
        case KPandaInternalServer:
            errCode.description = 'Internal server'
            Notification(errCode)
            return null
        case KPandaCamproxyNotFound:
            errCode.description = 'Not found any camproxy'
            Notification(errCode)
            return null
        case KPandaCamNotFound:
            errCode.description = 'Not found camera'
            Notification(errCode)
            return null
        case StatusForbidden:
            handleForbiddenCode(deny_permission_codes);
            return null;
        default:
            errCode.description = 'Unknown'
            Notification(errCode)
            return null
    }
}