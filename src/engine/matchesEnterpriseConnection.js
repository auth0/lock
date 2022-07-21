import {isEnterpriseDomain} from "../connection/enterprise";
import {databaseUsernameValue} from "../connection/database";

export function matchesEnterpriseConnection(m, usernameValue) {
    return isEnterpriseDomain(m, usernameValue);
}


export function isSSOEnabled(m, options) {
    return matchesEnterpriseConnection(m, databaseUsernameValue(m, options));
}
