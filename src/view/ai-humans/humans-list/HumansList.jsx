import { Card, Progress, Table } from 'antd';
import 'antd/dist/antd.css';
import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import AIHumansApi from '../../../actions/api/ai-humans/AIHumansApi';
import TableUtils from '../../../actions/function/TableUltil';
import './../../commonStyle/commonTable.scss';
import './HumansList.scss';
import { bodyStyleCard, headStyleCard } from './variables';
import { useTranslation } from 'react-i18next';
import { ShowTotal } from '../../../styled/showTotal';
import Breadcrumds from '../../breadcrumds/Breadcrumds';

const HumansList = () => {
  const { t } = useTranslation();

  useEffect(() => {
    document.title = 'CCTV | Danh sách ổ cứng';
  }, []);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [showModal, setShowModal] = useState(false);

  const [listHardDrive, setListHardDrive] = useState([]);

  useEffect(() => {
    const data = {
      page: page - 1,
      pageSize: pageSize
    };
    AIHumansApi.getAllHumans(data).then((result) => {
      let dataResult = result[Object.keys(result)[0]];
      setListHardDrive(result);
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
      title: `${t('view.ai_humans.name')}`,
      dataIndex: 'name',
      key: 'name',
      className: 'headerColums',
      fixed: 'left',
      width: '15%',
      ...TableUtils.getColumnSearchProps('name')
    },
    {
      title: `${t('view.ai_humans.code')}`,
      dataIndex: 'code',
      className: 'headerColums',
      key: 'code',
      width: '5%'
    },
    {
      title: `${t('view.ai_humans.position')}`,
      dataIndex: 'position',
      className: 'headerColums',
      key: 'position',
      width: '10%'
    },
    {
      title: `${t('view.ai_humans.adminUnit')}`,
      dataIndex: 'adminUnit',
      className: 'headerColums',
      key: 'adminUnit',
      width: '10%'
    },
    {
      title: `${t('view.ai_humans.department')}`,
      dataIndex: 'department',
      className: 'headerColums',
      key: 'department',
      width: '10%'
    },
    {
      title: `${t('view.ai_humans.status')}`,
      dataIndex: 'status',
      className: 'headerColums',
      key: 'status',
      // render: renderPercentUsed,
      width: '10%'
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
        nameParent="Cài đặt"
        nameChild="Danh sách quản lý khuôn mặt"
      />
      <div className="tabs__container--device">
        <Card
          title="Danh sách quản lý khuôn mặt"
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

export default withRouter(HumansList);
