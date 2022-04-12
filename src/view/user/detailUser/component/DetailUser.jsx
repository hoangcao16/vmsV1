import {
  ArrowLeftOutlined,
  CheckOutlined,
  CloseOutlined,
  LoadingOutlined,
  PlusOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Button,
  Card,
  Collapse,
  DatePicker,
  Form,
  Input,
  Select,
  Tooltip,
  Typography,
  Upload,
} from "antd";
import { isEmpty } from "lodash-es";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { reactLocalStorage } from "reactjs-localstorage";
import { v4 as uuidV4 } from "uuid";
import ExportEventFileApi from "../../../../actions/api/exporteventfile/ExportEventFileApi";
import UserApi from "../../../../actions/api/user/UserApi";
import permissionCheck from "../../../../actions/function/MyUltil/PermissionCheck";
import Notification from "../../../../components/vms/notification/Notification";
import { changeAvatar } from "../../../../redux/actions/customizer/index";
import { NOTYFY_TYPE } from "../../../common/vms/Constant";
import Camera from "./Camera";
import CameraGroup from "./CameraGroup";
import "./DetailUser.scss";
import GroupUser from "./GroupUser";
import RoleUser from "./RoleUser";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";

const { Panel } = Collapse;
const { Option } = Select;
const { Text } = Typography;

const DetailUser = (props) => {
  const { t } = useTranslation();
  let { userUuid } = useParams();

  if (!userUuid) {
    userUuid = reactLocalStorage.getObject("user")?.userUuid;
  }
  const [form] = Form.useForm();
  const [value, setValue] = useState();
  const [userDetail, setUserDetail] = useState({});
  const [isLoading, setLoading] = useState(false);
  const [reload, setReload] = useState(false);
  const [reloadCameraPage, setReloadCameraPage] = useState(false);
  const history = useHistory();
  const [avatarUrl, setAvatarUrl] = useState("");

  const language = reactLocalStorage.get("language");
  useEffect(() => {
    if (
      language === "vn"
        ? (document.title = "CCTV | Thông tin cá nhân")
        : (document.title = "CCTV | Information")
    );
  }, [t]);

  const [open, setOpen] = useState(null);

  const handleClose = () => {
    setOpen("0");
  };

  useEffect(() => {
    UserApi.getDetailUser({ uuid: userUuid }).then(setUserDetail);
  }, [isLoading]);

  useEffect(() => {
    UserApi.getDetailUser({ uuid: userUuid }).then(setUserDetail);
  }, []);

  useEffect(() => {
    if (userDetail?.avatar_file_name) {
      loadAvatarHandler(userDetail?.avatar_file_name).then();
    }
  }, [userDetail]);

  function getBase64(img, callback) {
    const reader = new FileReader();
    reader.addEventListener("load", () => callback(reader.result));
    reader.readAsDataURL(img);
  }

  const loadAvatarHandler = async (avatarFileName) => {
    if (avatarFileName !== "" && avatarUrl === "") {
      await ExportEventFileApi.getAvatar(avatarFileName).then((result) => {
        if (result.data) {
          let blob = new Blob([result.data], { type: "octet/stream" });
          let url = window.URL.createObjectURL(blob);
          setAvatarUrl(url);
        } else {
          setAvatarUrl("");
        }
      });
    }
  };

  const uploadButton = (
    <div>
      {isLoading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>{t("view.map.add_image")}</div>
    </div>
  );

  function beforeUpload(file) {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      const notifyMess = {
        type: "error",
        title: "",
        description: `${t("noti.upload_file_desc")}`,
      };
      Notification(notifyMess);
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      const notifyMess = {
        type: "error",
        title: "",
        description: `${t("noti.size_file_desc")}`,
      };
      Notification(notifyMess);
    }
    return isJpgOrPng && isLt2M;
  }

  const handleChange = (info) => {
    if (info.file.status === "uploading") {
      setLoading(true);
    }
  };

  const uploadImage = async (options) => {
    const { file } = options;
    await ExportEventFileApi.uploadAvatar(uuidV4(), file).then((result) => {
      if (
        result.data &&
        result.data.payload &&
        result.data.payload.fileUploadInfoList.length > 0
      ) {
        getBase64(file, (imageUrl) => {
          setLoading(false);
          setAvatarUrl(imageUrl);
          let fileName = result.data.payload.fileUploadInfoList[0].name;
          onHandleData({ avatar_file_name: fileName });
        });

        const user = reactLocalStorage.getObject("user");

        if (userUuid === user?.userUuid) {
          reactLocalStorage.setObject("user", {
            ...user,
            avatar_file_name: result.data.payload.fileUploadInfoList[0].name,
          });
          props.changeAvatar(!props.isChangeAvatar);
        }
      }
    });
  };

  const handleRefreshCameraPage = () => {
    setReloadCameraPage(!reloadCameraPage);
  };

  const handleReload = () => {
    setReload(!reload);
  };

  function callback(key) {
    setOpen(key);
  }

  const dataRules = (name_data) => {
    let rules = [];

    if (name_data === "email") {
      rules.push(
        {
          message: `${t("view.user.detail_list.email_address_required")}`,
          type: "email",
        },
        {
          max: 255,
          message: `${t("noti.255_characters_limit")}`,
        },
        {
          required: true,
          message: `${t("view.map.required_field")}`,
        }
      );
    }

    if (name_data === "password") {
      rules.push(
        {
          max: 255,
          message: `${t("noti.255_characters_limit")}`,
        },
        {
          min: 8,
          message: `${t("noti.at_least_8_characters")}`,
        },
        {
          required: true,
          message: `${t("view.map.required_field")}`,
        }
      );
    }
    if (name_data === "phone") {
      rules.push(() => ({
        validator(_, value) {
          const valiValue = document.getElementById("phone").value;

          if (!valiValue.length) {
            return Promise.reject(t("view.map.required_field"));
          }

          if (!valiValue.startsWith("0")) {
            if (valiValue.length < 10) {
              return Promise.reject(new Error(t("noti.at_least_9_characters")));
            } else if (valiValue.length > 19) {
              return Promise.reject(
                new Error(t("noti.max_characters", { max: 19 }))
              );
            }
          } else {
            if (valiValue.length < 11) {
              return Promise.reject(
                new Error(t("noti.at_least_10_characters"))
              );
            } else if (valiValue.length > 20) {
              return Promise.reject(
                new Error(t("noti.max_characters", { max: 20 }))
              );
            }
          }

          return Promise.resolve();
        },
      }));
    }
    if (name_data === "unit" || name_data === "position") {
      rules.push({
        max: 255,
        message: `${t("noti.255_characters_limit")}`,
      });
    }
    if (name_data === "name") {
      rules.push(
        {
          max: 255,
          message: `${t("noti.255_characters_limit")}`,
        },
        {
          required: true,
          message: `${t("view.map.required_field")}`,
        }
      );
    }

    return rules;
  };

  const renderHeader = (name, data, isRequired = false) => {
    const language = reactLocalStorage.get("language");
    return (
      <div className="d-flex justify-content-start dataUser">
        <div className="dataUser__name">
          {name}
          {isRequired ? (
            <span style={{ color: "red", fontSize: "18px" }}> *</span>
          ) : (
            ""
          )}
        </div>
        <div
          className="dataUser__name__data"
          style={{
            width: "60%",
            textOverflow: "ellipsis",
            overflow: "hidden",
            whitespace: "nowrap",
          }}
        >
          <Tooltip placement="top" title={data}>
            {!isEmpty(data) ? (
              data.length > 40 ? (
                `${data.slice(0, 19)}...${data.slice(
                  data.length - 20,
                  data.length
                )}`
              ) : (
                `${data}`
              )
            ) : (
              <Text type="warning">
                {language !== "en"
                  ? "Chưa có dữ liệu, vui lòng cập nhật"
                  : "Data not provided, please update"}
              </Text>
            )}
          </Tooltip>
        </div>
      </div>
    );
  };
  const renderHeaderSex = (name, data, isRequired = false) => {
    return (
      <div className="d-flex justify-content-start dataUser">
        <div className="dataUser__name">
          {name}
          {isRequired ? (
            <span style={{ color: "red", fontSize: "18px" }}> *</span>
          ) : (
            ""
          )}
        </div>
        <div>
          {data === 0
            ? `${t("view.user.detail_list.male")}`
            : `${t("view.user.detail_list.female")}`}
        </div>
      </div>
    );
  };

  const renderContentInput = (name_data, data) => {
    if (isEmpty(data)) {
      form.setFieldsValue({ [name_data]: "" });
    } else {
      form.setFieldsValue({ [name_data]: data });
    }

    const initData = {
      [name_data]: data,
    };

    return (
      <>
        <div>
          <Form
            className="bg-grey"
            form={form}
            onFinish={onHandleData}
            initialValues={initData}
          >
            <div
              style={{
                marginLeft: "40%",
              }}
              className="formData"
            >
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <Form.Item
                    style={{
                      width: "100%",
                    }}
                    name={name_data}
                    rules={dataRules(name_data)}
                  >
                    {name_data !== "phone" ? (
                      <Input
                        placeholder={t(
                          "view.user.detail_list.enter_alternative_data",
                          { plsEnter: t("please_enter") }
                        )}
                        type={name_data === "password" ? "password" : ""}
                        onBlur={(e) => {
                          form.setFieldsValue({
                            [name_data]: e.target.value.trim(),
                          });
                        }}
                      />
                    ) : (
                      <PhoneInput
                        international={false}
                        defaultCountry="VN"
                        placeholder={t(
                          "view.map.please_enter_your_phone_number",
                          { plsEnter: t("please_enter") }
                        )}
                      />
                    )}
                  </Form.Item>
                </div>

                <div>
                  <Tooltip placement="top" title={t("view.common_device.edit")}>
                    <Button htmlType="submit" className=" mr-1">
                      <CheckOutlined className=" d-flex justify-content-between align-center" />
                    </Button>
                  </Tooltip>
                  <Tooltip placement="top" title={t("view.map.button_cancel")}>
                    <Button
                      // className="btnAdd"
                      onClick={() => setLoading(!isLoading)}
                    >
                      <CloseOutlined className=" d-flex justify-content-between align-center" />
                    </Button>
                  </Tooltip>
                </div>
              </div>
            </div>
          </Form>
        </div>
      </>
    );
  };
  const renderContentSelect = (name, data) => {
    form.setFieldsValue({ [name]: data });

    const initData = {
      [name]: data,
    };

    return (
      <>
        <div>
          <Form
            className="bg-grey"
            form={form}
            onFinish={onHandleData}
            initialValues={initData}
          >
            <div
              style={{
                marginLeft: "40%",
              }}
              className="formData"
            >
              <div className="d-flex justify-content-between align-items-center edit">
                <div>
                  <Form.Item
                    style={{
                      width: "100%",
                    }}
                    name={name}
                    rules={[
                      {
                        required: true,
                        message: `${t("view.map.required_field")}`,
                      },
                    ]}
                  >
                    <Select
                      placeholder={t("view.user.detail_list.gender")}
                      dropdownClassName="sex__select"
                    >
                      <Option value={0}>
                        {t("view.user.detail_list.male")}
                      </Option>
                      <Option value={1}>
                        {t("view.user.detail_list.female")}
                      </Option>
                    </Select>
                  </Form.Item>
                </div>

                <div>
                  <Tooltip placement="top" title={t("view.common_device.edit")}>
                    <Button htmlType="submit" className=" mr-1">
                      <CheckOutlined className=" d-flex justify-content-between align-center" />
                    </Button>
                  </Tooltip>
                  <Tooltip placement="top" title={t("view.map.button_cancel")}>
                    <Button
                      // className="btnAdd"
                      onClick={() => setLoading(!isLoading)}
                    >
                      <CloseOutlined className=" d-flex justify-content-between align-center" />
                    </Button>
                  </Tooltip>
                </div>
              </div>
            </div>
          </Form>
        </div>
      </>
    );
  };
  const renderContentDatePicker = (name, data) => {
    const dateFormat = "DD/MM/YYYY";

    if (isEmpty(data)) {
      form.setFieldsValue({ [name]: "06-07-1997" });
    } else {
      form.setFieldsValue({ [name]: moment(data, dateFormat) });
    }

    const initData = {
      [name]: moment(data, dateFormat),
    };

    return (
      <>
        <div>
          <Form
            className="bg-grey"
            form={form}
            onFinish={onHandleData}
            initialValues={initData}
          >
            <div
              style={{
                marginLeft: "40%",
              }}
              className="formData"
            >
              <div className="justify-content-between d-flex align-items-center edit">
                <Form.Item
                  style={{
                    width: "100%",
                  }}
                  name={name}
                >
                  <DatePicker format={dateFormat} allowClear={false} />
                </Form.Item>
                <Tooltip placement="top" title={t("view.common_device.edit")}>
                  <Button htmlType="submit" className=" mr-1">
                    <CheckOutlined className=" d-flex justify-content-between align-center" />
                  </Button>
                </Tooltip>
                <Tooltip placement="top" title={t("view.map.button_cancel")}>
                  <Button
                    // className="btnAdd"
                    onClick={() => setLoading(!isLoading)}
                  >
                    <CloseOutlined className=" d-flex justify-content-between align-center" />
                  </Button>
                </Tooltip>
              </div>
            </div>
          </Form>
        </div>
      </>
    );
  };

  const onHandleData = async (value) => {
    handleClose();
    let payload = {
      ...value,
      ...(validatePhoneNumber(value?.phone) && { phone: value?.phone }),
    };

    if (!isEmpty(payload.date_of_birth)) {
      payload = {
        date_of_birth:
          moment(value?.date_of_birth).format("DD-MM-YYYY") || null,
      };
    }

    const isUpdate = await UserApi.updateUser(userUuid, payload);

    if (isUpdate) {
      const notifyMess = {
        type: "success",
        title: "",
        description: `${t("noti.successfully_change_data")}`,
      };
      Notification(notifyMess);
      setLoading(!isLoading);
    }
  };

  const validatePhoneNumber = (value) => {
    if (isEmpty(value)) {
      return false;
    }
    if (value[3] === 0) {
      value.splice(3, 1);
    }
  };

  const goBack = () => {
    history.go(-1);
  };

  return (
    <div
      className={`detail-user--information ${
        permissionCheck("edit_user") || props?.isMyInfor ? "" : "disableCard"
      }`}
    >
      <Card className="card-infor">
        <div className="title-avatar">
          {!props?.isMyInfor && (
            <h4 className="title__user--detail">
              <ArrowLeftOutlined className="mr-1" onClick={goBack} />
              {t("view.user.detail_list.personal")}
            </h4>
          )}

          <Upload
            accept=".png,.jpeg,.jpg"
            name="avatar"
            listType="picture-card"
            className="avatar-uploader"
            showUploadList={false}
            beforeUpload={beforeUpload}
            customRequest={uploadImage}
            onChange={handleChange}
          >
            {avatarUrl && avatarUrl !== "" ? (
              <div className=" d-flex justify-content-center">
                <Avatar
                  icon={<UserOutlined />}
                  src={avatarUrl}
                  className="avatarUser"
                  size={{
                    xs: 24,
                    sm: 32,
                    md: 40,
                    lg: 64,
                    xl: 80,
                    xxl: 130,
                  }}
                />
              </div>
            ) : (
              uploadButton
            )}
          </Upload>
        </div>

        <Collapse
          className="collapseInfo"
          expandIconPosition="right"
          activeKey={open}
          destroyInactivePanel={true}
          onChange={callback}
        >
          <Panel
            header={renderHeader(
              `${t("view.map.name")}`,
              userDetail?.name,
              true
            )}
            key="1"
            className="site-collapse-custom-panel"
          >
            {renderContentInput("name", userDetail?.name)}
          </Panel>
          <Panel
            header={renderHeaderSex(
              `${t("view.user.detail_list.gender")}`,
              userDetail.sex,
              true
            )}
            key="2"
            className="site-collapse-custom-panel"
          >
            {renderContentSelect("sex", userDetail?.sex)}
          </Panel>
          <Panel
            header={renderHeader(
              `${t("view.user.detail_list.dob")}`,
              userDetail.date_of_birth
            )}
            key="3"
            className="site-collapse-custom-panel"
          >
            {renderContentDatePicker("date_of_birth", userDetail.date_of_birth)}
          </Panel>
          <Panel
            header={renderHeader(
              `${t("view.map.phone_number")}`,
              userDetail?.phone,
              true
            )}
            key="4"
            className="site-collapse-custom-panel"
          >
            {renderContentInput("phone", userDetail?.phone)}
          </Panel>
        </Collapse>
      </Card>

      <Card className={`detail-user--account `}>
        <h4 className="titleUserDetail">{t("view.pages.login")}</h4>
        <Collapse
          className="collapseInfo"
          expandIconPosition="right"
          activeKey={open}
          destroyInactivePanel={true}
          onChange={callback}
        >
          <Panel
            header={renderHeader("Email", userDetail?.email, true)}
            key="5"
            className="site-collapse-custom-panel"
          ></Panel>
          <Panel
            header={renderHeader(
              `${t("view.pages.password")}`,
              "**********",
              true
            )}
            key="6"
            className="site-collapse-custom-panel"
          >
            {renderContentInput("password", "")}
          </Panel>
        </Collapse>
      </Card>
      <Card className={`detail-user--organization`}>
        <h4 className="titleUserDetail">
          {t("view.user.detail_list.organization")}
        </h4>
        <Collapse
          className="collapseInfo"
          expandIconPosition="right"
          activeKey={open}
          destroyInactivePanel={true}
          onChange={callback}
        >
          <Panel
            header={renderHeader(
              `${t("view.map.administrative_unit_uuid")}`,
              userDetail?.unit
            )}
            key="7"
            className="site-collapse-custom-panel"
          >
            {renderContentInput("unit", userDetail?.unit)}
          </Panel>
          <Panel
            header={renderHeader(
              `${t("view.user.detail_list.position")}`,
              userDetail?.position
            )}
            key="8"
            className="site-collapse-custom-panel"
          >
            {renderContentInput("position", userDetail?.position)}
          </Panel>
        </Collapse>
      </Card>

      {/* check đk để không đc sửa quyền cho bản thân : có quyền user admin  */}
      <div className={!props?.isMyInfor ? "" : "disableCard"}>
        <RoleUser id={userUuid} handleReload={handleReload} reload={reload} />
        <GroupUser id={userUuid} handleReload={handleReload} reload={reload} />
      </div>

      <CameraGroup
        id={userUuid}
        handleRefreshCameraPage={handleRefreshCameraPage}
        reload={reload}
        isMyInfor={props?.isMyInfor}
      ></CameraGroup>

      <Camera
        id={userUuid}
        reloadCameraPage={reloadCameraPage}
        reload={reload}
        isMyInfor={props?.isMyInfor}
      />
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    isChangeAvatar: state.customizer.customizer.changeAvatar,
  };
};
export default connect(mapStateToProps, {
  changeAvatar,
})(DetailUser);
