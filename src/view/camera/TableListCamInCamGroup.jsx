import { DeleteOutlined, EyeOutlined, SearchOutlined } from '@ant-design/icons';
import { AutoComplete, Button, Popconfirm, Table, Tooltip } from 'antd';
import { isEmpty } from 'lodash-es';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import CameraApi from '../../actions/api/camera/CameraApi';
import Notification from '../../components/vms/notification/Notification';
import { renderText } from '../user/dataListUser/components/TableListUser';
import ModalViewDetail from './ModalViewDetail';
import './TableListCamInCamGroup.scss';

export default function TableListCamInCamGroup(props) {
  const { t } = useTranslation();

  const { camGroupUuid, handleAdddCamera } = props;

  const [camInGroup, setCamInGroup] = useState([]);
  const [nameGroup, setNameGroup] = useState('');
  const [search, setSearch] = useState('');
  const [reload, setReload] = useState(false);

  const [selectedCameraId, setSelectedCameraId] = useState(null);

  useEffect(() => {
    if (isEmpty(camGroupUuid)) {
      setCamInGroup([]);
      return;
    }
    CameraApi.getGroupCameraById(camGroupUuid).then((result) => {
      setCamInGroup(result?.cameraList);
      setNameGroup(result?.name);
    });
  }, [camGroupUuid, reload]);

  const onAddCamera = async () => {
    await handleAdddCamera(true);
  };

  const handleShowModalInfo = () => {
    setSelectedCameraId(null);
  };

  const removeCameraInGroup = async (id) => {
    const data = camInGroup.filter((r) => r.uuid !== id);
    let camInGroupKey = data.map((c) => c.uuid);

    const payload = {
      cameraUuidList: camInGroupKey
    };

    const isUpdate = await CameraApi.updateCameraGroup(camGroupUuid, payload);

    if (isUpdate) {
      const notifyMess = {
        type: 'success',
        title: '',
        description: 'Xóa thành công các Cam trong nhóm'
      };
      Notification(notifyMess);
      setReload(!reload);
      handleAdddCamera(false);
    }
  };

  const columns = [
    {
      title: 'Camera',
      dataIndex: 'name',
      className: 'headerUserColumns',
      // width: '20%',
      render: renderText
    },
    {
      title: `${t('view.map.location')}`,
      dataIndex: 'address',
      className: 'headerUserColumns',
      // width: '32%',
      render: renderText
    },
    {
      title: `${t('view.map.administrative_unit')}`,
      dataIndex: 'administrativeUnitName',
      className: 'headerUserColumns',
      // width: '30%',
      render: renderText
    },

    {
      title: `${t('view.storage.action')}`,
      fixed: 'right',
      // width: '13%',
      className: 'headerUserColumns',
      render: (text, record) => {
        return (
          <div className="d-flex">
            <Tooltip
              placement="top"
              title={t('view.camera.camera_detail', { cam: t('camera') })}
            >
              <EyeOutlined
                style={{
                  fontSize: '16px',
                  color: '#6E6B7B',
                  paddingRight: 10
                }}
                onClick={() => {
                  setSelectedCameraId(record?.uuid);
                }}
              />
            </Tooltip>

            <Tooltip placement="top" title={t('delete')}>
              <Popconfirm
                title={t('noti.delete_camera', { this: t('this'), cam: t("camera") })}
                onConfirm={() => removeCameraInGroup(record?.uuid)}
              >
                <DeleteOutlined
                  style={{ fontSize: '16px', color: '#6E6B7B' }}
                />
              </Popconfirm>
            </Tooltip>
          </div>
        );
      }
    }
  ];

  const handleSearch = async (value) => {
    setSearch(value);
    let data = {
      name: value,
      provinceId: '',
      districtId: '',
      id: '',
      administrativeUnitUuid: '',
      vendorUuid: '',
      status: '',
      cameraGroupUuid: camGroupUuid,
      page: 1,
      size: 100000
    };
    const dataCameraSearch = await CameraApi.getAllCamera(data);
    setCamInGroup(dataCameraSearch);
  };

  const handleBlur = (event) => {
    const value = event.target.value.trim();

    setSearch(value);
  };

  const renderHeader = () => {
    return (
      <div>
        <h4 className="font-weight-700">{nameGroup} </h4>
        <hr />
        <div className=" d-flex justify-content-between align-items-center toolbar">
          <Tooltip
            placement="rightTop"
            title={t('view.camera.add_new_cam_in_group')}
          >
            <Button type="primary" onClick={onAddCamera}>
              {t('view.camera.add_new')}
            </Button>
          </Tooltip>

          <AutoComplete
            className=" full-width height-40 read search__camera-group ml-2"
            onSearch={handleSearch}
            value={search}
            onBlur={handleBlur}
            maxLength={255}
            placeholder={
              <div className="placehoder height-40 justify-content-between d-flex align-items-center">
                <span style={{ opacity: '0.5' }}>
                  {' '}
                  &nbsp; {t('view.map.search')}{' '}
                </span>{' '}
                <SearchOutlined style={{ fontSize: 22 }} />
              </div>
            }
          />
        </div>
      </div>
    );
  };
  return (
    <div>
      {isEmpty(camGroupUuid) ? null : (
        <div>
          <Table
            className="table__list--cam-in-cam-group"
            rowKey="uuid"
            columns={columns}
            dataSource={camInGroup}
            title={renderHeader}
            // scroll={{ y: 300 }}
            pagination={{
              pageSize: 8
            }}
            locale={{
              emptyText: `${t('view.user.detail_list.no_valid_results_found')}`
            }}
          />
        </div>
      )}
      {selectedCameraId && (
        <ModalViewDetail
          selectedCameraId={selectedCameraId}
          handleShowModal={handleShowModalInfo}
        />
      )}
    </div>
  );
}
