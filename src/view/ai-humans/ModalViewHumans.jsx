import { CloseOutlined } from '@ant-design/icons';
import { Button, Col, Form, Input, Modal, Popconfirm, Row, Spin, Upload, Select, Typography, Tag} from "antd";
import { isEmpty } from "lodash-es";
import React, { useEffect, useState } from "react";
import { useTranslation } from 'react-i18next';
import AIHumansApi from '../../actions/api/ai-humans/AIHumansApi';
import Notification from "../../components/vms/notification/Notification";
import "./../commonStyle/commonAuto.scss";
import "./../commonStyle/commonForm.scss";
import "./../commonStyle/commonInput.scss";
import "./../commonStyle/commonModal.scss";
import "./../commonStyle/commonSelect.scss";
import Default1Img from './imagesGuide/1.jpg';
import Default2Img from './imagesGuide/2.jpg';
import Default3Img from './imagesGuide/3.jpg';
import Default4Img from './imagesGuide/4.jpg';
import Default5Img from './imagesGuide/5.jpg';
import Default from './imagesGuide/default.png';
import DepartmentApi from "../../actions/api/department/DepartmentApi";
import AdDivisionApi from "../../actions/api/advision/AdDivision";
import {
  filterOption,
  normalizeOptions,
} from "../common/select/CustomSelect";
import "./ModalViewHumans.scss";
const AI_URL = process.env.REACT_APP_AI_BASE_URL;
const DATA_FAKE_UNIT = {
  departments: [{ name: "", uuid: "" }],
};

const { Paragraph } = Typography;

const formItemLayout = {
  wrapperCol: { span: 24 },
  labelCol: { span: 24 },
};

const ModalViewHumans = (props) => {

  const { t } = useTranslation();
  let { setShowModalView, selectedHumansId, loadList } = props;
  const [fieldData, setFieldData] = useState();
  const [name, setName] = useState("");
  const [form] = Form.useForm();
  const [selectedHuman, setSelectedHuman] = useState(null);
  const [listImages, setlistImages] = useState([]);
  const [imageUrl, setImageUrl] = useState(null);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const [departmentId, setDepartmentId] = useState('');
  const [confidence, setConfidence] = useState("");
  const [departments, setDepartments] = useState([]);
  const [filterOptions, setFilterOptions] = useState(DATA_FAKE_UNIT);
  const [administrativeUnits, setAdministrativeUnits] = useState([]);
  const [adminUnitUuid, setAdminUnitUuid] = useState("");

  useEffect(() => {
    const data = {
      name: "",
    };
    DepartmentApi.getAllDepartment(data).then(setDepartments);
    fetchSelectOptions().then(setFilterOptions);

    AdDivisionApi.getAllAdDivision(data).then(setAdministrativeUnits);
    fetchSelectOptions().then(setFilterOptions);
  }, []);

  const renderTag = (haveImg, confidence) => {
    console.log("renderTag")
    console.log(haveImg)
    let str = "";
    haveImg ? (str = `${t("view.ai_humans.image.have")}` + " (" + confidence + ")") : (str = `${t("view.ai_humans.image.no")}`);
    return (
      <Tag color={haveImg ? "#1380FF" : "#FF4646"} style={{ color: "#ffffff" }}>
        {str}
      </Tag>
    );
  };

  useEffect(() => {
    let list = [];
    let date = Date.now();
    if (selectedHumansId !== null) {
      getHumansByUuid(selectedHumansId).then(async (data) => {
        setSelectedHuman(data);
        
        if (data.confidence !== null && data.confidence > 0) {
          setConfidence(Math.round(data.confidence * 100) / 100 + " %")
        } else {
          setConfidence('0 %')
        }

        if (data.imagesResp !== null && data.imagesResp !== undefined && data.imagesResp.length !== 0) {
          data.imagesResp.forEach((item) => {
            list.push({
              key: --date,
              payload: item.image,
              uuid: item.uuid,
              name: item.name,
              errorStatus: item.errorStatus
            });
          });
        }
        list.push({
          key: --date,
          payload: "",
        });
        setlistImages(list);
      });
    } else {
      list.push({
        key: --date,
        url: "",
        isUploading: false
      });
      setlistImages(list);
    }
  }, [selectedHumansId]);


  if (selectedHuman !== null) {
    if (isEmpty(selectedHuman)) {
      return <Spin />;
    }
  }
  console.log("selectedHuman+++++++++++++++++++++" ,selectedHuman)
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

  const onChangeDepId = async (uuid) => {
    setDepartmentId(uuid);
  };

  const onChangeADUnitId = async (ADUnitId) => {
    setAdminUnitUuid(ADUnitId);
    // form.setFieldsValue({ districtId: null, wardId: null });
  };
  return (
    <>
      <Modal
        title={`${t('view.ai_humans.details')}`}
        visible={true}
        // onOk={handleSubmit}
        onCancel={() => {
          setShowModalView(false);
        }}
        className='modal__view--humans'
        footer={null}
        width={960}
      >
        <Row gutter={24}>
          <Col span={12}>
            <Paragraph className="mt-1">
              <p style={{ fontWeight: 600, fontSize: 14 }}>
                {t('view.ai_humans.name')}
              </p>
              <p>{selectedHuman?.name}</p>
            </Paragraph>
          </Col>

          <Col span={12}>
            <Paragraph className="mt-1">
              <p style={{ fontWeight: 600, fontSize: 14 }}>
                {t('view.ai_humans.code')}
              </p>
              <p>{selectedHuman?.code}</p>
            </Paragraph>
          </Col>
          <Col span={12}>
            <Paragraph className="mt-1">
              <p style={{ fontWeight: 600, fontSize: 14 }}>
                {t('view.ai_humans.phone')}
              </p>
              <p>{selectedHuman?.phone}</p>
            </Paragraph>
          </Col>
          <Col span={12}>
            <Paragraph className="mt-1">
              <p style={{ fontWeight: 600, fontSize: 14 }}>
                Email
              </p>
              <p>{selectedHuman?.email}</p>
            </Paragraph>
          </Col>

          <Col span={12}>
            <Paragraph className="mt-1">
              <p style={{ fontWeight: 600, fontSize: 14 }}>
                {t('view.ai_humans.position')}
              </p>
              <p>{selectedHuman?.position}</p>
            </Paragraph>
          </Col>
          <Col span={12}>
            <Paragraph className="mt-1">
              <p style={{ fontWeight: 600, fontSize: 14 }}>
              {t('view.ai_humans.adminUnit')}
              </p>
              <p>{selectedHuman?.adminUnitName}</p>
            </Paragraph>
          </Col>
          <Col span={12}>
            <Paragraph className="mt-1">
              <p style={{ fontWeight: 600, fontSize: 14 }}>
              {t('view.ai_humans.department')}
              </p>
              <p>{selectedHuman?.departmentName}</p>
            </Paragraph>
          </Col>
          <Col span={12}>
            <Paragraph className="mt-1">
              <p style={{ fontWeight: 600, fontSize: 14 }}>
              {t('view.ai_humans.status')}
              </p>
              <p>{renderTag(selectedHuman?.haveImg, confidence)}</p>
            </Paragraph>
          </Col>
          
          
        </Row>
        <Row style={{ marginTop: 30, color: "#d0e5ff", marginBottom: 30 }} gutter={24}>
          <Col span={24} style={{ flex: 'none' }}></Col>
        </Row>
        <Row gutter={24}>
            <Form.Item className="upload-photo" >
              <div style={{ display: "grid", gridTemplateColumns: 'repeat(5, 1fr)' }}>
                {

                  listImages ? listImages.map((item, index) =>

                    <div
                      // className={props.classImage}
                      className='asdfasd' style={{ width: '90%', paddingBottom: '20px', position: "relative" }}
                    >
                          
                          {item.errorStatus ?
                            <div className="error" style={{
                              position: 'absolute',
                              top: '50%',
                              left: '50%',
                              transform: 'translate(-50%,-50%)',
                              color: '#ffffff',
                              padding: '8px 16px',
                              background: 'red',
                              borderRadius: '4px'
                            }}

                            >{t('view.ai_humans.image_error.' + item.errorStatus)}</div> : null
                          }


                          <img style={{ width: '100%', height: "220px" }} className="cursor-pointer" onClick={(e) => { onPreview(e, item.payload) }} src={item.payload ? item.payload : Default} alt="Avatar" />


                          {item.isUploading ?
                            <div className="photo-uploading" onClick={(e) => {
                              e.stopPropagation();
                            }}>
                              <Spin tip="Đang tải lên ..." />
                            </div> : null
                          }
                        </div>

                  ) : null

                }
              </div>
            </Form.Item>
          </Row>
        
      </Modal>
    </>
  );
};

async function getHumansByUuid(selectedHumansId) {
  let dataEdit = await AIHumansApi.getHumansByUuid(selectedHumansId);
  return dataEdit;
}

async function fetchSelectOptions() {
  const data = {
    name: "",
  };
  const departments = await DepartmentApi.getAllDepartment(data);
  return {
    departments,
  };
}

export default ModalViewHumans;
