import {
  DeleteOutlined,
  EditOutlined,
  InfoCircleOutlined,
  PlusOutlined,
  SearchOutlined
} from '@ant-design/icons';
import {
  AutoComplete,
  Button,
  Card,
  Popconfirm,
  Space,
  Table,
  Tooltip
} from 'antd';
import 'antd/dist/antd.css';
import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import ZoneApi from '../../../actions/api/zone/ZoneApi';
import Notification from '../../../components/vms/notification/Notification';
import './../../commonStyle/commonTable.scss';
import './../../commonStyle/commontextArea.scss';
import ModalAddZone from './ModalAddZone';
import ModalEditZone from './ModalEditZone';
import ModalViewDetail from './ModalViewDetail';
import { bodyStyleCard, headStyleCard } from './variables';
import { useTranslation } from 'react-i18next';
import './zoneStyle.scss';
import { ShowTotal } from '../../../styled/showTotal';

export const DATA_FAKE_ZONE_SEARCH = {
  provinces: [{ name: '', provinceId: '' }]
};

const TableZone = () => {
  const { t } = useTranslation();
  const [listZone, setListZone] = useState([]);
  const [selectedZoneId, setSelectedZoneId] = useState(null);
  const [selectedZoneEditId, setSelectedZoneEditId] = useState(null);
  const [selectedAdd, setSelectedAdd] = useState(false);

  const [name, setName] = useState('');

  const [val, setVal] = useState('');
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const data = {
      provinceId: '',
      districtId: '',
      id: '',
      name: ''
    };
    ZoneApi.getAllZonesWithTotal(data).then((result) => {
      setListZone(result.payload);

      setTotal(result?.metadata?.total);
    });
  }, [selectedZoneEditId]);
  useEffect(() => {
    const data = {
      provinceId: '',
      districtId: '',
      id: '',
      name: '',

      page: page,
      size: size
    };
    ZoneApi.getAllZonesWithTotal(data).then((result) => {
      setListZone(result.payload);

      setTotal(result?.metadata?.total);
    });
  }, [page, size]);

  useEffect(() => {
    const data = {
      provinceId: '',
      districtId: '',
      id: '',
      name: '',
      page: page,
      size: size
    };
    ZoneApi.getAllZonesWithTotal(data).then((result) => {
      setListZone(result.payload);

      setTotal(result?.metadata?.total);
    });
  }, [selectedAdd]);

  const handleDelete = async (zoneId) => {
    const isDeleted = await ZoneApi.delete(zoneId);

    if (isDeleted) {
      const data = {
        provinceId: '',
        districtId: '',
        id: '',
        name: '',
        page: page,
        size: size
      };
      ZoneApi.getAllZonesWithTotal(data).then((result) => {
        setListZone(result.payload);

        setTotal(result?.metadata?.total);
      });

      const notifyMess = {
        type: 'success',
        title: '',
        description: `${t('noti.successfully_delete_zone')}`
      };
      Notification(notifyMess);
    }
  };

  const handleSearch = async (value) => {
    setVal(value);

    const data = {
      name: value.trim(),
      districtId: '',
      id: '',
      provinceId: '',
      page: page,
      size: size
    };
    const dataZoneSearch = await ZoneApi.getAllZonesWithTotal(data);
    if (dataZoneSearch.code === 700) {
      setListZone(dataZoneSearch.payload);
      setPage(dataZoneSearch.metadata.page);
      setSize(dataZoneSearch.metadata.size);
    }
  };

  const handleBlur = async (event) => {
    const value = event.target.value.trim();
    setVal(value);
  };

  const handleShowModalInfo = () => {
    setSelectedZoneId(null);
  };

  const handleShowModalEdit = () => {
    setSelectedZoneEditId(null);
  };

  const showModalAdd = () => {
    setSelectedAdd(true);
  };

  const handleShowModalAdd = () => {
    setSelectedAdd(false);
  };

  const zoneColumns = [
    {
      title: `${t('view.category.no')}`,
      fixed: 'left',
      key: 'index',
      className: 'headerColums',
      width: '5%',
      render: (text, record, index) => index + 1
    },
    {
      title: `${t('view.common_device.zone_name')}`,
      dataIndex: 'name',
      key: 'name',
      width: '30%',
      className: 'headerColums',
      fixed: 'left'
    },
    {
      title: `${t('view.map.location')}`,
      dataIndex: 'address',
      key: 'address',
      width: '30%',
      className: 'headerColums'
    },

    {
      title: `${t('view.common_device.desc')}`,
      dataIndex: 'description',
      key: 'description',
      className: 'headerColums',
      width: '20%'
    },

    {
      title: `${t('view.common_device.action')}`,
      fixed: 'right',
      className: 'headerColums',
      width: '15%',
      render: (text, record) => {
        return (
          <Space>
            <Tooltip
              placement="rightTop"
              title={t('view.common_device.detail')}
            >
              <InfoCircleOutlined
                style={{ fontSize: '16px', color: '#6E6B7B' }}
                onClick={() => {
                  setSelectedZoneId(record.uuid);
                }}
              />
            </Tooltip>
            <Tooltip placement="rightTop" title={t('view.common_device.edit')}>
              <EditOutlined
                style={{ fontSize: '16px', color: '#6E6B7B' }}
                onClick={() => {
                  setSelectedZoneEditId(record.uuid);
                }}
              />
            </Tooltip>
            <Tooltip placement="rightTop" title={t('delete')}>
              <Popconfirm
                title={t('noti.delete_zone')}
                onConfirm={() => handleDelete(record.uuid)}
              >
                <DeleteOutlined
                  style={{ fontSize: '16px', color: '#6E6B7B' }}
                />
              </Popconfirm>
            </Tooltip>
          </Space>
        );
      }
    }
  ];

  const onShowSizeChange = (current, pageSize) => {
    setPage(current);
    setSize(pageSize);
  };

  return (
    <div className="tabs__container--device mt-2">
      <div className="search mt-2">
        <AutoComplete
          maxLength={255}
          value={val}
          className=" full-width height-40"
          onSearch={handleSearch}
          onBlur={handleBlur}
          placeholder={
            <div className="placehoder height-40 justify-content-between d-flex align-items-center">
              <span>
                {' '}
                &nbsp;{' '}
                {t('view.common_device.please_enter_zone_name', {
                  plsEnter: t('please_enter')
                })}{' '}
              </span>{' '}
              <SearchOutlined style={{ fontSize: 22, pointer: 'cussor' }} />
            </div>
          }
        />
      </div>
      <Card
        title={t('view.common_device.zone_list')}
        extra={
          <Tooltip
            placement="rightTop"
            title={t('view.common_device.add_zone', { add: t('add') })}
          >
            <Button onClick={showModalAdd}>
              <PlusOutlined />
            </Button>
          </Tooltip>
        }
        bodyStyle={bodyStyleCard}
        headStyle={headStyleCard}
        className="card--listDevice"
      >
        <Table
          pagination={false}
          rowKey="id"
          size="medium"
          columns={zoneColumns}
          dataSource={listZone}
          locale={{
            emptyText: `${t('view.user.detail_list.no_valid_results_found')}`
          }}
        />
      </Card>
      {
        selectedZoneId && (
          <ModalViewDetail
            selectedZoneId={selectedZoneId}
            handleShowModal={handleShowModalInfo}
          />
        )
      }
      {
        selectedZoneEditId && (
          <ModalEditZone
            selectedZoneEditId={selectedZoneEditId}
            handleShowModalEdit={handleShowModalEdit}
          />
        )
      }

      {
        selectedAdd && (
          <ModalAddZone
            selectedAdd={selectedAdd}
            handleShowModalAdd={handleShowModalAdd}
          />
        )
      }
    </div >
  );
};

export default withRouter(TableZone);
