import { CloseOutlined, PlusOutlined } from "@ant-design/icons";
import {
  Button,
  Col,
  Form,
  Input,
  Modal,
  Popconfirm,
  Row,
  Spin,
  Upload,
  Select,
} from "antd";
import { isEmpty } from "lodash-es";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import AIHumansApi from "../../actions/api/ai-humans/AIHumansApi";
import Notification from "../../components/vms/notification/Notification";
import "./../commonStyle/commonAuto.scss";
import "./../commonStyle/commonForm.scss";
import "./../commonStyle/commonInput.scss";
import "./../commonStyle/commonModal.scss";
import "./../commonStyle/commonSelect.scss";
import Default1Img from "./imagesGuide/1.jpg";
import Default2Img from "./imagesGuide/2.jpg";
import Default3Img from "./imagesGuide/3.jpg";
import Default4Img from "./imagesGuide/4.jpg";
import Default5Img from "./imagesGuide/5.jpg";
// import Default from "./imagesGuide/default.png";
import DepartmentApi from "../../actions/api/department/DepartmentApi";
import AdDivisionApi from "../../actions/api/advision/AdDivision";
import { filterOption, normalizeOptions } from "../common/select/CustomSelect";
import "./ModalEditHumans.scss";
const AI_URL = process.env.REACT_APP_AI_BASE_URL;
const DATA_FAKE_UNIT = {
  departments: [{ name: "", uuid: "" }],
};

const formItemLayout = {
  wrapperCol: { span: 24 },
  labelCol: { span: 24 },
};

const ModalEditHumans = (props) => {
  const { t } = useTranslation();
  let { setShowModal, selectedHumansId, loadList } = props;
  const [fieldData, setFieldData] = useState();
  const [name, setName] = useState("");
  const [form] = Form.useForm();
  const [selectedHumansEdit, setSelectedHumansEdit] = useState(null);
  const [listImages, setlistImages] = useState([]);
  const [imageUrl, setImageUrl] = useState(null);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const [departmentId, setDepartmentId] = useState("");
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

  useEffect(() => {
    let list = [];
    let date = Date.now();
    if (selectedHumansId !== null) {
      getHumansByUuid(selectedHumansId).then(async (data) => {
        setSelectedHumansEdit(data);
        if (data.confidence !== null && data.confidence > 0) {
          setConfidence(Math.round(data.confidence * 100) / 100 + " %");
        } else {
          setConfidence("0 %");
        }

        if (
          data.imagesResp !== null &&
          data.imagesResp !== undefined &&
          data.imagesResp.length !== 0
        ) {
          data.imagesResp.forEach((item) => {
            list.push({
              key: --date,
              payload: item.image,
              uuid: item.uuid,
              name: item.name,
              errorStatus: item.errorStatus,
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
        isUploading: false,
      });
      setlistImages(list);
    }
  }, [selectedHumansId]);

  const handleSubmit = async (value) => {
    let list = [];
    let date = Date.now();
    if (
      listImages !== null &&
      listImages !== undefined &&
      listImages.length !== 0
    ) {
      listImages.forEach((item) => {
        list.push({
          key: --date,
          image: item.payload,
          uuid: item.uuid,
          name: item.name,
          errorStatus: item.errorStatus,
        });
      });
    }
    const payload = {
      ...value,
      images: list,
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
            title: `${t("noti.success")}`,
            description: `${t("noti.successfully_edit_name")} ${name}`,
          };
          setShowModal(false);
          loadList();
          Notification(notifyMess);
        }
      } else {
        let isPost = await AIHumansApi.addHumans(payload);

        if (isPost) {
          const notifyMess = {
            type: "success",
            title: `${t("noti.success")}`,
            description: `${t("noti.successfully_add")} ${name}`,
          };
          Notification(notifyMess);
          loadList();
          setShowModal(false);
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
    if (info.file.status === "done") {
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
          isUploading: false,
        });
      }
      setlistImages(list);
      const listUrl = list
        ? list
            .map((x) => {
              return x.payload;
            })
            .filter((i) => i !== null && i !== undefined && i !== "")
        : null;
      if (listUrl == null || listUrl === undefined || listUrl.length == 0) {
        setImageUrl(undefined);
      } else {
        setImageUrl(listUrl);
      }
    }
    if (info.file.status === "error") {
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
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
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
    const list = listImages
      ? listImages.filter((item) => item.key !== key)
      : [];
    setlistImages(list);
    const listUrl = list
      ? list
          .map((x) => {
            return x.url;
          })
          .filter((i) => i !== null && i !== undefined && i !== "")
      : null;
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

  const uploadButton = (
    <div className="upload__img">
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>{t("view.map.add_image")}</div>
    </div>
  );

  return (
    <>
      <Modal
        title={
          selectedHumansId
            ? `${t("view.common_device.edit")}`
            : `${t("view.camera.add_new")}`
        }
        visible={true}
        // onOk={handleSubmit}
        onCancel={() => {
          setShowModal(false);
        }}
        className="modal__edit--humans"
        footer={null}
        width={960}
      >
        <Form
          className="bg-grey"
          form={form}
          {...formItemLayout}
          onFinish={handleSubmit}
          initialValues={selectedHumansEdit}
        >
          <Row gutter={24}>
            <Col span={6}>
              <Form.Item
                name={["name"]}
                label={t("view.ai_humans.name")}
                maxLength={255}
                rules={[
                  {
                    pattern: new RegExp("([a-zA-Z]{1,30}\\s*)+"),
                  },
                  {
                    max: 255,
                    message: `${t("noti.255_characters_limit")}`,
                  },
                ]}
              >
                <Input placeholder={t("view.ai_humans.name")} />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                name={["code"]}
                label={t("view.ai_humans.code")}
                rules={[
                  {
                    required: true,
                    message: `${t("view.map.required_field")}`,
                    pattern: new RegExp("([a-zA-Z]{1,30}\\s*)+"),
                  },
                  {
                    max: 255,
                    message: `${t("noti.255_characters_limit")}`,
                  },
                ]}
              >
                <Input placeholder={t("view.ai_humans.code")} />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                name={["phone"]}
                label={t("view.ai_humans.phone")}
                rules={[
                  {
                    min: 12,
                    message: `${t("noti.at_least_10_characters")}`,
                  },
                  {
                    max: 22,
                    message: `${t("noti.up_to_20_characters")}`,
                  },
                ]}
              >
                <Input
                  placeholder={t("view.map.please_enter_your_phone_number", {
                    plsEnter: t("please_enter"),
                  })}
                  onKeyDown={(evt) => evt.key === "e" && evt.preventDefault()}
                  type="number"
                />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                name={["email"]}
                label={"Email"}
                rules={[
                  {
                    required: true,
                    message: `${t(
                      "view.user.detail_list.email_address_required"
                    )}`,
                    type: "email",
                  },
                  {
                    max: 255,
                    message: `${t("noti.255_characters_limit")}`,
                  },
                ]}
              >
                <Input placeholder="Email" id="email" autocomplete="off" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={6}>
              <Form.Item
                label={t("view.ai_humans.position")}
                name={["position"]}
                rules={[]}
              >
                <Input placeholder={t("view.ai_humans.position")} />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                name={["departmentUuid"]}
                label={t("view.ai_events.department")}
                rules={[]}
              >
                <Select
                  showSearch
                  dataSource={departments}
                  onChange={(aDUnitId) => onChangeDepId(aDUnitId)}
                  filterOption={filterOption}
                  options={normalizeOptions("name", "uuid", departments)}
                  placeholder={t("view.ai_events.department")}
                  allowClear
                />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                name={["adminUnitUuid"]}
                label={t("view.department.administrative")}
                rules={[]}
              >
                <Select
                  showSearch
                  dataSource={administrativeUnits}
                  onChange={(adminUnitUuid) => onChangeADUnitId(adminUnitUuid)}
                  filterOption={filterOption}
                  options={normalizeOptions(
                    "name",
                    "uuid",
                    administrativeUnits
                  )}
                  placeholder={t("view.department.administrative")}
                  allowClear
                />
              </Form.Item>
            </Col>
          </Row>
          <Row
            style={{ marginTop: 30, color: "#d0e5ff", marginBottom: 30 }}
            gutter={24}
          >
            <Col span={20} style={{ flex: "none" }}>
              {t("view.ai_humans.guide_photo")}
            </Col>
          </Row>

          <Row gutter={24}>
            <Col span={4}>
              <img
                src={Default1Img}
                alt="Default1Img"
                style={{ width: "100%" }}
              />
            </Col>
            <Col span={1}></Col>
            <Col span={4}>
              <img
                src={Default2Img}
                alt="Default1Img"
                style={{ width: "100%" }}
              />
            </Col>
            <Col span={1}></Col>
            <Col span={4}>
              <img
                src={Default3Img}
                alt="Default1Img"
                style={{ width: "100%" }}
              />
            </Col>
            <Col span={1}></Col>
            <Col span={4}>
              <img
                src={Default4Img}
                alt="Default1Img"
                style={{ width: "100%" }}
              />
            </Col>
            <Col span={1}></Col>
            <Col span={4}>
              <img
                src={Default5Img}
                alt="Default1Img"
                style={{ width: "100%" }}
              />
            </Col>
          </Row>

          <Row
            style={{ marginTop: 30, color: "#d0e5ff", marginBottom: 30 }}
            gutter={24}
          >
            <Col span={24} style={{ flex: "none" }}>
              {t("view.ai_humans.img_reach") +
                confidence +
                t("view.ai_humans.quality")}
            </Col>
          </Row>

          <Row gutter={24}>
            <Form.Item className="upload-photo">
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(5, 1fr)",
                }}
              >
                {listImages
                  ? listImages.map((item, index) => (
                      <div
                        // className={props.classImage}
                        className="asdfasd"
                        style={{ width: "90%", paddingBottom: "20px" }}
                      >
                        <Upload
                          style={{ display: "flex" }}
                          accept="image/png, image/jpeg"
                          multiple={false}
                          key={index}
                          action={AI_URL + "/api/v1/humans/upload"}
                          onChange={(e) => {
                            handleChanges(e, item.key);
                          }}
                          showUploadList={false}
                          beforeUpload={(e, l) => {
                            return beforeUploads(e, item.key);
                          }}
                        >
                          <div
                            className="img__item"
                            style={{ position: "relative" }}
                          >
                            {item.payload !== undefined &&
                            item.payload !== null &&
                            item.payload !== "" ? (
                              <Popconfirm
                                title={t("noti.delete_img")}
                                onCancel={(event) => {
                                  event.stopPropagation();
                                }}
                                onConfirm={(event) => {
                                  event.stopPropagation();
                                  onRemoves(item.key);
                                }}
                              >
                                <Button
                                  className="button-photo-remove"
                                  size="small"
                                  type="danger"
                                  onClick={(event) => {
                                    event.stopPropagation();
                                  }}
                                  style={{
                                    position: "absolute",
                                    top: 0,
                                    right: 0,
                                    width: "20px",
                                    height: "20px",
                                    borderRadius: "50%",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    background: "red",
                                    padding: "15px",
                                  }}
                                >
                                  <CloseOutlined style={{}} />
                                </Button>
                              </Popconfirm>
                            ) : null}
                            {item.errorStatus ? (
                              <div
                                className="error"
                                style={{
                                  position: "absolute",
                                  top: "50%",
                                  left: "50%",
                                  transform: "translate(-50%,-50%)",
                                  color: "#ffffff",
                                  padding: "8px 16px",
                                  background: "red",
                                  borderRadius: "4px",
                                }}
                              >
                                {t(
                                  "view.ai_humans.image_error." +
                                    item.errorStatus
                                )}
                              </div>
                            ) : null}
                            {item.payload ? (
                              <img
                                style={{ width: "100%", height: "220px" }}
                                className="cursor-pointer"
                                onClick={(e) => {
                                  onPreview(e, item.payload);
                                }}
                                src={item.payload}
                                alt="Avatar"
                              />
                            ) : (
                              uploadButton
                            )}

                            {item.isUploading ? (
                              <div
                                className="photo-uploading"
                                onClick={(e) => {
                                  e.stopPropagation();
                                }}
                              >
                                <Spin tip={t("view.ai_humans.uploading")} />
                              </div>
                            ) : null}
                          </div>
                        </Upload>
                      </div>
                    ))
                  : null}
              </div>
            </Form.Item>
          </Row>

          <div className="footer__modal">
            <Button
              onClick={() => {
                setShowModal(false);
              }}
            >
              {t("view.map.button_cancel")}
            </Button>
            <Button htmlType="submit">{t("view.map.button_save")}</Button>
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

async function fetchSelectOptions() {
  const data = {
    name: "",
  };
  const departments = await DepartmentApi.getAllDepartment(data);
  return {
    departments,
  };
}

export default ModalEditHumans;
