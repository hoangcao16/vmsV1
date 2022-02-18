import { Button, Checkbox, Col, Form, Modal, Row, Spin, TimePicker } from "antd";
import { isEmpty } from "lodash-es";
import moment from 'moment';
import React, { useEffect, useState } from "react";
import { useTranslation } from 'react-i18next';
import "./../commonStyle/commonAuto.scss";
import "./../commonStyle/commonDatePicker.scss";
import "./../commonStyle/commonForm.scss";
import "./../commonStyle/commonInput.scss";
import "./../commonStyle/commonModal.scss";
import "./../commonStyle/commonSelect.scss";
import "./../commonStyle/commonTimePicker.scss";
import "./ModalEditScheduleConfig.scss";
const AI_URL = process.env.REACT_APP_AI_BASE_URL;

const format = 'HH:mm';

const formItemLayout = {
  wrapperCol: { span: 24 },
  labelCol: { span: 24 },
};

const ModalEditScheduleConfig = (props) => {

  const { t } = useTranslation();
  let { setShowModal, listTimes, handleCreateTimeConfig } = props;
  const [fieldData, setFieldData] = useState();
  const [name, setName] = useState("");
  const [form] = Form.useForm();
  const [listImages, setlistImages] = useState([]);
  const [timeDetails, setTimeDetails] = useState(null)
  const [checkAll, setCheckAll] = useState(false);


  useEffect(() => {
    const detail = {}
    let i = 1;

    listTimes && listTimes.map(item => {
      const start = item.startTime * 1000
      const end = item.endTime * 1000
      const startTime = item.startTime ? moment().set('hour', moment(start).get('hour')).startOf('hour')
        .set('minute', moment(start).get('minute')).startOf('minute').set('second', moment(start).get('second'))
        .startOf('second') : "";
      detail['start_' + i] = startTime
      const endTime = item.endTime ? moment().set('hour', moment(end).get('hour')).startOf('hour')
        .set('minute', moment(end).get('minute')).startOf('minute')
        .set('second', moment(end).get('second')).startOf('second') : "";
      detail['end_' + i] = endTime
      i++
    })

    setTimeDetails(detail)
  }, [listTimes]);


  const handleSubmit = async (value) => {
    value.checkAll = checkAll
    handleCreateTimeConfig(value)

  };

  const checkTime = async (value) => {
    console.log("time")
    console.log(value)
    console.log(timeDetails['end_1'])

  };

  function onChangeCheckBox(val) {
    setCheckAll(val.target.checked)

  }


  if (isEmpty(timeDetails)) {

    console.log('=================>timeDetails')
    return <Spin />
  }

  return (
    <>
      <Modal
        title={t('view.ai_config.time_config')}
        visible={true}
        // onOk={handleSubmit}
        onCancel={() => {
          setShowModal(false)
        }}
        className='modal__edit--schedule_config'
        footer={null}
        width={624}
      >
        <Form
          className='bg-grey'
          form={form}
          {...formItemLayout}
          onFinish={handleSubmit}
          initialValues={timeDetails}
        >


          <Row gutter={24} className="row_time">
            <Col span={8}>
              <label className="optionTitleTime">{t('view.report.date_range')} </label>
            </Col>
            <Col span={8}>
              <Form.Item name={['start_1']}
                rules={[
                  ({ getFieldValue }) => ({
                    validator(rule, start) {
                      const end = getFieldValue(["end_1"]);
                      if (start > end) {
                        return Promise.reject(`${t("view.ai_config.time_error_stat_end")}`);
                      } else {
                        return Promise.resolve();
                      }
                    },
                  }),
                ]}>
                <TimePicker placeholder={t("view.ai_config.select_time")}></TimePicker>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name={['end_1']}
                rules={[
                  ({ getFieldValue }) => ({
                    validator(rule, end) {
                      const start = getFieldValue(["start_1"]);
                      if (start > end) {
                        return Promise.reject(`${t("view.ai_config.time_error_stat_end")}`);
                      } else {
                        return Promise.resolve();
                      }
                    },
                  }),
                ]}>
                <TimePicker placeholder={t("view.ai_config.select_time")}></TimePicker>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={24} className="row_time">
            <Col span={8}>
              <label className="optionTitleTime">{t('view.report.date_range')} </label>
            </Col>
            <Col span={8}>
              <Form.Item name={['start_2']}
                rules={[
                  ({ getFieldValue }) => ({
                    validator(rule, start) {
                      const end = getFieldValue(["end_2"]);
                      if (start > end) {
                        return Promise.reject(`${t("view.ai_config.time_error_stat_end")}`);
                      } else {
                        return Promise.resolve();
                      }
                    },
                  }),
                ]}>
                <TimePicker placeholder={t("view.ai_config.select_time")}></TimePicker>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name={['end_2']}
                rules={[
                  ({ getFieldValue }) => ({
                    validator(rule, end) {
                      const start = getFieldValue(["start_2"]);
                      if (start > end) {
                        return Promise.reject(`${t("view.ai_config.time_error_stat_end")}`);
                      } else {
                        return Promise.resolve();
                      }
                    },
                  }),
                ]}>
                <TimePicker placeholder={t("view.ai_config.select_time")}></TimePicker>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={24} className="row_time">
            <Col span={8}>
              <label className="optionTitleTime">{t('view.report.date_range')} </label>
            </Col>
            <Col span={8}>
              <Form.Item name={['start_3']}
                rules={[
                  ({ getFieldValue }) => ({
                    validator(rule, start) {
                      const end = getFieldValue(["end_3"]);
                      if (start > end) {
                        return Promise.reject(`${t("view.ai_config.time_error_stat_end")}`);
                      } else {
                        return Promise.resolve();
                      }
                    },
                  }),
                ]}>
                <TimePicker placeholder={t("view.ai_config.select_time")}></TimePicker>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name={['end_3']}
                rules={[
                  ({ getFieldValue }) => ({
                    validator(rule, end) {
                      const start = getFieldValue(["start_3"]);
                      if (start > end) {
                        return Promise.reject(`${t("view.ai_config.time_error_stat_end")}`);
                      } else {
                        return Promise.resolve();
                      }
                    },
                  }),
                ]}>
                <TimePicker placeholder={t("view.ai_config.select_time")}></TimePicker>
              </Form.Item>
            </Col>

          </Row>
          <Row gutter={24} className="row_time">
            <Col span={8}>
              <label className="optionTitleTime">{t('view.report.date_range')} </label>
            </Col>
            <Col span={8}>
              <Form.Item name={['start_4']}
                rules={[
                  ({ getFieldValue }) => ({
                    validator(rule, start) {
                      const end = getFieldValue(["end_4"]);
                      if (start > end) {
                        return Promise.reject(`${t("view.ai_config.time_error_stat_end")}`);
                      } else {
                        return Promise.resolve();
                      }
                    },
                  }),
                ]}>
                <TimePicker placeholder={t("view.ai_config.select_time")}></TimePicker>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name={['end_4']}
                rules={[
                  ({ getFieldValue }) => ({
                    validator(rule, end) {
                      const start = getFieldValue(["start_4"]);
                      if (start > end) {
                        return Promise.reject(`${t("view.ai_config.time_error_stat_end")}`);
                      } else {
                        return Promise.resolve();
                      }
                    },
                  }),
                ]}>
                <TimePicker placeholder={t("view.ai_config.select_time")}></TimePicker>
              </Form.Item>
            </Col>
            <Col >
            </Col>
          </Row>
          <Row gutter={24} className="row_time">
            <Col span={8}>
              <label className="optionTitleTime">{t('view.report.date_range')} </label>
            </Col>
            <Col span={8}>
              <Form.Item name={['start_5']}
                rules={[
                  ({ getFieldValue }) => ({
                    validator(rule, start) {
                      const end = getFieldValue(["end_5"]);
                      if (start > end) {
                        return Promise.reject(`${t("view.ai_config.time_error_stat_end")}`);
                      } else {
                        return Promise.resolve();
                      }
                    },
                  }),
                ]}>
                <TimePicker placeholder={t("view.ai_config.select_time")}></TimePicker>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name={['end_5']}
                rules={[
                  ({ getFieldValue }) => ({
                    validator(rule, end) {
                      const start = getFieldValue(["start_5"]);
                      if (start > end) {
                        return Promise.reject(`${t("view.ai_config.time_error_stat_end")}`);
                      } else {
                        return Promise.resolve();
                      }
                    },
                  }),
                ]}>
                <TimePicker placeholder={t("view.ai_config.select_time")}></TimePicker>
              </Form.Item>
            </Col>
            <Col >
            </Col>
          </Row>
          <Row gutter={24} >
            <Form.Item name={['all_day']}>
              <Checkbox
                checked={checkAll}
                color="primary"
                onChange={onChangeCheckBox}
              >{t('view.ai_config.all_day')}</Checkbox>
            </Form.Item>
          </Row>

          <div className="footer__modal">
            <Button onClick={() => { setShowModal(false) }}>{t('view.ai_config.cancel')}</Button>
            <Button htmlType="submit">{t('view.ai_config.save')}</Button>

          </div>
        </Form>
      </Modal>
    </>
  );
};

export default ModalEditScheduleConfig;