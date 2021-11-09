import { Spin } from 'antd';
import { isEmpty } from 'lodash-es';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import UserApi from '../../../../actions/api/user/UserApi';
import permissionCheck from '../../../../actions/function/MyUltil/PermissionCheck';
import PermisionOther from './PermisionOther';
import './RolesDetail.scss';
import RolesDetailHearder from './RolesDetailHearder';
import TableCameraGroupPermission from './TableCameraGroupPermission';
import TableCameraPermission from './TableCameraPermission';

export default function GroupDetail() {
  const { rolesUuid } = useParams();

  const [roles, setRoles] = useState(null);
  const [othersPermission, setOthersPermission] = useState([]);
  const [cameraPermission, setCameraPermission] = useState([]);
  const [cameraGroupPermision, setcameraGroupPermision] = useState([]);
  const [reloadCameraPage, setReloadCameraPage] = useState(false);

  useEffect(() => {
    UserApi.getRoleByUuid(rolesUuid).then(async (result) => {
      setRoles(result);
      const data = await UserApi.getRoleByRoleCode({ code: result?.code });

      setOthersPermission(data?.p_others);
      setCameraPermission(data?.p_cameras);
      setcameraGroupPermision(data?.p_camera_groups);
    });
  }, []);

  useEffect(() => {
    UserApi.getRoleByUuid(rolesUuid).then(async (result) => {
      // setRoles(result);
      const data = await UserApi.getRoleByRoleCode({ code: result?.code });

      // setOthersPermission(data?.p_others);
      setCameraPermission(data?.p_cameras);
      // setcameraGroupPermision(data?.p_camera_groups);
    });
  }, [reloadCameraPage]);

  const handleRefreshCameraPage = () => {
    setReloadCameraPage(!reloadCameraPage);
  };

  if (isEmpty(roles)) {
    return <Spin />;
  }

  return (
    <div className={`${permissionCheck('edit_role') ? '' : 'disableCard'}`}>
      <RolesDetailHearder
        rolesUuid={roles?.uuid}
        name={roles?.name}
        description={roles?.description}
      />
      <PermisionOther
        pemissionOthers={othersPermission}
        rolesUuid={roles?.uuid}
        rolesCode={roles?.code}
      />

      <div
        className={`${
          permissionCheck('assign_role_permission') ? '' : 'disableCard'
        }`}
      >
        <TableCameraGroupPermission
          cameraGroupPermision={cameraGroupPermision}
          rolesCode={roles?.code}
          rolesUuid={roles?.uuid}
          handleRefreshCameraPage={handleRefreshCameraPage}
        />
        <TableCameraPermission
          cameraPermission={cameraPermission}
          rolesCode={roles?.code}
          rolesUuid={roles?.uuid}
          reloadCameraPage={reloadCameraPage}
        />
      </div>
    </div>
  );
}
