import {
  ConsoleSqlOutlined,
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
  Checkbox
} from 'antd';
import 'antd/dist/antd.css';
import { isEmpty } from 'lodash-es';
import debounce from 'lodash/debounce';
import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import CameraApi from '../../actions/api/camera/CameraApi';
import AIConfigScheduleApi from '../../actions/api/ai-config/AIConfigScheduleApi';

import Notification from '../../components/vms/notification/Notification';
import './../commonStyle/commonInput.scss';
import './../commonStyle/commonSelect.scss';
import './../commonStyle/commonTable.scss';
import ModalEditScheduleConfig from './ModalEditScheduleConfig';
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
const Config = () => {
  const { t } = useTranslation();
  const language = reactLocalStorage.get('language');
  const [selectedHumansId, setSelectedHumansId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [total, setTotal] = useState(0);
  const [checkStatus, setCheckStatus] = useState(false);
  const [listCameras, setListCameras] = useState([]);
  const [cameraUuid, setCameraUuid] = useState("2c57a9a9-97a8-4048-af62-98068757f5cd");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [listDetail, setListDetail] = useState(10);
  const [listTimes, setListTimes] = useState([]);
  const [listTimesCN, setListTimesCN] = useState([]);
  const [listTimes2, setListTimes2] = useState([]);
  const [listTimes3, setListTimes3] = useState([]);
  const [listTimes4, setListTimes4] = useState([]);
  const [listTimes5, setListTimes5] = useState([]);
  const [listTimes6, setListTimes6] = useState([]);
  const [listTimes7, setListTimes7] = useState([]);

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

  useEffect(() => {
    const data = {
      type: '',
      cameraUuid: "2c57a9a9-97a8-4048-af62-98068757f5cd"
    };
    AIConfigScheduleApi.getAllConfigSchedule(data).then((result) => {
      const itemList = [];
      let i = 1;
      setListTimesCN(result?.sunday)
      result?.sunday && result.sunday.map(item => {
        const start = item.startTime*1000
        const end = item.endTime*1000
        itemList.push({
          id: i,
          group: 1,
          title: '',
          canMove: true,
          canResize: false,
          canChangeGroup: false,
          start_time: moment([2021, 1, 1, moment(start).get('hour'), moment(start).get('minute'), moment(start).get('second'), moment(start).get('millisecond')]),
          end_time: moment([2021, 1, 1, moment(end).get('hour'), moment(end).get('minute'), moment(end).get('second'), moment(end).get('millisecond')])
        })
        i++
      })
      setListTimes2(result?.monday)
      result?.monday && result.monday.map(item => {
        const start = item.startTime*1000
        const end = item.endTime*1000
        itemList.push({
          id: i,
          group: 2,
          title: '',
          canMove: true,
          canResize: false,
          canChangeGroup: false,
          start_time: moment([2021, 1, 1, moment(start).get('hour'), moment(start).get('minute'), moment(start).get('second'), moment(start).get('millisecond')]),
          end_time: moment([2021, 1, 1, moment(end).get('hour'), moment(end).get('minute'), moment(end).get('second'), moment(end).get('millisecond')])
        })
        i++
      })
      setListTimes3(result?.tuesday)
      result?.tuesday && result.tuesday.map(item => {
        const start = item.startTime*1000
        const end = item.endTime*1000
        itemList.push({
          id: i,
          group: 3,
          title: '',
          canMove: true,
          canResize: false,
          canChangeGroup: false,
          start_time: moment([2021, 1, 1, moment(start).get('hour'), moment(start).get('minute'), moment(start).get('second'), moment(start).get('millisecond')]),
          end_time: moment([2021, 1, 1, moment(end).get('hour'), moment(end).get('minute'), moment(end).get('second'), moment(end).get('millisecond')])
        })
        i++
      })
      setListTimes4(result?.wednesday)
      result?.wednesday && result.wednesday.map(item => {
        const start = item.startTime*1000
        const end = item.endTime*1000
        itemList.push({
          id: i,
          group: 4,
          title: '',
          canMove: true,
          canResize: false,
          canChangeGroup: false,
          start_time: moment([2021, 1, 1, moment(start).get('hour'), moment(start).get('minute'), moment(start).get('second'), moment(start).get('millisecond')]),
          end_time: moment([2021, 1, 1, moment(end).get('hour'), moment(end).get('minute'), moment(end).get('second'), moment(end).get('millisecond')])
        })
        i++
      })
      setListTimes5(result?.thursday)
      result?.thursday && result.thursday.map(item => {
        const start = item.startTime*1000
        const end = item.endTime*1000
        itemList.push({
          id: i,
          group: 5,
          title: '',
          canMove: true,
          canResize: false,
          canChangeGroup: false,
          start_time: moment([2021, 1, 1, moment(start).get('hour'), moment(start).get('minute'), moment(start).get('second'), moment(start).get('millisecond')]),
          end_time: moment([2021, 1, 1, moment(end).get('hour'), moment(end).get('minute'), moment(end).get('second'), moment(end).get('millisecond')])
        })
        i++
      })
      setListTimes6(result?.friday)
      result?.friday && result.friday.map(item => {
        const start = item.startTime*1000
        const end = item.endTime*1000
        itemList.push({
          id: i,
          group: 6,
          title: '',
          canMove: true,
          canResize: false,
          canChangeGroup: false,
          start_time: moment([2021, 1, 1, moment(start).get('hour'), moment(start).get('minute'), moment(start).get('second'), moment(start).get('millisecond')]),
          end_time: moment([2021, 1, 1, moment(end).get('hour'), moment(end).get('minute'), moment(end).get('second'), moment(end).get('millisecond')])
        })
        i++
      })
      setListTimes7(result?.saturday)
      result?.saturday && result.saturday.map(item => {
        const start = item.startTime*1000
        const end = item.endTime*1000
        itemList.push({
          id: i,
          group: 7,
          title: '',
          canMove: true,
          canResize: false,
          canChangeGroup: false,
          start_time: moment([2021, 1, 1, moment(start).get('hour'), moment(start).get('minute'), moment(start).get('second'), moment(start).get('millisecond')]),
          end_time: moment([2021, 1, 1, moment(end).get('hour'), moment(end).get('minute'), moment(end).get('second'), moment(end).get('millisecond')])
        })
        i++
      })
      setListDetail(itemList)
    });
  }, [cameraUuid]);

  function onSearch(val) {
    console.log('search:', val);
  }
  function onChangeCheckBox(val) {
    setCheckStatus(val.target.checked)
  }




  const groups = [
    {
      id: 1, title: 'Chủ nhật', bgColor: 'white', rightTitle: <EditOutlined
        style={{ fontSize: '16px', color: '#6E6B7B' }}
        onClick={() => {
          setListTimes(listTimesCN)
          setShowModal(true);
        }}
      />,
    },
    {
      id: 2, title: 'Thứ hai', bgColor: 'white', rightTitle: <EditOutlined
        style={{ fontSize: '16px', color: '#6E6B7B' }}
        onClick={() => {
          setListTimes(listTimes2)
          setShowModal(true);
        }}
      />,
    },
    {
      id: 3, title: 'Thứ ba', bgColor: 'white', rightTitle: <EditOutlined
        style={{ fontSize: '16px', color: '#6E6B7B' }}
        onClick={() => {
          setListTimes(listTimes3)
          setShowModal(true);
        }}
      />,
    },
    {
      id: 4, title: 'Thứ tư', bgColor: 'white', rightTitle: <EditOutlined
        style={{ fontSize: '16px', color: '#6E6B7B' }}
        onClick={() => {
          setListTimes(listTimes4)
          setShowModal(true);
        }}
      />,
    },
    {
      id: 5, title: 'Thứ năm', bgColor: 'white', rightTitle: <EditOutlined
        style={{ fontSize: '16px', color: '#6E6B7B' }}
        onClick={() => {
          setListTimes(listTimes5)
          setShowModal(true);
        }}
      />,
    },
    {
      id: 6, title: 'Thứ sáu', bgColor: 'white', rightTitle: <EditOutlined
        style={{ fontSize: '16px', color: '#6E6B7B' }}
        onClick={() => {
          setListTimes(listTimes6)
          setShowModal(true);
        }}
      />,
    },
    {
      id: 7, title: 'Thứ bảy', bgColor: 'white', rightTitle: <EditOutlined
        style={{ fontSize: '16px', color: '#6E6B7B' }}
        onClick={() => {
          setListTimes(listTimes7)
          setShowModal(true);
        }}
      />,
    },
  ]

  function onChangeSelect(selected) {
    setCameraUuid(selected)
  }



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
          onChange={onChangeSelect}
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
          </TabPane>
          <TabPane tab={t('view.ai_config.intrusion_detection_events')} key="2">
          </TabPane>
          <TabPane tab={t('view.ai_config.attendance_events')} key="3">
          </TabPane>
        </Tabs>
      </div>

      <div className="tabs__container--store">
        <Checkbox onChange={onChangeCheckBox} checked={checkStatus}>Checkbox</Checkbox>
      </div>



      <Card
        bodyStyle={bodyStyleCard}
        headStyle={headStyleCard}
        className="card--category"
      // headStyle={{ padding: 30 }}
      >
        <div className="tabs__container--store" >
          <Tabs type="card" >
            <TabPane tab={t('view.ai_config.area_config')} key="1">
              {/* Content of Tab Pane 1 */}
            </TabPane>
            <TabPane tab={t('view.ai_config.schedule_config')} key="2">
              <Timeline
                style={{ color: 'white', marginTop: '20px', marginBottom: '20px' }}
                groups={groups}
                items={listDetail}
                defaultTimeStart={moment([2021, 1, 1, 0, 0, 0, 0])}
                defaultTimeEnd={moment([2021, 1, 1, 23, 59, 59, 999])}
                visibleTimeStart={moment([2021, 1, 1, 0, 0, 0, 0])}
                visibleTimeEnd={moment([2021, 1, 1, 23, 59, 59, 999])}
                rightSidebarWidth={30}
                rightSidebarContent={<div>Above The Right</div>}
                canResize={false}
                useResizeHandle={false}
              />
            </TabPane>
          </Tabs>
        </div>
        <div className="footer__modal">
          <Button type="primary" htmlType="submit ">
            {t('view.user.detail_list.confirm')}
          </Button>
          <Button
            onClick={() => {
              setShowModal(true);
            }}
          >
            {t('view.camera.close')}
          </Button>
        </div>
      </Card>
      {showModal &&
        <ModalEditScheduleConfig
          listTimes={listTimes}
          selectedHumansId={selectedHumansId}
          setShowModal={setShowModal}
        />

      }


    </div>
  );
};


export default withRouter(Config);
