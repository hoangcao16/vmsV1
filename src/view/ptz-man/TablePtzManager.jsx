import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Card, message, Space, Table } from 'antd';
import 'antd/dist/antd.css';
import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import rest_api from '../../actions/rest_api';
import { ShowTotal } from '../../styled/showTotal';
import Loading from '../Loading';
import './../commonStyle/commonTable.scss';
import Breadcrumbs from '../../components/@vuexy/breadCrumbs/BreadCrumb';
import Notification from "../../components/vms/notification/Notification";
import { useTranslation } from "react-i18next";
import { reactLocalStorage } from "reactjs-localstorage";

// import CreatePtzProfile from './CreatePtzProfile';

const TablePtzManager = () => {
  const { t } = useTranslation();
  const language = reactLocalStorage.get("language");
  const [page, setPage] = useState(1);
  const [size] = useState(50);
  const [total, setTotal] = useState(0);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  // form
  const [showCreate, setShowCreate] = useState(false);

  useEffect(() => {
    if (
      language == "vn"
        ? (document.title = "CCTV | Quản lý PTZ")
        : (document.title = "CCTV | PTZ Management")
    );
  }, [t]);

  useEffect(() => {
    let unmounted = false;
    let params = {
      zoneId: '',
      name: '',
      size: size,
      page: page
    };
    setLoading(true);
    rest_api
      .get('/ptz-ctrl/ptz-man/profiles', params, null)
      .then((data) => {
        if (!unmounted) {
          if (data && data.rows) {
            setTotal(data.total);
            setRows(data.rows);
          }
        }
      })
      .catch((error) => {
        Notification({
          type: 'error',
          title: '',
          description: error.message
        });
      })
      .finally(() => {
        setLoading(false);
      });
    return () => {
      unmounted = true;
    };
  }, [page, size]);

  const editPtz = (e) => {
    let clientId = e.clientId;
  };

  const deletePtz = (e) => {
    console.log('deletePtz: ' + JSON.stringify(e));
  };

  const addNewPtzProfile = () => {
    setShowCreate(true);
  };

  const columns = [
    {
      title: 'Tên',
      dataIndex: 'name',
      key: 'name',
      className: 'headerColums',

      fxed: 'left'
    },
    {
      title: 'ClientId',
      dataIndex: 'clientId',
      className: 'headerColums',
      key: 'clientId'
    },
    {
      title: 'Key',
      dataIndex: 'clientKey',
      className: 'headerColums',
      key: 'clientKey'
    },
    {
      title: 'Zone',
      dataIndex: 'zoneName',
      className: 'headerColums',
      key: 'zoneName'
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      className: 'headerColums',
      key: 'status'
    },
    {
      title: 'Last seen',
      dataIndex: 'lastConnected',
      className: 'headerColums',
      key: 'lastConnected'
    },
    {
      title: 'Thời gian',
      dataIndex: 'updateAt',
      className: 'headerColums',
      key: 'updateAt'
    },
    {
      title: 'Người thao tác',
      className: 'headerColums',
      dataIndex: 'updateBy',
      key: 'updateBy'
    },
    {
      title: 'Chỉnh sửa',
      className: 'headerColums',
      width: '12%',
      fixed: 'right',
      render: (text, record) => {
        return (
          <Space>
            <Button
              icon={<EditOutlined />}
              onClick={() => {
                editPtz(record);
              }}
            />
            <Button
              icon={<DeleteOutlined />}
              onClick={() => {
                deletePtz(record);
              }}
            />
          </Space>
        );
      }
    }
  ];

  return (
    <>
      <Breadcrumbs
        breadCrumbTitle="Quản lý Module"
        breadCrumbParent="PtzOnvif"
        breadCrumbActive="Danh sách"
      />
      <Card className="mb-1">
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div>
            <h1>Danh sách PTZ module</h1>
          </div>
          <div>
            <Button onClick={addNewPtzProfile}>+ Thêm mới</Button>
          </div>
        </div>
      </Card>
      <Table
        rowKey="clientId"
        size="medium"
        columns={columns}
        scroll={{ x: 'max-content' }}
        dataSource={rows}
        pagination={{
          hideOnSinglePage: false,
          current: page,
          total: total,
          pageSize: size,
          onChange: (value) => {
            setPage(value);
          },
          showTotal: (total, range) => {
            return (
              <ShowTotal>
                Đang xem {range[0]} đến {range[1]} trong tổng số {total} mục
              </ShowTotal>
            );
          }
        }}
      />
      {/*<CreatePtzProfile visible={showCreate} setVisible={setShowCreate}/>*/}
      {loading ? <Loading /> : null}
    </>
  );
};

export default withRouter(TablePtzManager);
