import { isEmpty } from 'lodash-es';
import { reactLocalStorage } from 'reactjs-localstorage';

export default function permissionCheck(permission_name) {
  const permissionUser = reactLocalStorage.getObject('permissionUser');
  if (!isEmpty(permissionUser?.roles)) {
    const checkSuperAdmin = permissionUser?.roles.filter(
      (r) => r.role_code === 'superadmin'
    );

    if (checkSuperAdmin.length > 0) return true;
  }

  if (isEmpty(permissionUser?.p_others)) return false;

  return permissionUser?.p_others.includes(permission_name);
}
