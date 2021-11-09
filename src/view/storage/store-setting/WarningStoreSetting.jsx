import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import {
  Button,
  Card,
  Image,
  Popconfirm,
  Radio,
  Select,
  Spin,
  Switch,
  Tooltip
} from 'antd';
import 'antd/dist/antd.css';
import { isEmpty } from 'lodash-es';
import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import SettingApi from '../../../actions/api/setting/SettingApi';
import warnLogo from '../../../assets/img/pages/store-setting/warn-logo.png';
import Notification from '../../../components/vms/notification/Notification';
import { NOTYFY_TYPE } from '../../common/vms/Constant';
import './../../commonStyle/commonCard.scss';
import './../../commonStyle/commonForm.scss';
import './../../commonStyle/commonInput.scss';
import './../../commonStyle/commonModal.scss';
import './../../commonStyle/commonSelect.scss';
import {
  bodyStyleCard,
  dropdownStyle,
  errorColor,
  headStyleCard
} from './variables';
import { useTranslation } from 'react-i18next';

//for select
const { Option } = Select;

const DEFAULT_DATA = {
  percentUsedOne: 0,
  timeOne: 0,
  isActiveOne: false,
  percentUsedTwo: 0,
  timeTwo: 0,
  isActiveTwo: false,
  autoRemovePerFile: false,
  autoRemoveFreeSpaceFile: false
};

//convertData
const convertWarningDiskData = (data) => {
  if (isEmpty(data)) {
    return [];
  }
  let result;
  result = {
    percentUsedOne:
      data?.configWarningDisk?.percentUsedOne || DEFAULT_DATA.percentUsedOne,
    timeOne: data?.configWarningDisk?.timeOne || DEFAULT_DATA.timeOne,
    isActiveOne: data?.configWarningDisk?.isActiveOne || DEFAULT_DATA.isActiveOne,
    percentUsedTwo:
      data?.configWarningDisk?.percentUsedTwo || DEFAULT_DATA.percentUsedTwo,
    timeTwo: data?.configWarningDisk?.timeTwo || DEFAULT_DATA.timeTwo,
    isActiveTwo: data?.configWarningDisk?.isActiveTwo || DEFAULT_DATA.isActiveTwo,
    autoRemovePerFile: data?.autoRemovePerFile || DEFAULT_DATA.autoRemovePerFile,
    autoRemoveFreeSpaceFile:
      data?.autoRemoveFreeSpaceFile || DEFAULT_DATA.autoRemoveFreeSpaceFile
  };
  console.log('data warning', result);

  return result;
};

//
const WarningStoreSetting = (props) => {
  const { t } = useTranslation();
  //for data
  const [warningDiskData, setWarningDiskData] = useState({});

  //for switch
  const [isSwitchOneTurnOn, setIsSwitchOneTurnOn] = useState(false);
  const [isSwitchTwoTurnOn, setIsSwitchTwoTurnOn] = useState(false);

  const [percentUsedOne, setPercentUsedOne] = useState(0);
  const [percentUsedTwo, setPercentUsedTwo] = useState(0);

  const [isError, setIsError] = useState(false);
  const [isVisibleOne, setIsVisibleOne] = useState(false);
  const [isVisibleTwo, setIsVisibleTwo] = useState(false);

  //call data
  useEffect(() => {
    SettingApi.getDataWarningDisk().then(async (data) => {
      console.log('getDataWarningDisk', data)
      let convertedData = await convertWarningDiskData(data?.payload);
      setPercentUsedTwo(convertedData?.percentUsedTwo);
      setPercentUsedOne(convertedData?.percentUsedOne);
      setIsSwitchOneTurnOn(convertedData?.isActiveOne);
      setIsSwitchTwoTurnOn(convertedData?.isActiveTwo);
      setWarningDiskData(convertedData);
      console.log(convertedData);
      return;
    });
  }, []);

  //for switch one
  const onChangeSwitchOne = (checked) => {
    setIsSwitchOneTurnOn(checked);
    if (checked) {
      setWarningDiskData({
        ...warningDiskData,
        isActiveOne: checked,
        percentUsedOne: percentUsedOne
      });
      if (isSwitchTwoTurnOn) {
        if (percentUsedOne < warningDiskData?.percentUsedTwo) {
          setIsError(false);
          setIsVisibleOne(false);
          setIsVisibleTwo(false);
        } else {
          setIsError(true);
          setIsVisibleOne(true);
          setIsVisibleTwo(false);
        }
      }
    } else {
      setWarningDiskData({
        ...warningDiskData,
        isActiveOne: checked,
      });
      setIsError(false);
      setIsVisibleOne(false);
      setIsVisibleTwo(false);
    }
  };

  //for switch two
  const onChangeSwitchTwo = (checked) => {
    setIsSwitchTwoTurnOn(checked);
    if (checked) {
      setWarningDiskData({
        ...warningDiskData,
        isActiveTwo: checked,
        percentUsedTwo: percentUsedTwo
      });
      if (isSwitchOneTurnOn) {
        if (percentUsedTwo > warningDiskData?.percentUsedOne) {
          setIsError(false);
          setIsVisibleTwo(false);
          setIsVisibleOne(false);
        } else {
          setIsError(true);
          setIsVisibleTwo(true);
          setIsVisibleOne(false);
        }
      }
    } else {
      setWarningDiskData({
        ...warningDiskData,
        isActiveTwo: checked,
      });
      setIsError(false);
      setIsVisibleOne(false);
      setIsVisibleTwo(false);
    }
  };

  const onChangeSelectPerOne = (value) => {
    setPercentUsedOne(value);
    setWarningDiskData({
      ...warningDiskData,
      percentUsedOne: value
    });
    if (isSwitchTwoTurnOn) {
      if (value < warningDiskData?.percentUsedTwo) {
        setIsError(false);
        setIsVisibleOne(false);
        setIsVisibleTwo(false);
      } else {
        setIsError(true);
        setIsVisibleOne(true);
        setIsVisibleTwo(false);
      }
    }
  };

  const onChangeSelectPerTwo = (value) => {
    setPercentUsedTwo(value);
    setWarningDiskData({
      ...warningDiskData,
      percentUsedTwo: value
    });
    if (isSwitchOneTurnOn) {
      if (value > warningDiskData?.percentUsedOne) {
        setIsError(false);
        setIsVisibleTwo(false);
        setIsVisibleOne(false);
      } else {
        setIsError(true);
        setIsVisibleTwo(true);
        setIsVisibleOne(false);
      }
    }
  };

  const onChangeSelectHourOne = (value) => {
    setWarningDiskData({
      ...warningDiskData,
      timeOne: value
    });
  };

  const onChangeSelectHourTwo = (value) => {
    setWarningDiskData({
      ...warningDiskData,
      timeTwo: value
    });
  };

  const onChangeRadio = (e) => {
    let autoRemovePerFile = e.target.value ? false : true;
    let autoRemoveFreeSpaceFile = !autoRemovePerFile;
    setWarningDiskData({
      ...warningDiskData,
      autoRemovePerFile: autoRemovePerFile,
      autoRemoveFreeSpaceFile: autoRemoveFreeSpaceFile
    });
  };

  const handleSubmit = async () => {
    let payload = JSON.parse(JSON.stringify(warningDiskData));
    if (isEmpty(payload?.autoRemoveFreeSpaceFile) && isEmpty(payload?.autoRemovePerFile)) {
      payload.autoRemoveFreeSpaceFile = false;
      payload.autoRemovePerFile = true
    }
    console.log('warningDiskData', payload);
    const payloadConverted = {

      autoRemoveFreeSpaceFile: payload?.autoRemoveFreeSpaceFile,
      autoRemovePerFile: payload?.autoRemovePerFile,
      configWarningDisk: {
        percentUsedOne: payload?.percentUsedOne || 0,
        timeOne: payload?.timeOne || 0,
        isActiveOne: payload?.isActiveOne || false,
        percentUsedTwo: payload?.percentUsedTwo || 0,
        timeTwo: payload?.timeTwo || 0,
        isActiveTwo: payload?.isActiveTwo || false,
      }
    };
    console.log('payloadConverted', payloadConverted);

    //post data
    try {
      const isPost = await SettingApi.postDataWarningDisk(payloadConverted);
      if (isPost) {
        const noti = {
          type: NOTYFY_TYPE.success,
          title: 'Thành công',
          description: 'Bạn đã cài đặt thành công'
        };
        Notification(noti);
      } else {
        const noti = {
          type: NOTYFY_TYPE.warning,
          title: 'Thất bại',
          description: 'Đã xảy ra lỗi trong quá trình cài đặt'
        };
        Notification(noti);
      }
    } catch (error) {
      const noti = {
        type: NOTYFY_TYPE.warning,
        title: 'Thất bại',
        description: 'Đã xảy ra lỗi trong quá trình cài đặt'
      };
      Notification(noti);
      console.log(error);
    }
  };

  //create option: hour
  const hourOption = [];
  for (let i = 1; i <= 24; i++) {
    hourOption.push(<Option value={i}>{i}</Option>);
  }

  //create option: percent
  const percentOption = [];
  for (let i = 1; i <= 100; i++) {
    percentOption.push(<Option value={i}>{i}</Option>);
  }

  return (
    <>
      <Card
        title={t('view.storage.storage_threshold_setting')}
        extra={
          <Popconfirm
            title={t('noti.save_change')}
            placement="right"
            disabled={isError}
            onConfirm={handleSubmit}
            className="popconfirm--warning"

          // onConfirm={handleSubmit}
          >
            <Button
              className="btn--save"
              // onClick={handleSubmit}
              disabled={isError}
            >
              {t('view.map.button_save')}
            </Button>
          </Popconfirm>
        }
        headStyle={headStyleCard}
        bodyStyle={bodyStyleCard}
        className="setting__warning"

      >
        <div className="content">
          <div className="content--left">
            <Image width={160} src={warnLogo} preview={false} />
          </div>
          <div className="content--right">
            <p className="content__title">
              {t('view.storage.what_is_sts')}
            </p>
            <p className="content__description">
              {t('view.storage.sts_desc')}
            </p>
          </div>
        </div>
        <div className="setting--warn">
          <div className="warning-store">
            <div className="title">{t('view.storage.level_1')}</div>
            <div>
              <span className="des">{t('view.storage.from')}</span>
              <Tooltip
                title={t('view.storage.greater_than_level_2')}
                visible={isVisibleOne && !props?.callOff ? true : false}
                color={errorColor}
              >
                <Select
                  onChange={onChangeSelectPerOne}
                  value={percentUsedOne}
                  disabled={!isSwitchOneTurnOn}
                  dropdownStyle={dropdownStyle}
                  listHeight={160}
                >
                  {percentOption}
                </Select>
              </Tooltip>
              <span className="des">%</span>
            </div>
          </div>
          <div className="frequence-warning">
            <div className="title">
              {t('view.storage.alarm_frequency')} <br /> ({t('view.storage.time_execution')})
            </div>
            <div style={{ lineHeight: '36px' }}>
              <Select
                onChange={onChangeSelectHourOne}
                value={warningDiskData?.timeOne}
                disabled={!isSwitchOneTurnOn}
                className="test"
              >
                {hourOption}
              </Select>
              <span className="des">{t('view.storage.hour')}</span>
            </div>
            <Tooltip
              title={t('view.storage.not_be_warned')}
              visible={!isSwitchOneTurnOn && !props?.callOff ? true : false}
              color={errorColor}
              className="tooltip--wanring"
            >
              <Switch
                onChange={onChangeSwitchOne}
                checked={warningDiskData?.isActiveOne}
                checkedChildren={<CheckOutlined />}
                unCheckedChildren={<CloseOutlined />}
              />
            </Tooltip>
          </div>
        </div>
        <div className="setting--warn">
          <div className="warning-store">
            <div className="title">
              {t('view.storage.level_2')} <br /> ({t('view.storage.insecurity_level')})
            </div>
            <div>
              <span className="des">{t('view.storage.from')}</span>
              <Tooltip
                title={t('view.storage.smaller_than_level_1')}
                visible={isVisibleTwo && !props?.callOff ? true : false}
                color={errorColor}
              >
                <Select
                  onChange={onChangeSelectPerTwo}
                  value={percentUsedTwo}
                  disabled={!isSwitchTwoTurnOn}
                  dropdownStyle={dropdownStyle}
                  listHeight={100}
                >
                  {percentOption}
                </Select>
              </Tooltip>
              <span className="des">%</span>
            </div>
          </div>
          <div className="frequence-warning">
            <div className="title">
              {t('view.storage.alarm_frequency')} <br /> ({t('view.storage.time_execution')})
            </div>
            <div>
              <Select
                onChange={onChangeSelectHourTwo}
                value={warningDiskData?.timeTwo}
                disabled={!isSwitchTwoTurnOn}
              >
                {hourOption}
              </Select>
              <span className="des">{t('view.storage.hour')}</span>
            </div>
            <Tooltip
              color={errorColor}
              title={t('view.storage.not_be_warned')}
              visible={!isSwitchTwoTurnOn && !props?.callOff ? true : false}
            >
              <Switch
                onChange={onChangeSwitchTwo}
                checked={warningDiskData?.isActiveTwo}
                checkedChildren={<CheckOutlined />}
                unCheckedChildren={<CloseOutlined />}
              />
            </Tooltip>
          </div>
        </div>
        <div className="autoDelete">
          <Radio.Group
            onChange={onChangeRadio}
            value={warningDiskData?.autoRemoveFreeSpaceFile ? 1 : 0}
          >
            <Radio value={0}>{t('view.storage.automatically_95_percent')}</Radio>
            <Radio value={1}>{t('view.storage.automatically_5gb')}</Radio>
          </Radio.Group>
        </div>
      </Card >
      {/* </Tooltip> */}

    </>
  );
};

export default withRouter(WarningStoreSetting);
