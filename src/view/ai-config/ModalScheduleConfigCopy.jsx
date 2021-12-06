import { Col, Form, Input, Modal, Row, Spin, Button, Checkbox, TimePicker, Table } from "antd";
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
import './../commonStyle/commonTable.scss';
import "./../commonStyle/commonDatePicker.scss";
import "./../commonStyle/commonTimePicker.scss";
import "./ModalScheduleConfigCopy.scss";
import { useTranslation } from 'react-i18next';
import AIHumansApi from '../../actions/api/ai-humans/AIHumansApi';
import { PlusOutlined, DeleteOutlined, CloseOutlined } from '@ant-design/icons';
import AIConfigScheduleApi from "../../actions/api/ai-config/AIConfigScheduleApi";
const AI_URL = process.env.REACT_APP_AI_BASE_URL;

const format = 'HH:mm';

const formItemLayout = {
  wrapperCol: { span: 24 },
  labelCol: { span: 24 },
};

const ModalScheduleConfigCopy = (props) => {

  const { t } = useTranslation();
  let { setShowModalCopy, cameraUuid, type } = props;
  const [fieldData, setFieldData] = useState();
  const [name, setName] = useState("");
  const [form] = Form.useForm();
  const [listImages, setlistImages] = useState([]);
  const [timeDetails, setTimeDetails] = useState(null)
  const [checkAll, setCheckAll] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [listCameras, setListCameras] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [select, setSelect] = useState({
    selectedRowKeys: [],
    loading: false,
  });

  

  useEffect(() => {
    
    const data = {
      page: page,
      pageSize: pageSize
    };
    CameraApi.getAllCamera(data).then((result) => {
      setListCameras(result);
    });
  }, []);

  const columns = [{
    dataIndex: 'name',
  }];
  const onSelectChange = (selectedRowKeys) => {
    setSelectedRowKeys(selectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange
  };

  const handleSubmit = async () => {
    const payload = {
      cameraUuids: selectedRowKeys,
      type: type
    };
    try {
      let isPost = await AIConfigScheduleApi.copyConfigSchedule(cameraUuid, payload);

      if (isPost) {
        const notifyMess = {
          type: "success",
          title: `${t('noti.success')}`,
          description: `Bạn đã copy thành công`,
        };
        Notification(notifyMess);
        setShowModalCopy(false)
      }
    } catch (error) {
      console.log(error);
    }

  };


  return (
    <>
      <Modal
        title={t('view.ai_config.time_config_copy')}
        visible={true}
        // onOk={handleSubmit}
        onCancel={() => {
          setShowModalCopy(false)
        }}
        className='modal__edit--schedule_config_copy'
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

          
          <Table className="table__hard--cam" 
          rowSelection={rowSelection} 
          columns={columns} 
          rowKey="uuid"
          dataSource={listCameras} />

          <div className="footer__modal">
            <Button onClick={() => { setShowModalCopy(false) }}>Đóng</Button>
            <Button htmlType="submit">Lưu</Button>

          </div>
        </Form>
      </Modal>
    </>
  );
};


export default ModalScheduleConfigCopy;