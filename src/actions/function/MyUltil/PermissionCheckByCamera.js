import { isEmpty } from "lodash-es";
import { reactLocalStorage } from "reactjs-localstorage";

export default function permissionCheckByCamera(permission_name, idCamera) {
  const permissionUser = reactLocalStorage.getObject("permissionUser");
  if (!isEmpty(permissionUser?.roles)) {
    const checkSuperAdmin = permissionUser?.roles.filter(
      (r) => r.role_code === "superadmin"
    );

    if (checkSuperAdmin.length > 0) return true;
  }

  if (isEmpty(permissionUser?.p_cameras)) return false;
  const checkPermission = permissionUser?.p_cameras.filter(
    (r) => r.cam_uuid === idCamera
  );

  let checkPermissionFinal = false;
  if (checkPermission) {
    checkPermissionFinal =
    checkPermission[0]?.permissions.includes(permission_name);
  }
  return checkPermissionFinal;
}
