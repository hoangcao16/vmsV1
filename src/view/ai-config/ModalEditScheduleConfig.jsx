import { Col, Form, Input, Modal, Row, Spin, Button, Select, Upload, Popconfirm, Tooltip, TimePicker } from "antd";
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



const formItemLayout = {
  wrapperCol: { span: 24 },
  labelCol: { span: 24 },
};

const ModalEditScheduleConfig = (props) => {

  const { t } = useTranslation();
  let { setShowModal, selectedHumansId, listTimes, setListTimes } = props;
  const [fieldData, setFieldData] = useState();
  const [name, setName] = useState("");
  const [form] = Form.useForm();
  const [selectedHumansEdit, setSelectedHumansEdit] = useState(null);
  const [listImages, setlistImages] = useState([]);
  const [imageUrl, setImageUrl] = useState(null);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const [confidence, setConfidence] = useState("");
  const [timeDetails, setTimeDetails] = useState([]);


  useEffect(() => {
    console.log(listTimes)
    const timeDetailMonment = []
    listTimes && listTimes.map(item => {
      timeDetailMonment.push({ 
         start : item?.startTime && item.startTime? moment.unix(item.startTime) : null ,
         end : item?.startTime && item.startTime? moment.unix(item.startTime) : null
      })
    })
    setTimeDetails(timeDetailMonment)
    console.log("_________________+_______________")
    console.log(timeDetailMonment[0].start)
  }, [listTimes]);


  const handleSubmit = async (value) => {
    let list = [];
    let date = Date.now();
    if (listImages !== null && listImages !== undefined && listImages.length !== 0) {

      listImages.forEach((item) => {
        list.push({
          key: --date,
          image: item.payload,
          uuid: item.uuid,
          name: item.name,
          errorStatus: item.errorStatus
        });
      });
    }
    const payload = {
      ...value,
      images: list
    };


    try {
      if (selectedHumansEdit !== null) {
        let isEdit = await AIHumansApi.editHumansByUuid(
          selectedHumansId,
          payload
        );

        if (isEdit) {
          const notifyMess = {
            type: "success",
            title: "Thành công",
            description: `Bạn đã sửa thành công tên ${name}`,
          };
          setShowModal(false)
          Notification(notifyMess);
        }

      } else {
        let isPost = await AIHumansApi.addHumans(payload);

        if (isPost) {
          const notifyMess = {
            type: "success",
            title: "Thành công",
            description: `Bạn đã add thành công ${name}`,
          };
          Notification(notifyMess);
          setShowModal(false)
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  if (selectedHumansId !== null) {
    if (isEmpty(selectedHumansEdit)) {
      return <Spin />;
    }
  }

  

  function handleChanges(info, key) {
    if (info.file.status === 'done') {
      const payload = info.file.response.payload;
      let selectIndex = -2;
      const list = listImages.map((item, index) => {
        if (item.key === key) {
          item.payload = payload;
          item.isUploading = false;
          item.name = info.file.name;
          selectIndex = index;
        }
        return item;
      });
      if (selectIndex == list.length - 1) {
        list.push({
          key: Date.now(),
          url: "",
          isUploading: false
        });
      }
      setlistImages(list);
      const listUrl = list ? list.map((x) => {
        return x.payload;
      }).filter(i => i !== null && i !== undefined && i !== "") : null;
      if (listUrl == null || listUrl === undefined || listUrl.length == 0) {
        setImageUrl(undefined);
      } else {
        setImageUrl(listUrl);
      }
    }
    if (info.file.status === 'error') {
      const list = listImages.map((item, index) => {
        if (item.key === key) {
          item.isUploading = false;
        }
        return item;
      });
      setlistImages(list);
    }
  }

  function beforeUploads(file, key) {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    // if (!isJpgOrPng) {
    //   message.error('Chỉ chấp nhận file JPG/PNG file!');
    //   NotificationError("Lỗi", "Lỗi định dạng file.");
    // }
    const list = listImages.map((item, index) => {
      if (item.key === key) {
        item.isUploading = true;
      }
      return item;
    });
    setlistImages(list);
    return isJpgOrPng;
  }

  function onPreview(e, payload) {
    setPreviewImage(payload);
    if (payload == "" || payload === undefined || payload === null) {

    } else {
      e.stopPropagation();
      setPreviewVisible(true);
    }
  }

  function onRemoves(key) {
    const list = listImages ? listImages.filter((item) => item.key !== key) : [];
    setlistImages(list);
    const listUrl = list ? list.map((x) => {
      return x.url;
    }).filter(i => i !== null && i !== undefined && i !== "") : null;
    if (listUrl == null || listUrl === undefined || listUrl.length == 0) {
      setImageUrl(undefined);
    } else {
      setImageUrl(listUrl);
    }
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
        width={540}
      >
        <Form
          className='bg-grey'
          form={form}
          {...formItemLayout}
          onFinish={handleSubmit}
          initialValues={selectedHumansEdit}
        >

          <Row gutter={24}>
            <Col span={8}>
              
              <label className="optionTitle">{t('view.report.date_range')} </label>
            </Col>
            <Col >
              <Row gutter={24}>
                <Form.Item >
                  <TimePicker
                    id="start_time"
                    name="start_time"
                    // value={timeDetails[0].start}
                  />
                </Form.Item>
                <Form.Item >
                  <TimePicker
                    id="end_time"
                    name="end_time"
                    // value={timeDetails[0].end}
                  />
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
                <Form.Item >
                  <TimePicker
                    id="start_time"
                    name="start_time"
                  />
                </Form.Item>
                <Form.Item >
                  <TimePicker
                    id="end_time"
                    name="end_time"
                  />
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
                <Form.Item name={['timeStartDay']}>
                  <TimePicker
                    id="start_time"
                    name="start_time"
                  />
                </Form.Item>
                <Form.Item name={['timeEndDay']}>
                  <TimePicker
                    id="end_time"
                    name="end_time"
                  />
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
                <Form.Item name={['timeStartDay']}>
                  <TimePicker
                    id="start_time"
                    name="start_time"
                  />
                </Form.Item>
                <Form.Item name={['timeEndDay']}>
                  <TimePicker
                    id="end_time"
                    name="end_time"
                  />
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
                <Form.Item name={['timeStartDay']}>
                  <TimePicker
                    id="start_time"
                    name="start_time"
                  />
                </Form.Item>
                <Form.Item name={['timeEndDay']}>
                  <TimePicker
                    id="end_time"
                    name="end_time"
                  />
                </Form.Item>
              </Row>

            </Col>
          </Row>
          <Row gutter={24}>


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

async function getHumansByUuid(selectedHumansId) {
  let dataEdit = await AIHumansApi.getHumansByUuid(selectedHumansId);
  return dataEdit;
}

export default ModalEditScheduleConfig;