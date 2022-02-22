import { Button, Form, Modal, Table, AutoComplete } from "antd";
import {
  SearchOutlined,
} from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import { useTranslation } from 'react-i18next';
import AIConfigScheduleApi from "../../actions/api/ai-config/AIConfigScheduleApi";
import CameraApi from "../../actions/api/camera/CameraApi";
import Notification from "../../components/vms/notification/Notification";
import debounce from "lodash/debounce";
import "./../commonStyle/commonAuto.scss";
import "./../commonStyle/commonDatePicker.scss";
import "./../commonStyle/commonForm.scss";
import "./../commonStyle/commonInput.scss";
import "./../commonStyle/commonModal.scss";
import "./../commonStyle/commonSelect.scss";
import './../commonStyle/commonTable.scss';
import "./../commonStyle/commonTimePicker.scss";
import "./ModalScheduleConfigCopy.scss";
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
  const [pageSize, setPageSize] = useState(100);
  const [listCameras, setListCameras] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [select, setSelect] = useState({
    selectedRowKeys: [],
    loading: false,
  });


  useEffect(() => {
    const data = {
      page: page,
      size: pageSize
    };
    CameraApi.getAllCamera(data).then((result) => {
      setListCameras(result);
    });
  }, []);

  const columns = [{
    dataIndex: 'name',
  },
  {
    className: "action-1",
    title: () => {
      return (
        <div style={{ textAlign: "center" }}>
          <AutoComplete
            className="searchInputCamproxy"
            style={{ width: 250, height: 40, marginRight: 18 }}
            onSearch={debounce(handleSearch, 300)}
            placeholder={
              <div>
                <span> &nbsp;{t("view.map.search")} </span>{" "}
                <SearchOutlined style={{ fontSize: 22 }} />
              </div>
            }
          ></AutoComplete>
        </div>
      );
    },
    
  },];
  const onSelectChange = (selectedRowKeys) => {
    setSelectedRowKeys(selectedRowKeys);
  };

  const handleSearch = async (value) => {
    const data = {
      page: page,
      size: pageSize,
      name: value,
    };
    CameraApi.getAllCamera(data).then((result) => {
      setListCameras(result);
    });

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
          description: `${t('noti.copy_successful')}`,
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
          
            <Button onClick={() => { setShowModalCopy(false) }}>{t('view.ai_config.cancel')}</Button>
            <Button disabled={!(selectedRowKeys.length > 0)} htmlType="submit">{t('view.ai_config.apply')}</Button>
          </div>
        </Form>
      </Modal>
    </>
  );
};


export default ModalScheduleConfigCopy;