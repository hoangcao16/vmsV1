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

const ModalScheduleConfigCopy = (props) => {

  const { t } = useTranslation();
  let { setShowModalCopy, handleSubmit } = props;
  const [fieldData, setFieldData] = useState();
  const [name, setName] = useState("");
  const [form] = Form.useForm();
  const [listImages, setlistImages] = useState([]);
  const [timeDetails, setTimeDetails] = useState(null)
  const [checkAll, setCheckAll] = useState(false);




  return (
    <>
      <Modal
        title={t('view.ai_config.time_config')}
        visible={true}
        // onOk={handleSubmit}
        onCancel={() => {
          setShowModalCopy(false)
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

          
          {/* <Row gutter={24}>
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
          </Row> */}

          <div className="footer__modal">
            <Button onClick={() => { setShowModalCopy(false) }}>Đóng</Button>
            <Button htmlType="submit">Lưu</Button>

          </div>
        </Form>
      </Modal>
    </>
  );
};

async function getHumansByUuid(selectedHumansId) {
  let dataEdit = await AIHumansApi.getHumansByUuid(selectedHumansId);
  return dataEdit;
}

export default ModalScheduleConfigCopy;