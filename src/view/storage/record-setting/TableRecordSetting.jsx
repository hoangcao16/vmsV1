import {
  Button,
  Card,
  Col,
  Form,
  InputNumber,
  message,
  Radio,
  Row,
  Select,
  TimePicker,
  Space
} from 'antd';
import 'antd/dist/antd.css';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import SettingApi from '../../../actions/api/setting/SettingApi';
import './../../commonStyle/commonCard.scss';
import './../../commonStyle/commonDatePicker.scss';
import './../../commonStyle/commonInput.scss';
import './../../commonStyle/commonSelect.scss';
import './styleRecording.scss';
import Breadcrumbs from "../../../components/@vuexy/breadCrumbs/BreadCrumb";
import Notification from "../../../components/vms/notification/Notification";

const { Option } = Select;
const format = 'HH:mm';

const TYPE_RECORD = {
  recordingVideoFullTime: 'RecordingVideoFullTime',
  recordingVideosSchedule: 'RecordingVideosSchedule'
};

const DEFAULT_FORM = {
  recordingVideoFullTime: false,
  recordingVideoSizeSave: 0,
  recordingVideosSchedule: false,
  fromTime: 0,
  toTime: 0,
  days: []
};

const TIME = {
  DAILY: 'DAILY',
  MON: 'MON',
  TUE: 'TUE',
  WED: 'WED',
  THU: 'THU',
  FRI: 'FRI',
  SAT: 'SAT',
  SUN: 'SUN'
};

const optionTime = [
  {
    label: '60 giây',
    value: 60
  },
  {
    label: '80 giây',
    value: 80
  },
  {
    label: '90 giây',
    value: 90
  },
  {
    label: '120 giây',
    value: 120
  },
  {
    label: '150 giây',
    value: 150
  },
  {
    label: '180 giây',
    value: 180
  },
  {
    label: 'Khác',
    value: -1
  }
];

const TableRecordSetting = () => {
  const [form] = Form.useForm();

  const [valueTime, setValueTime] = useState(60);
  const [typeRecording, setTypeRecording] = useState(
    TYPE_RECORD.recordingVideoFullTime
  );
  const [typeTime, setTypeTime] = useState(TIME.DAILY);

  const [recordingVideo, setRecordingVideo] = useState(null);

  useEffect(() => {
    document.title = 'CCTV | Cấu hình Recording';
  }, []);

  useEffect(() => {
    SettingApi.getRecordingVideo().then(async (data) => {
      let convertedData = await convertRecordingVideo(data);
      setRecordingVideo(convertedData);
      setValueTime(convertedData.recordingVideoSizeSave);
      setTypeRecording(
        convertedData.recordingVideoFullTime
          ? TYPE_RECORD.recordingVideoFullTime
          : TYPE_RECORD.recordingVideosSchedule
      );
      setTypeTime(convertedData.days);
      return;
    });
  }, []);

  const onChangeValueTime = (e) => {
    setValueTime(e.target.value);
  };
  const onChangeValueType = (e) => {
    setTypeRecording(e.target.value);
  };

  const handleSubmit = async (value) => {
    const payload = {
      ...value
    };

    const payloadConverted = {
      recordingVideoSizeSave:
        valueTime === -1 ? payload.recordingVideoSizeSaveInput : valueTime,
      recordingVideoFullTime:
        typeRecording === TYPE_RECORD.recordingVideoFullTime ? true : false,
      recordingVideosSchedule:
        typeRecording === TYPE_RECORD.recordingVideosSchedule ? true : false,
      recordingVideoScheduleDto: {
        fromTime: payload.fromTime,
        toTime: payload.toTime,
        days: payload.days
      }
    };

    try {
      const isPost = await SettingApi.postRecordingVideo(payloadConverted);

      if (isPost) {
        message.success('Cài đặt thành công');
      }
    } catch (error) {
      Notification({
        type: 'error',
        title: 'Record setting',
        description: error.toString()
      });
    }

    setTimeout(() => {
      SettingApi.getRecordingVideo().then(async (data) => {
        let convertedData = await convertRecordingVideo(data);
        return setRecordingVideo(convertedData);
      });
    }, 500);
  };

  return (
    <>
      <Breadcrumbs
        breadCrumbTitle="Cấu hình hệ thống"
        breadCrumbParent="Ghi hình"
        breadCrumbActive="Cấu hình"
      />
      <Card type="inner" title="Cấu hình Recording" bordered={false}>
        <Form
          form={form}
          onFinish={handleSubmit}
          initialValues={recordingVideo}
        >
          <p>Chiều dài tối đa video lưu trữ</p>
          <Row gutter={24}>
            <Radio.Group
              options={optionTime}
              onChange={onChangeValueTime}
              value={valueTime}
            ></Radio.Group>
            {valueTime === -1 ? (
              <Form.Item
                name="recordingVideoSizeSaveInput"
                rules={[{ required: valueTime === -1 ?? false }]}
                extra={
                  <span style={{ color: 'red', paddingLeft: '10px' }}>
                    {' '}
                    Tối đa 3000s
                  </span>
                }
              >
                <InputNumber
                  style={{ width: 100, marginLeft: 10 }}
                  max={3000}
                />
              </Form.Item>
            ) : null}
          </Row>

          <p style={{ paddingTop: '20px' }}>Thể loại</p>

          <Radio.Group onChange={onChangeValueType} value={typeRecording}>
            <Space direction="vertical">
              <Radio value="RecordingVideoFullTime">Recording 24/7</Radio>
              <Radio value="RecordingVideosSchedule">
                Recording theo lịch lập
              </Radio>
            </Space>
          </Radio.Group>

          {typeRecording === TYPE_RECORD.recordingVideosSchedule ? (
            <Row gutter={24} style={{ marginTop: '20px' }}>
              <Col
                span={12}
                style={{ display: 'flex', justifyContent: 'flex-start' }}
              >
                <div
                  style={{
                    height: '40px',
                    lineHeight: '40px',
                    paddingRight: '20px'
                  }}
                >
                  Lặp lại
                </div>
                <Form.Item name="days">
                  <Select
                    showSearch
                    style={{ width: 600 }}
                    filterOption={(input, option) =>
                      option.children
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                    }
                    mode="multiple"
                    defaultValue={typeTime}
                  >
                    <Option value={TIME.DAILY}>Hàng ngày</Option>
                    <Option value={TIME.MON}>Mọi thứ 2</Option>
                    <Option value={TIME.TUE}>Mọi thứ 3</Option>
                    <Option value={TIME.WED}>Mọi thứ 4</Option>
                    <Option value={TIME.THU}>Mọi thứ 5</Option>
                    <Option value={TIME.FRI}>Mọi thứ 6</Option>
                    <Option value={TIME.SAT}>Mọi thứ 7</Option>
                    <Option value={TIME.SUN}>Mọi chủ nhật</Option>
                  </Select>
                </Form.Item>
              </Col>

              <Col span={12}>
                <Row gutter={24}>
                  <Col
                    span={6}
                    style={{ display: 'flex', justifyContent: 'space-between' }}
                  >
                    <div
                      style={{
                        height: '40px',
                        lineHeight: '40px',
                        paddingRight: '10px'
                      }}
                    >
                      Từ:
                    </div>
                    <Form.Item name="fromTime">
                      <TimePicker format={format}></TimePicker>
                    </Form.Item>
                  </Col>
                  <Col
                    span={6}
                    style={{ display: 'flex', justifyContent: 'space-between' }}
                  >
                    <div
                      style={{
                        height: '40px',
                        lineHeight: '40px',
                        paddingRight: '10px'
                      }}
                    >
                      Đến:
                    </div>
                    <Form.Item name="toTime">
                      <TimePicker format={format}></TimePicker>
                    </Form.Item>
                  </Col>
                </Row>
              </Col>
            </Row>
          ) : null}
          <Row style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <div
              className="submit"
              style={{
                textAlign: 'center'
              }}
            >
              <Button
                type="primary"
                htmlType="submit"
                style={{
                  backgroundColor: '#7367F0',
                  borderColor: '#7367F0',
                  marginTop: 15,
                  marginBottom: 25,
                  height: 40,
                  borderRadius: 6,
                  width: 120
                }}
              >
                Lưu
              </Button>
            </div>
          </Row>
        </Form>
      </Card>
    </>
  );
};

async function convertRecordingVideo(data) {
  let result;

  result = {
    recordingVideoFullTime:
      data?.recordingVideoFullTime || DEFAULT_FORM.recordingVideoFullTime,
    recordingVideoSizeSaveInput: data?.recordingVideoSizeSave || 0,
    recordingVideoSizeSave:
      ([60, 80, 120, 150, 180].includes(data?.recordingVideoSizeSave)
        ? data?.recordingVideoSizeSave
        : -1) || DEFAULT_FORM.recordingVideoSizeSave,
    recordingVideosSchedule:
      data?.recordingVideosSchedule || DEFAULT_FORM.recordingVideosSchedule,
    fromTime:
      moment(data?.recordingVideoScheduleDto?.fromTime).format('HH:mm') ||
      moment().set('hour', 7).startOf('hour') ||
      moment(DEFAULT_FORM.fromTime),
    toTime:
      moment(data?.recordingVideoScheduleDto?.toTime).format('HH:mm') ||
      moment().set('hour', 7).startOf('hour') ||
      moment(DEFAULT_FORM.toTime),
    days: data?.recordingVideoScheduleDto?.days || DEFAULT_FORM.days
  };

  return result;
}

export default withRouter(TableRecordSetting);
