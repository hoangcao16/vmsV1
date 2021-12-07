import { EditOutlined, PlusOutlined, DeleteOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { Button, Card, Checkbox, Tabs, Row, Col, Form, Input, Table, Space, Popconfirm, Spin } from 'antd';
import 'antd/dist/antd.css';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import Timeline from "react-calendar-timeline/lib";
import 'react-calendar-timeline/lib/Timeline.css';
import { useTranslation } from 'react-i18next';
import { withRouter } from 'react-router-dom';
import { reactLocalStorage } from "reactjs-localstorage";
import AIConfigScheduleApi from '../../actions/api/ai-config/AIConfigScheduleApi';
import AIConfigRectApi from '../../actions/api/ai-config/AIConfigRectApi';
import CameraApi from '../../actions/api/camera/CameraApi';
import ModalEditScheduleConfig from './ModalEditScheduleConfig';
import ModalScheduleConfigCopy from './ModalScheduleConfigCopy';
import './TabType.scss';
import imagePoster from "../../assets/event/videoposter.png";
import { bodyStyleCard, headStyleCard } from './variables';
import Notification from "../../components/vms/notification/Notification";
import { NOTYFY_TYPE } from "../common/vms/Constant";
import getServerCamproxyForPlay from "../../utility/vms/camera";
import playCamApi from "../../api/camproxy/cameraApi";
import _ from "lodash";
import { MemoizedTabSchedule } from './TabSchedule';
import { MemoizedTabRect } from './TabRect';


const { TabPane } = Tabs;

const CheckboxGroup = Checkbox.Group;





const TabType = (props) => {
  const { cameraUuid, type } = props
  const { t } = useTranslation();
  const [checkStatus, setCheckStatus] = useState(false);




  function onChangeCheckBox(val) {
    setCheckStatus(val.target.checked)
  }


  return (
    <div className="tabs__container--tab_type">
      <div className="activate tab_type_checkbox">
        <Checkbox onChange={onChangeCheckBox} checked={checkStatus}>{t('view.ai_config.activate_' + type)}</Checkbox>
      </div>

      <Card
        bodyStyle={bodyStyleCard}
        headStyle={headStyleCard}
        className="card--category"
      // headStyle={{ padding: 30 }}
      >
        <div className="" >
          <Tabs type="card" >
            {type != "attendance" ?
              <TabPane tab={t('view.ai_config.area_config')} key="2">
                <MemoizedTabRect cameraUuid={cameraUuid} type={type}></MemoizedTabRect>
              </TabPane>
              : null}
            <TabPane tab={t('view.ai_config.schedule_config')} key="1">
              <MemoizedTabSchedule cameraUuid={cameraUuid} type={type}></MemoizedTabSchedule>
            </TabPane>

          </Tabs>
        </div>

      </Card>
    </div>
  );
};

function tabSchedulePropsAreEqual(prevTabType, nextTabType) {
  return _.isEqual(prevTabType.cameraUuid, nextTabType.cameraUuid) && _.isEqual(prevTabType.type, prevTabType.type);
}

export const MemoizedTabType = React.memo(TabType, tabSchedulePropsAreEqual);
