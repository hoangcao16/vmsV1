import { Spin } from 'antd';
import { isEmpty } from 'lodash-es';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import GroupApi from '../../../../actions/api/group/GroupApi';
import UserApi from '../../../../actions/api/user/UserApi';
import permissionCheck from '../../../../actions/function/MyUltil/PermissionCheck';
import './GroupDetail.scss';
import GroupDetailHearder from './GroupDetailHeader';
import MemberInGroup from './MemberInGroup';
import PermisionOther from './PermisionOther';
import TableCameraGroupPermission from './TableCameraGroupPermission';
import TableCameraPermission from './TableCameraPermission';

export default function GroupDetail() {
  const { groupUuid } = useParams();

  const [group, setGroup] = useState(null);
  const [member, setMember] = useState([]);
  const [pemissionOthers, setPemissionOthers] = useState([]);
  const [cameraPermission, setCameraPermission] = useState([]);
  const [cameraGroupPermision, setcameraGroupPermision] = useState([]);
  const [reloadCameraPage, setReloadCameraPage] = useState(false);

  useEffect(() => {
    GroupApi.getGroupByUuid(groupUuid).then(async (result) => {
      setGroup(result);
      const data = await UserApi.getUserByGroupUuid(result?.code);
      setMember(data?.users);
      setPemissionOthers(data?.p_others);
      setCameraPermission(data?.p_cameras);
      setcameraGroupPermision(data?.p_camera_groups);
    });
  }, []);

  useEffect(() => {
    GroupApi.getGroupByUuid(groupUuid).then(async (result) => {
      // setGroup(result);
      const data = await UserApi.getUserByGroupUuid(result?.code);
      // setMember(data?.users);
      // setPemissionOthers(data?.p_others);
      setCameraPermission(data?.p_cameras);
      // setcameraGroupPermision(data?.p_camera_groups);
    });
  }, [reloadCameraPage]);

  const handleRefreshCameraPage = () => {
    setReloadCameraPage(!reloadCameraPage);
  };

  if (isEmpty(group)) {
    return <Spin />;
  }

  return (
    <div
      className={`${permissionCheck('edit_user_group') ? '' : 'disableCard'}`}
    >
      <GroupDetailHearder
        groupUuid={groupUuid}
        name={group?.name}
        description={group?.description}
      />
      <MemberInGroup
        groupUuid={groupUuid}
        member={member}
        groupCode={group?.code}
      />
      <PermisionOther
        pemissionOthers={pemissionOthers}
        groupUuid={groupUuid}
        groupCode={group?.code}
      />

      <div
        className={`${
          permissionCheck('assign_user_group_permission') ? '' : 'disableCard'
        }`}
      >
        <TableCameraGroupPermission
          cameraGroupPermision={cameraGroupPermision}
          groupCode={group?.code}
          groupUuid={groupUuid}
          handleRefreshCameraPage={handleRefreshCameraPage}
        />
        <TableCameraPermission
          cameraPermission={cameraPermission}
          groupCode={group?.code}
          reloadCameraPage={reloadCameraPage}
          groupUuid={groupUuid}
        />
      </div>
    </div>
  );
}
