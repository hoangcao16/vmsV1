import { Card, Progress, Table } from 'antd';
import 'antd/dist/antd.css';
import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import HardDriveListApi from '../../../actions/api/hard-drive-list/HardDriveListApi';
import TableUtils from '../../../actions/function/TableUltil';
import './../../commonStyle/commonTable.scss';
import './TableHardDriveList.scss';
import { bodyStyleCard, headStyleCard } from './variables';
import { useTranslation } from 'react-i18next';
import { ShowTotal } from '../../../styled/showTotal';
import { reactLocalStorage } from "reactjs-localstorage";

import Breadcrumds from '../../breadcrumds/Breadcrumds';

const TableHardDriveList = () => {
  const { t } = useTranslation();
  const language = reactLocalStorage.get("language");

  useEffect(() => {
    if (
      language === "vn"
        ? (document.title = "CCTV | Danh sách ổ cứng")
        : (document.title = "CCTV | Hard Drive List")
    );
  }, [t]);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);

  const [listHardDrive, setListHardDrive] = useState([]);

  useEffect(() => {
    const data = {
      page: page - 1,
      pageSize: pageSize,
      lang: language
    };
    HardDriveListApi.getAllHardDrive(data).then((result) => {
      let dataResult = result[Object.keys(result)[0]];
      setListHardDrive(dataResult);
      setTotal(result?.total);
    });
  }, [page, pageSize]);

  const onShowSizeChange = (current, pageSize) => {
    setPage(current);
    setPageSize(pageSize);
  };

  const renderPercentUsed = (cellValue, row) => {
    return <Progress percent={cellValue} />;
  };

  const renderHardDriveCapacity = (cellValue, row) => {
    const data = Math.round(cellValue/1024)
    return `${data} GB`
  }

  const hardDriveColumns = [
    {
      title: `${t('view.storage.NO')}`,
      fixed: 'left',
      key: 'index',
      className: 'headerColums',
      width: '5%',
      render: (text, record, index) => index + 1
    },
    {
      title: `${t('view.storage.hard_drive_name')}`,
      dataIndex: 'name',
      key: 'name',
      className: 'headerColums',
      fixed: 'left',
      width: '30%',
      ...TableUtils.getColumnSearchProps('name')
    },
    {
      title: `${t('view.storage.total_disk_space')}`,
      dataIndex: 'diskSpace',
      className: 'headerColums',
      key: 'diskSpace',
      width: '15%',
      render: renderHardDriveCapacity
    },
    {
      title: `${t('view.storage.percent_used')}`,
      dataIndex: 'percentUsed',
      className: 'headerColums',
      key: 'percentUsed',
      render: renderPercentUsed,
      width: '20%'
    },
    {
      title: `${t('view.storage.time_remaining')}`,
      dataIndex: 'timeUsed',
      className: 'headerColums',
      key: 'timeUsed',
      width: '20%'
    },
    {
      title: 'URL',
      dataIndex: 'path',
      className: 'headerColums',
      key: 'path',
      width: '10%'
    }
  ];
  return (
    <>
      <Breadcrumds
        url="/app/setting"
        nameParent={t('breadcrumd.setting')}
        nameChild={t('view.user.hard_drive_list')}
      />
      <div className="tabs__container--device">
        <Card
          title={t('view.user.hard_drive_list')}
          bodyStyle={bodyStyleCard}
          headStyle={headStyleCard}
          className="card--listDevice"
        >
          <Table
            className="table__hard--drive--list"
            pagination={{
              showSizeChanger: true,
              onShowSizeChange: (current, size) => {
                onShowSizeChange(current, size);
              },
              hideOnSinglePage: false,
              current: page,
              total: total,
              pageSize: pageSize,
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
            // scroll={{ x: 0, y: 500 }}
            rowKey="id"
            columns={hardDriveColumns}
            dataSource={listHardDrive}
          />
        </Card>
      </div>
    </>
  );
};

export default withRouter(TableHardDriveList);
