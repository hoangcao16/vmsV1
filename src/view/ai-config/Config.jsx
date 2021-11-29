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
import TabSchedule from './TabSchedule';
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
  const [cameraUuid, setCameraUuid] = useState("");
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
  const [data, setData] = useState(false);
  const [selectDay, setSelectDay] = useState("");


  useEffect(() => {
    if (
      language == 'vn'
        ? (document.title = 'CCTV | Quản lý sự kiện thông minh')
        : (document.title = 'CCTV | AI Config Management')
    );
    
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
      cameraUuid: cameraUuid
    };
    AIConfigScheduleApi.getAllConfigSchedule(data).then((result) => {
      setData(result)
      setDefaultData(result)
    });
  }, [cameraUuid]);


  function setDefaultData(data) {
    const itemList = [];
    let i = 1;
    setListTimesCN(data?.sunday)
    data?.sunday && data.sunday.map(item => {
        const start = item.startTime * 1000
        const end = item.endTime * 1000
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
      setListTimes2(data?.monday)
      data?.monday && data.monday.map(item => {
        const start = item.startTime * 1000
        const end = item.endTime * 1000
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
      setListTimes3(data?.tuesday)
      data?.tuesday && data.tuesday.map(item => {
        const start = item.startTime * 1000
        const end = item.endTime * 1000
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
      setListTimes4(data?.wednesday)
      data?.wednesday && data.wednesday.map(item => {
        const start = item.startTime * 1000
        const end = item.endTime * 1000
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
      setListTimes5(data?.thursday)
      data?.thursday && data.thursday.map(item => {
        const start = item.startTime * 1000
        const end = item.endTime * 1000
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
      setListTimes6(data?.friday)
      data?.friday && data.friday.map(item => {
        const start = item.startTime * 1000
        const end = item.endTime * 1000
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
      setListTimes7(data?.saturday)
      data?.saturday && data.saturday.map(item => {
        const start = item.startTime * 1000
        const end = item.endTime * 1000
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
  }

  function onSearch(val) {
    console.log('search:', val);
  }
  function onChangeCheckBox(val) {
    setCheckStatus(val.target.checked)
  }

  const getTimeLong = (start_m, end_m) => {
    if (start_m && end_m) {
      const start = moment([2021, 1, 1, start_m.get('hour'), start_m.get('minute'), start_m.get('second'), start_m.get('millisecond')])
      const end = moment([2021, 1, 1, end_m.get('hour'), end_m.get('minute'), end_m.get('second'), end_m.get('millisecond')])
      return {
        startTime: start.unix(),
        endTime: end.unix()
      }
    }

  }

  const handleSubmit = async () => {
    const payload = {
      ...data
    };

    try {
      let isPost = await AIConfigScheduleApi.addConfigSchedule(payload);

        if (isPost) {
          const notifyMess = {
            type: "success",
            title: `${t('noti.success')}`,
            description: `Bạn đã add thành công`,
          };
          Notification(notifyMess);
          setShowModal(false)
        }
    } catch (error) {
      console.log(error);
    }
  };


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
    <div className="tabs__container--ai_config">
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
          <TabSchedule cameraUuid={cameraUuid} type="hurdles"></TabSchedule>
          </TabPane>
          <TabPane tab={t('view.ai_config.intrusion_detection_events')} key="2" width='480px'>
          <TabSchedule cameraUuid={cameraUuid} type="intrusion_detection"></TabSchedule>
          </TabPane>
          <TabPane tab={t('view.ai_config.attendance_events')} key="3">
            <TabSchedule cameraUuid={cameraUuid} type="attendance"></TabSchedule>
          </TabPane>
        </Tabs>
      </div>

      


    </div>
  );
};


export default withRouter(Config);
