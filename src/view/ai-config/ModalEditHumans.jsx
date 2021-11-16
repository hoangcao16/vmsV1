import { Col, Form, Input, Modal, Row, Spin, Button, Select, Upload, Popconfirm, Tooltip } from "antd";
import { isEmpty } from "lodash-es";
import React, { useEffect, useState } from "react";
import CameraApi from "../../actions/api/camera/CameraApi";
import VendorApi from "../../actions/api/vendor/VendorApi";
import FieldApi from "../../actions/api/field/FieldApi";
import Event from "../../actions/api/event/EventApi";
import Notification from "../../components/vms/notification/Notification";
import "./../commonStyle/commonAuto.scss";
import "./../commonStyle/commonForm.scss";
import "./../commonStyle/commonInput.scss";
import "./../commonStyle/commonModal.scss";
import "./../commonStyle/commonSelect.scss";
import "./ModalEditHumans.scss";
import { useTranslation } from 'react-i18next';
import AIHumansApi from '../../actions/api/ai-humans/AIHumansApi';
import Default1Img from './imagesGuide/1.jpg';
import Default2Img from './imagesGuide/2.jpg';
import Default3Img from './imagesGuide/3.jpg';
import Default4Img from './imagesGuide/4.jpg';
import Default5Img from './imagesGuide/5.jpg';
import Default from './imagesGuide/default.png';
import { PlusOutlined, DeleteOutlined, CloseOutlined } from '@ant-design/icons';
const AI_URL = process.env.REACT_APP_AI_BASE_URL;


const formItemLayout = {
  wrapperCol: { span: 24 },
  labelCol: { span: 24 },
};

const ModalEditHumans = (props) => {

  const { t } = useTranslation();
  let { setShowModal, selectedHumansId } = props;
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



  useEffect(() => {
    let list = [];
    let date = Date.now();
    if (selectedHumansId !== null) {
      getHumansByUuid(selectedHumansId).then(async (data) => {
        setSelectedHumansEdit(data);
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
        title={selectedHumansId ? 'Sửa' : 'Thêm mới'}
        visible={true}
        // onOk={handleSubmit}
        onCancel={() => {
          setShowModal(false)
        }}
        className='modal__edit--humans'
        footer={null}
        width={960}
      >
        <Form
          className='bg-grey'
          form={form}
          {...formItemLayout}
          onFinish={handleSubmit}
          initialValues={selectedHumansEdit}
        >

          <Row gutter={24}>
            <Col span={6}>
              <Form.Item
                name={["name"]}
                label={["Họ và tên"]}
                rules={[
                  {
                    required: true,
                    message: "Trường này bắt buộc",
                    pattern: new RegExp("([a-zA-Z]{1,30}\\s*)+"),
                  },
                ]}
              >
                <Input placeholder="Họ và tên" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                name={["code"]}
                label={["Mã nhân viên"]}
                rules={[
                  {
                    required: true,
                    message: "Trường này bắt buộc",
                    pattern: new RegExp("([a-zA-Z]{1,30}\\s*)+"),
                  },
                ]}
              >
                <Input placeholder="Mã nhân viên" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                name={['phone']}
                label={["Số điện thoại"]}
                rules={[
                  {
                    required: true,
                    // message: `${t('view.map.required_field')}`,
                    max: 12
                  }
                ]}
              >
                <Input
                  placeholder={t('view.map.please_enter_your_phone_number', { plsEnter: t('please_enter') })}
                  onKeyDown={(evt) => evt.key === "e" && evt.preventDefault()}
                  type='number' />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                label={["Email"]}
                name={['email']}
                rules={[
                  {
                    required: true,
                    // message: `${t('view.map.required_field')}`,
                  }
                ]}
              >
                <Input
                  type="email"
                  id="email"
                  placeholder="Email"
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={6}>
              <Form.Item
                label={"Vị trí"}
                name={["position"]}
                rules={[
                ]}
              >
                <Input placeholder="Chức vụ" />
              </Form.Item>
            </Col>
            {/* <Col span={6}>
              <Form.Item
                name={['provinceId']}
                label={t('view.map.province_id')}
                rules={[{ required: true, message: `${t('view.map.required_field')}` }]}
              >
                <Select
                  showSearch
                  dataSource={provinces}
                  onChange={(cityId) => onChangeCity(cityId)}
                  filterOption={filterOption}
                  options={normalizeOptions('name', 'provinceId', provinces)}
                  placeholder={t('view.map.province_id')}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name={['provinceId']}
                label={t('view.map.province_id')}
                rules={[{ required: true, message: `${t('view.map.required_field')}` }]}
              >
                <Select
                  showSearch
                  dataSource={provinces}
                  onChange={(cityId) => onChangeCity(cityId)}
                  filterOption={filterOption}
                  options={normalizeOptions('name', 'provinceId', provinces)}
                  placeholder={t('view.map.province_id')}
                />
              </Form.Item>
            </Col> */}

          </Row>
          <Row style={{ marginTop: 30, color: "#d0e5ff", marginBottom: 30 }} gutter={24}>
            <Col span={20} style={{ flex: 'none'}}>{'Ảnh mẫu hướng dẫn'}</Col>
          </Row>

          <Row gutter={24}>
            <Col span={4}><img src={Default1Img} alt="Default1Img" style={{ width: "100%" }} /></Col>
            <Col span={1}></Col>
            <Col span={4}><img src={Default2Img} alt="Default1Img" style={{ width: "100%" }} /></Col>
            <Col span={1}></Col>
            <Col span={4}><img src={Default3Img} alt="Default1Img" style={{ width: "100%" }} /></Col>
            <Col span={1}></Col>
            <Col span={4}><img src={Default4Img} alt="Default1Img" style={{ width: "100%" }} /></Col>
            <Col span={1}></Col>
            <Col span={4}><img src={Default5Img} alt="Default1Img" style={{ width: "100%" }} /></Col>
          </Row>


          <Row style={{ marginTop: 30, color: "#d0e5ff", marginBottom: 30 }} gutter={24}>
            <Col span={24} style={{ flex: 'none'}}>{'Ảnh nhận diện. Tỉ lệ chất lượng ảnh: ' + confidence + '. Cần thêm ảnh: ' }</Col>
          </Row>

          <Row gutter={24}>
            {/* <Form.Item
              name={["listImages"]}
            >
              <Input hidden />
            </Form.Item> */}
            <Form.Item className="upload-photo" >
              <div style={{ display: "grid", gridTemplateColumns: 'repeat(5, 1fr)' }}>
                {

                  listImages ? listImages.map((item, index) =>

                    <div
                      // className={props.classImage}
                      className='asdfasd' style={{ width: '90%', paddingBottom: '20px' }}
                    >
                      <Upload
                        style={{ display: "flex" }}
                        accept="image/png, image/jpeg"
                        multiple={false}
                        key={index}
                        action={AI_URL + '/api/v1/humans/upload'}
                        onChange={(e) => { handleChanges(e, item.key) }}
                        showUploadList={false}
                        beforeUpload={(e, l) => { return beforeUploads(e, item.key); }}>
                        <div className='img__item' style={{ position: "relative" }}>
                          {
                            item.payload !== undefined && item.payload !== null && item.payload !== "" ?

                              <Popconfirm title="Chắc chắn để xóa?"
                                onCancel={event => {
                                  event.stopPropagation();
                                }}
                                onConfirm={(event) => { event.stopPropagation(); onRemoves(item.key); }}>
                                <Button className="button-photo-remove" size="small" type="danger"
                                  onClick={event => {
                                    event.stopPropagation();
                                  }}
                                  style={{
                                    position: 'absolute',
                                    top: 0,
                                    right: 0,
                                    width: '20px',
                                    height: '20px',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    background: 'red',
                                    padding: '15px'
                                  }}
                                >
                                  <CloseOutlined style={{}} />
                                </Button>
                              </Popconfirm> : null

                          }
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
  
                            >{item.errorStatus}</div> : null
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


                      </Upload>

                    </div>
                  ) : null

                }
              </div>
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

async function getHumansByUuid(selectedHumansId) {
  let dataEdit = await AIHumansApi.getHumansByUuid(selectedHumansId);
  return dataEdit;
}

export default ModalEditHumans;
