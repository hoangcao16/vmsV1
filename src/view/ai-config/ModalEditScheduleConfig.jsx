import { Col, Form, Input, Modal, Row, Spin, Button, Checkbox, TimePicker } from "antd";
import { isEmpty } from "lodash-es";
import React, { useEffect, useState } from "react";
import CameraApi from "../../actions/api/camera/CameraApi";
import VendorApi from "../../actions/api/vendor/VendorApi";
import FieldApi from "../../actions/api/field/FieldApi";
import Event from "../../actions/api/event/EventApi";
import moment from 'moment';
import Notification from "../../components/vms/notification/Notification";
import "./../commonStyle/commonAuto.scss";
import "./../commonStyle/commonForm.scss";
import "./../commonStyle/commonInput.scss";
import "./../commonStyle/commonModal.scss";
import "./../commonStyle/commonSelect.scss";
import "./../commonStyle/commonDatePicker.scss";
import "./../commonStyle/commonTimePicker.scss";
import "./ModalEditScheduleConfig.scss";
import { useTranslation } from 'react-i18next';
import AIHumansApi from '../../actions/api/ai-humans/AIHumansApi';
import { PlusOutlined, DeleteOutlined, CloseOutlined } from '@ant-design/icons';
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

          
          <Row gutter={24}>
            <Col span={8}>
              <label className="optionTitle">{t('view.report.date_range')} </label>
            </Col>
            <Col >
              <Row gutter={24}>
                <Form.Item name={['start_1']}>
                  <TimePicker ></TimePicker>
                </Form.Item>
                <Form.Item name={['end_1']}>
                  <TimePicker ></TimePicker>
                </Form.Item>
              </Row>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={8}>
              <label className="optionTitle">{t('view.report.date_range')} </label>
            </Col>
            <Col >
              <Row gutter={24}>
                <Form.Item name={['start_2']}>
                  <TimePicker ></TimePicker>
                </Form.Item>
                <Form.Item name={['end_2']}>
                  <TimePicker ></TimePicker>
                </Form.Item>
              </Row>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={8}>
              <label className="optionTitle">{t('view.report.date_range')} </label>
            </Col>
            <Col >
              <Row gutter={24}>
                <Form.Item name={['start_3']}>
                  <TimePicker ></TimePicker>
                </Form.Item>
                <Form.Item name={['end_3']}>
                  <TimePicker ></TimePicker>
                </Form.Item>
              </Row>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={8}>
              <label className="optionTitle">{t('view.report.date_range')} </label>
            </Col>
            <Col >
              <Row gutter={24}>
                <Form.Item name={['start_4']}>
                  <TimePicker ></TimePicker>
                </Form.Item>
                <Form.Item name={['end_4']}>
                  <TimePicker ></TimePicker>
                </Form.Item>
              </Row>
            </Col>
          </Row>
          <Row gutter={24} className="bg-grey">
              <Form.Item name={['all_day']}>
                <Checkbox
                  checked={checkAll}
                  color="primary"
                  onChange={onChangeCheckBox}
                >{t('view.ai_config.all_day')}</Checkbox>
              </Form.Item>
          </Row>

          <div className="footer__modal">
            <Button onClick={() => { setShowModal(false) }}>Đóng</Button>
            <Button htmlType="submit">Lưu</Button>

          </div>
        </Form>
      </Modal>
    </>
  );
};

export default ModalEditScheduleConfig;