import { DeleteOutlined, InfoCircleOutlined } from '@ant-design/icons';
import {
  Button,
  Modal,
  Popconfirm,
  Select,
  Space,
  Table,
  Tabs,
  Typography
} from 'antd';
import 'antd/dist/antd.css';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import StorageApi from '../../../actions/api/storage/StorageApi';
import Notification from '../../../components/vms/notification/Notification';
import './../../commonStyle/commonTable.scss';
import MarkRecord from './MarkRecord';
import './TableStorage.scss';
import { useTranslation } from 'react-i18next';
import { ShowTotal } from '../../../styled/showTotal';
import { reactLocalStorage } from "reactjs-localstorage";


const { Paragraph } = Typography;

const ACTION = {
  DELETE: 1,
  HIGHLIGHT: 2,
  UNHIGHLIGHT: 3
};

const TABS = {
  DAILY_RECORD: 0,
  CAPTURE: 1,
  EVENT: 2,
  ALL: -1
};

const TableStorage = () => {
  const { t } = useTranslation();
  const [listFiles, setListFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [loading, setLoading] = useState(false);
  const [action, setAction] = useState(null);
  const [tabActive, setTabActive] = useState(TABS.DAILY_RECORD);

  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [total, setTotal] = useState(0);

  const language = reactLocalStorage.get("language");

  useEffect(() => {
    if (
      language == "vn"
        ? (document.title = "CCTV | Lưu trữ")
        : (document.title = "CCTV | Archive")
    );
  },[t]);

  useEffect(() => {
    const params = {
      page: page,
      size: size
    };
    StorageApi.getFileStorageByTabActive(tabActive, params).then((result) => {
      setListFiles(result.payload);
      setTotal(result?.metadata?.total);
    });
  }, [tabActive, selectedRowKeys, page, size]);

  const handleDeleteFile = async (fileId) => {
    const isDeleted = await StorageApi.delete(fileId);

    if (isDeleted) {
      const params = {
        page: page,
        size: size
      };
      StorageApi.getFileStorageByTabActive(tabActive, params).then((result) => {
        setListFiles(result.payload);
        setTotal(result?.metadata?.total);
      });
    }
  };

  const storageColumns = [
    {
      title: `${t('view.storage.NO')}`,
      fixed: 'left',
      key: 'index',
      className: 'headerUserColums',
      width: '5%',
      render: (text, record, index) => index + 1
    },
    {
      title: `${t('view.storage.file_name')}`,
      dataIndex: 'name',
      key: 'name',
      className: 'headerUserColums'
    },

    {
      title: `${t('view.storage.path')}`,
      dataIndex: 'path',
      key: 'path',
      className: 'headerUserColums'
    },

    {
      title: `${t('view.storage.length')}`,
      dataIndex: 'length',
      className: 'headerUserColums',
      key: 'length'
    },

    {
      title: `${t('view.storage.action')}`,
      width: '8%',
      fixed: 'right',
      className: 'headerUserColums',
      render: (text, record) => {
        return (
          <Space>
            <MarkRecord uuid={record.uuid} initValue={record.important} />

            <InfoCircleOutlined
              style={{ fontSize: '16px', color: '#6E6B7B' }}
              onClick={() => {
                setSelectedFile(record);
              }}
            />
            <Popconfirm
              title={t('noti.delete_archived_file', { this: t('this') })}
              onConfirm={() => handleDeleteFile(record.uuid)}
            >
              <DeleteOutlined style={{ fontSize: '16px', color: '#6E6B7B' }} />
            </Popconfirm>
          </Space>
        );
      }
    }
  ];

  const enforcementAction = async () => {
    setLoading(true);

    if (!action) {
      setLoading(false);
      Notification({
        type: 'error',
        title: '',
        description: 'Bạn chưa chọn hành động nên không thể thực thi'
      });
      return;
    }

    const payload = selectedRowKeys.map((p) => {
      return {
        uuid: p,
        importance: action === ACTION.HIGHLIGHT ? true : false
      };
    });

    if (action === ACTION.DELETE) {
      await StorageApi.deleteMultifiles(payload);
    }

    if (action === ACTION.HIGHLIGHT) {
      await StorageApi.makeHighlightMultifiles(payload);
    }
    if (action === ACTION.UNHIGHLIGHT) {
      await StorageApi.makeUnhighlightMultifiles(payload);
    }

    setTimeout(() => {
      setSelectedRowKeys([]);
      setLoading(false);
      const allFiles = StorageApi.getFileStorageByTabActive(tabActive);

      setListFiles(allFiles);
    }, 500);
  };

  const handleChangeSelect = (options) => {
    setAction(options);
  };

  const onSelectChange = (selectedRowKeys) => {
    setSelectedRowKeys(selectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange
  };
  const hasSelected = selectedRowKeys.length > 0;

  const options = [
    { label: 'DELETE', value: ACTION.DELETE },
    { label: 'HIGHTLIGHT', value: ACTION.HIGHLIGHT },
    { label: 'UNHIGHLIGHT', value: ACTION.UNHIGHLIGHT }
  ];

  const onChangeTabs = (tabsActive) => {
    setTabActive(tabsActive);
    setPage(1);
    setSize(10);
    setSelectedRowKeys([]);
  };

  // if (isEmpty(listFiles)) {
  //   return <Spin />;
  // }
  const onShowSizeChange = (current, pageSize) => {
    setPage(current);
    setSize(pageSize);
  };

  const formatDateTime = (ts) =>
    moment(ts * 1000).format('DD-MM-YYYY HH:mm:ss');

  return (
    <>
      {/* <Breadcrumbs
        breadCrumbTitle="Quản lý lưu trữ"
        breadCrumbParent="Video"
        breadCrumbActive="Danh sách"
      /> */}
      <div className="tabs__container--store">
        <Tabs
          defaultActiveKey={TABS.DAILY_RECORD}
          centered
          onChange={(e) => onChangeTabs(e)}
          type="card"
        >
          <Tabs.TabPane
            tab={t('view.storage.daily_record')}
            key={TABS.DAILY_RECORD}
            className="daily-record"
          >
            <div
              style={{ margin: 16, color: '#ffffff' }}
              className="top--content"
            >
              {hasSelected
                ? `${t('view.storage.choose')} ${selectedRowKeys.length} ${t(
                    'view.storage.record'
                  )}`
                : ''}
              <div className="setting--selected">
                {hasSelected && (
                  <>
                    <Select
                      showArrow
                      options={options}
                      disabled={!hasSelected}
                      placeholder={t('view.storage.choose_action')}
                      onChange={handleChangeSelect}
                    />
                    <Button
                      type="primary"
                      onClick={enforcementAction}
                      loading={loading}
                      danger
                    >
                      {t('view.storage.enforcement')}
                    </Button>
                  </>
                )}
              </div>
            </div>
            <Table
              rowKey="uuid"
              size="medium"
              columns={storageColumns}
              rowSelection={rowSelection}
              scroll={{ x: 'max-content', y: 500 }}
              pagination={{
                showSizeChanger: true,
                onShowSizeChange: (current, size) => {
                  onShowSizeChange(current, size);
                },

                hideOnSinglePage: false,
                current: page,
                total: total,
                pageSize: size,
                onChange: (value) => {
                  setPage(value);
                },
                showTotal: (total, range) => {
                  return (
                    <ShowTotal className="show--total">
                      {t('view.user.detail_list.viewing')} {range[0]}{' '}
                      {t('view.user.detail_list.to')} {range[1]}{' '}
                      {t('view.user.detail_list.out_of')} {total}{' '}
                      {t('view.user.detail_list.indexes')}
                    </ShowTotal>
                  );
                }
              }}
              dataSource={listFiles}
            />
          </Tabs.TabPane>
          <Tabs.TabPane
            tab={t('view.storage.capture')}
            key={TABS.CAPTURE}
            className="capture"
          >
            <div
              style={{ margin: 16, color: '#ffffff' }}
              className="top--content"
            >
              {hasSelected
                ? `${t('view.storage.choose')} ${selectedRowKeys.length} ${t(
                    'view.storage.record'
                  )}`
                : ''}
              <div className="setting--selected">
                {hasSelected && (
                  <>
                    <Select
                      showArrow
                      options={options}
                      disabled={!hasSelected}
                      placeholder={t('view.storage.choose_action')}
                      onChange={handleChangeSelect}
                    />
                    <Button
                      type="danger"
                      onClick={enforcementAction}
                      loading={loading}
                    >
                      {t('view.storage.enforcement')}
                    </Button>
                  </>
                )}
              </div>
            </div>
            <Table
              rowKey="id"
              size="medium"
              columns={storageColumns}
              rowSelection={rowSelection}
              // scroll={{ x: 'max-content' }}
              scroll={{ x: 'max-content', y: 500 }}
              // pagination={{ position: 'bottomCenter' }}
              pagination={{
                showSizeChanger: true,
                onShowSizeChange: (current, size) => {
                  onShowSizeChange(current, size);
                },

                hideOnSinglePage: false,
                current: page,
                total: total,
                pageSize: size,
                onChange: (value) => {
                  setPage(value);
                },
                showTotal: (total, range) => {
                  return (
                    <ShowTotal className="show--total">
                      {t('view.user.detail_list.viewing')} {range[0]}{' '}
                      {t('view.user.detail_list.to')} {range[1]}{' '}
                      {t('view.user.detail_list.out_of')} {total}{' '}
                      {t('view.user.detail_list.indexes')}
                    </ShowTotal>
                  );
                }
              }}
              dataSource={listFiles}
            />
          </Tabs.TabPane>
          <Tabs.TabPane tab={t('view.storage.file_event')} key={TABS.EVENT} className="event">
            <div
              style={{ margin: 16, color: '#ffffff' }}
              className="top--content"
            >
              {hasSelected
                ? `${t('view.storage.choose')} ${selectedRowKeys.length} ${t(
                    'view.storage.record'
                  )}`
                : ''}
              <div className="setting--selected">
                {hasSelected && (
                  <>
                    <Select
                      showArrow
                      options={options}
                      disabled={!hasSelected}
                      placeholder={t('view.storage.choose_action')}
                      onChange={handleChangeSelect}
                    />
                    <Button
                      type="danger"
                      onClick={enforcementAction}
                      loading={loading}
                    >
                      {t('view.storage.enforcement')}
                    </Button>
                  </>
                )}
              </div>
            </div>
            <Table
              rowKey="id"
              size="medium"
              columns={storageColumns}
              rowSelection={rowSelection}
              scroll={{ x: 'max-content', y: 500 }}
              // scroll={{ x: 'max-content' }}
              pagination={{
                showSizeChanger: true,
                onShowSizeChange: (current, size) => {
                  onShowSizeChange(current, size);
                },

                hideOnSinglePage: false,
                current: page,
                total: total,
                pageSize: size,
                onChange: (value) => {
                  setPage(value);
                },
                showTotal: (total, range) => {
                  return (
                    <ShowTotal className="show--total">
                      {t('view.user.detail_list.viewing')} {range[0]}{' '}
                      {t('view.user.detail_list.to')} {range[1]}{' '}
                      {t('view.user.detail_list.out_of')} {total}{' '}
                      {t('view.user.detail_list.indexes')}
                    </ShowTotal>
                  );
                }
              }}
              dataSource={listFiles}
            />
          </Tabs.TabPane>
          <Tabs.TabPane
            tab={t('view.storage.all')}
            key={TABS.ALL}
            className="all"
          >
            <div
              style={{ margin: 16, color: '#ffffff' }}
              className="top--content"
            >
              {hasSelected
                ? `${t('view.storage.choose')} ${selectedRowKeys.length} ${t(
                    'view.storage.record'
                  )}`
                : ''}
              <div className="setting--selected">
                {hasSelected && (
                  <>
                    <Select
                      showArrow
                      options={options}
                      disabled={!hasSelected}
                      placeholder={t('view.storage.choose_action')}
                      onChange={handleChangeSelect}
                    />
                    <Button
                      type="danger"
                      onClick={enforcementAction}
                      loading={loading}
                    >
                      {t('view.storage.enforcement')}
                    </Button>
                  </>
                )}
              </div>
            </div>
            <Table
              rowKey="id"
              size="medium"
              columns={storageColumns}
              rowSelection={rowSelection}
              scroll={{ x: 'max-content', y: 500 }}
              // scroll={{ x: 'max-content' }}
              pagination={{
                showSizeChanger: true,
                onShowSizeChange: (current, size) => {
                  onShowSizeChange(current, size);
                },

                hideOnSinglePage: false,
                current: page,
                total: total,
                pageSize: size,
                onChange: (value) => {
                  setPage(value);
                },
                showTotal: (total, range) => {
                  return (
                    <ShowTotal className="show--total">
                      {t('view.user.detail_list.viewing')} {range[0]}{' '}
                      {t('view.user.detail_list.to')} {range[1]}{' '}
                      {t('view.user.detail_list.out_of')} {total}{' '}
                      {t('view.user.detail_list.indexes')}
                    </ShowTotal>
                  );
                }
              }}
              dataSource={listFiles}
            />
          </Tabs.TabPane>
        </Tabs>
      </div>

      <Modal
        title={t('view.storage.file_detail')}
        visible={!!selectedFile}
        onCancel={() => setSelectedFile(null)}
        footer={null}
        className="modal--detail-files"
      >
        {selectedFile && (
          <>
            <Paragraph>
              <p style={{ fontWeight: 600, fontSize: 14 }}>
                {t('view.camera.camera_name', { cam: t('camera') })}
              </p>
              <p>{selectedFile.camera_name}</p>
            </Paragraph>
            <Paragraph className="mt-2">
              <p style={{ fontWeight: 600, fontSize: 14 }}>
                {t('view.storage.file_name')}
              </p>
              <p>{selectedFile.name}</p>
            </Paragraph>
            <Paragraph>
              <p style={{ fontWeight: 600, fontSize: 14 }}>
                {t('view.storage.path')}
              </p>
              <p>{selectedFile.path}</p>
            </Paragraph>

            <Paragraph>
              <p>
                <p style={{ fontWeight: 600, fontSize: 14 }}>
                  {t('view.storage.create_time')}
                </p>
                <p>{formatDateTime(selectedFile.createdTime)}</p>
              </p>
              <p>
                <p style={{ fontWeight: 600, fontSize: 14 }}>
                  {t('view.storage.len')}
                </p>
                <p>{selectedFile.length}</p>
              </p>
            </Paragraph>
            <Paragraph className="mt-2">
              <p>
                <p style={{ fontWeight: 600, fontSize: 14 }}>
                  {t('view.storage.time_start_record')}
                </p>
                <p>{formatDateTime(selectedFile.startRecordTime)}</p>
              </p>
              <p>
                <p style={{ fontWeight: 600, fontSize: 14 }}>
                  {t('view.storage.time_end_record')}
                </p>
                <p>{formatDateTime(selectedFile.endRecordTime)}</p>
              </p>
            </Paragraph>

            <div className="btn--submit" onClick={() => setSelectedFile(null)}>
              <Button type="primary" htmlType="submit ">
                {t('view.camera.close')}
              </Button>
            </div>
          </>
        )}
      </Modal>
    </>
  );
};

export default withRouter(TableStorage);
