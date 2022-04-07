import { ArrowLeftOutlined } from "@ant-design/icons";
import { Button, Card, Col, Form, Input, Row } from "antd";
import React from "react";
import { useHistory, useRouteMatch, withRouter } from "react-router-dom";
import UserApi from "../../../actions/api/user/UserApi";
import Notification from "../../../components/vms/notification/Notification";
import "./AddRoles.scss";
import { useTranslation } from "react-i18next";

const formItemLayout = {
  wrapperCol: { span: 24 },
  labelCol: { span: 24 },
};

function AddRoles(props) {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const history = useHistory();
  let { path } = useRouteMatch();

  const handleSubmit = async (value) => {
    const payload = {
      ...value,
    };
    const roles = await UserApi.createdRoles(payload);
    if (roles?.uuid) {
      const notifyMess = {
        type: "success",
        title: "",
        description: `${t("noti.successfully_added_data", { add: t("add") })}`,
      };
      Notification(notifyMess);
      history.replace(`roles/detail/${roles?.uuid}`);
    } else {
      const notifyMess = {
        type: "error",
        title: "",
        description: `${t("noti.unsuccessfully_add_data", { add: t("add") })}`,
      };
      Notification(notifyMess);
    }
  };
  const goBack = () => {
    props.history.goBack();
  };

  return (
    <div>
      <div className="add__role">
        <Card className="add__role--card">
          <div>
            <div className="d-flex align-items-center">
              <ArrowLeftOutlined className="mr-1" onClick={goBack} />
              <h4 className="font-weight-700">
                {t("view.user.detail_list.add_new_role", {
                  add: t("add"),
                  R: t("R"),
                  r: t("r"),
                })}
              </h4>
            </div>

            <Form
              className="bg-grey pt-2"
              form={form}
              onFinish={handleSubmit}
              {...formItemLayout}
              initialValues={{}}
              scrollToFirstError
            >
              <Row gutter={24}>
                <Col span={4}></Col>
                <Col span={16}>
                  <Row gutter={24} style={{ width: "100%" }} className="mt-1">
                    <Col span={6}>
                      <p>
                        {t("view.user.detail_list.role_name", {
                          R: t("R"),
                          r: t("r"),
                        })}{" "}
                        <span color="red">*</span>
                      </p>
                    </Col>

                    <Col span={18}>
                      <Form.Item
                        name={["name"]}
                        onBlur={(e) => {
                          form.setFieldsValue({
                            name: e.target.value.trim(),
                          });
                        }}
                        onPaste={(e) => {
                          e.preventDefault();
                          form.setFieldsValue({
                            name: e.clipboardData.getData("text").trim(),
                          });
                        }}
                        rules={[
                          {
                            required: true,
                            message: `${t("view.map.required_field")}`,
                          },
                          {
                            max: 255,
                            message: `${t("noti.255_characters_limit")}`,
                          },
                        ]}
                      >
                        <Input
                          placeholder={t(
                            "view.user.detail_list.enter_role_name",
                            { r: t("r"), plsEnter: t("please_enter") }
                          )}
                        />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Row gutter={24} style={{ width: "100%" }} className="mt-1">
                    <Col span={6}>
                      <p>
                        {t("view.user.detail_list.role_desc", {
                          R: t("R"),
                          r: t("r"),
                        })}
                      </p>
                    </Col>

                    <Col span={18}>
                      <Form.Item
                        name={["description"]}
                        onBlur={(e) => {
                          form.setFieldsValue({
                            description: e.target.value.trim(),
                          });
                        }}
                        onPaste={(e) => {
                          e.preventDefault();
                          form.setFieldsValue({
                            description: e.clipboardData.getData("text").trim(),
                          });
                        }}
                        rules={[
                          {
                            max: 255,
                            message: `${t("noti.255_characters_limit")}`,
                          },
                        ]}
                      >
                        <Input
                          placeholder={t(
                            "view.user.detail_list.enter_role_desc",
                            { plsEnter: t("please_enter"), r: t("r") }
                          )}
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                </Col>
                <Col span={4}></Col>
              </Row>
              <div
                className="submit pt-2"
                style={{
                  textAlign: "center",
                }}
              >
                <Button
                  type="primary"
                  htmlType="submit "
                  className="buttonAddRoles"
                >
                  {t("view.map.button_save")}
                </Button>
              </div>
            </Form>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default withRouter(AddRoles);
