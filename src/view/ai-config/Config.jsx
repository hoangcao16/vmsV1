import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  SearchOutlined
} from '@ant-design/icons';
import {
  AutoComplete,
  Button,
  Card,
  Popconfirm,
  Select,
  Space,
  Table,
  Tag,
  Tabs,
} from 'antd';
import 'antd/dist/antd.css';
import { isEmpty } from 'lodash-es';
import debounce from 'lodash/debounce';
import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import CameraApi from '../../actions/api/camera/CameraApi';

import Notification from '../../components/vms/notification/Notification';
import './../commonStyle/commonInput.scss';
import './../commonStyle/commonSelect.scss';
import './../commonStyle/commonTable.scss';
import ModalEditHumans from './ModalEditHumans';
import './Config.scss';
import { bodyStyleCard, headStyleCard } from './variables';
import { useTranslation } from 'react-i18next';
import { reactLocalStorage } from 'reactjs-localstorage';
import Breadcrumds from '../breadcrumds/Breadcrumds';
import { ShowTotal } from '../../styled/showTotal';
import 'react-calendar-timeline/lib/Timeline.css'
import Timeline, {
  TimelineHeaders,
  SidebarHeader,
  DateHeader
} from "react-calendar-timeline/lib";
import moment from 'moment'
const { TabPane } = Tabs;




export const CATEGORY_NAME = {
  EVENT_TYPE: 'EVENT_TYPE',
  VENDOR: 'VENDOR',
  CAMERA_TYPE: 'CAMERA_TYPE',
  AD_DIVISIONS: 'AD_DIVISIONS',
  FIELD: 'FIELD'
};

const { Option } = Select;
const TableHumans = () => {
  const { t } = useTranslation();
  const language = reactLocalStorage.get('language');
  const [selectedHumansId, setSelectedHumansId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [total, setTotal] = useState(0);
  const [listHumans, setListHumans] = useState([]);
  const [listCameras, setListCameras] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    if (
      language == 'vn'
        ? (document.title = 'CCTV | Quản lý sự kiện thông minh')
        : (document.title = 'CCTV | AI Config Management')
    );
  }, []);

  useEffect(() => {
    const data = {
      page: page,
      pageSize: pageSize
    };
    CameraApi.getAllCamera(data).then((result) => {
      setListCameras(result);
    });

  }, []);

  function onSearch(val) {
    console.log('search:', val);
  }

  const groups = [{ id: 1, title: 'group 1', bgColor: 'white' }, { id: 2, title: 'group 2' }]

  const items = [
    {
      id: 1,
      group: 1,
      title: 'item 1',
      canMove: true,
      canResize: false,
      canChangeGroup: false,
      start_time: moment(),
      end_time: moment().add(1, 'hour')
    },
    {
      id: 1,
      group: 1,
      title: 'Random title',
      start_time: 1457902922261,
      end_time: 1457902922261 + 86400000,
      canMove: true,
      canResize: false,
      canChangeGroup: false,
      className: 'weekend',
      itemProps: {
        'data-custom-attribute': 'Random content'
      }
    },
    {
      id: 2,
      group: 2,
      title: 'item 2',
      canMove: true,
      canResize: false,
      canChangeGroup: false,
      start_time: moment().add(-0.5, 'hour'),
      end_time: moment().add(0.5, 'hour')
    },
    {
      id: 3,
      group: 1,
      title: 'item 3',
      canMove: true,
      canResize: false,
      canChangeGroup: false,
      start_time: moment().add(2, 'hour'),
      end_time: moment().add(3, 'hour')
    }
  ]
  const defaultTimeStart = moment()
    .startOf("day")
    .toDate();
  const defaultTimeEnd = moment()
    .startOf("day")
    .add(1, "day")
    .toDate();



  const getNameByCategory = () => {

    return (
      <div className="card--header">
        <h4>{t('view.ai_config.config')}</h4>



        <div className="search__toolbar">
          {/* <AutoComplete
            className="searchInputCamproxy"
            style={{ width: 350, height: 40, marginRight: 18 }}
            onSearch={debounce(handleSearch, 300)}
            placeholder={
              <div>
                <span> &nbsp;{t('view.map.search')} </span>{' '}
                <SearchOutlined style={{ fontSize: 22 }} />
              </div>
            }
          ></AutoComplete> */}

          <Button
            type="primary"
            onClick={() => {
              setSelectedHumansId(null);
              setShowModal(true);
            }}
          >
            <PlusOutlined />
          </Button>

          {/* <Button
              className="btnAdd"
              style={{ borderColor: '#7367F0' }}
              onClick={handleImport}
            >
              + Import
            </Button> */}
        </div>
      </div>
    );
  };


  const onShowSizeChange = (current, pageSize) => {
    setPage(current);
    setPageSize(pageSize);
  };

  const renderTag = (haveImg) => {
    let str = ""
    haveImg ? str = "Đã có ảnh" : str = "Chưa có ảnh"
    return (
      <Tag color={haveImg ? '#1380FF' : '#FF4646'} style={{ color: '#ffffff' }}>{str}</Tag>
    );
  };


  const categoryColumns = [
    {
      title: 'STT',
      fixed: 'left',
      key: 'index',
      className: 'headerColums',
      width: '10%',
      render: (text, record, index) => index + 1
    },
    {
      title: `${t('view.ai_humans.name')}`,
      dataIndex: 'name',
      key: 'name',
      className: 'headerColums',
      fixed: 'left',
      width: '15%',
      // ...TableUtils.getColumnSearchProps('name')
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
      dataIndex: 'haveImg',
      className: 'headerColums',
      key: 'haveImg',
      render: renderTag,
      width: '10%'
    },

  ];

  const addColumn = {
    title: 'Lĩnh vực',
    dataIndex: 'fieldName',
    key: 'fieldName',
    fixed: 'left',
    className: 'headerColums'
  };

  return (
    <div className="tabs__container--category">
      <Breadcrumds
        url="/app/setting"
        nameParent={t('breadcrumd.setting')}
        nameChild={t('view.ai_config.config')}
      />

      <div className="search mt-12 ">
        <Select
          showSearch
          style={{ width: '50%', marginBottom: '40px' }}
          placeholder="Select a person"
          optionFilterProp="children"
          onSearch={onSearch}
        // filterOption={(input, option) =>
        //   option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
        // }
        >
          {listCameras.map(x => (
            <Option key={x.uuid} value={x.uuid}>
              {x.name}
            </Option>
          ))}
        </Select>


      </div>
      <div className="tabs__container--store">
        <Tabs type="card">
          <TabPane tab={t('view.ai_config.hurdles_events')} key="1">
            {/* <TableNVR /> */}
          </TabPane>
          <TabPane tab={t('view.ai_config.intrusion_detection_events')} key="2">
            {/* <TableNVR /> */}
          </TabPane>
          <TabPane tab={t('view.ai_config.attendance_events')} key="3">
            {/* <TableNVR /> */}
          </TabPane>
        </Tabs>
      </div>

      <Card
        bodyStyle={bodyStyleCard}
        headStyle={headStyleCard}
        className="card--category"
      // headStyle={{ padding: 30 }}
      >
        <div className="tabs__container--store">
          <Tabs type="card">
            <TabPane tab={t('view.ai_config.area_config')} key="1">
              {/* Content of Tab Pane 1 */}
            </TabPane>
            <TabPane tab={t('view.ai_config.schedule_config')} key="2">
            <Timeline 
              groups={groups}
              items={items}
              defaultTimeStart={moment().startOf('d')}
              defaultTimeEnd={moment().endOf('d')}
              
              />
            </TabPane>
          </Tabs>
        </div>
      </Card>


    </div>
  );
};


export default withRouter(TableHumans);
