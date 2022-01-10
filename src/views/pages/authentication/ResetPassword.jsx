import { isEmpty } from "lodash";
import React from "react";
import { reactLocalStorage } from "reactjs-localstorage";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Col,
  Form,
  FormGroup,
  Input,
  Label,
  Row,
} from "reactstrap";
import UserApi from "../../../actions/api/user/UserApi";
import resetImg from "../../../assets/img/pages/reset-password.png";
import "../../../assets/scss/pages/authentication.scss";
import Notification from "../../../components/vms/notification/Notification";
import { history } from "../../../history";
import "./ResetPassword.scss";
import { withTranslation } from "react-i18next";
// import pageError from '../misc/error/401'

class ResetPassword extends React.Component {
  state = {
    new_password: "",
    // isTokenExpire: false
  };

  async componentDidMount() {
    const authResult = new URLSearchParams(window.location.search);
    const token = authResult.get("token");

    const isCheckToken = await UserApi.changePassword({ token });
    if (!isCheckToken) {
      history.push("/pages/login");
    }
    return;
  }

  onChange = (e) => {
    this.setState({
      // ...this.state,
      new_password: e.target.value,
    });
  };

  updatePassword = async () => {
    const { new_password } = this.state;
    const authResult = new URLSearchParams(window.location.search);
    const token = authResult.get("token");

    if (token) {
      const isCheckToken = await UserApi.changePassword({ token });

      if (isCheckToken) {
        const params = {
          token: token,
          new_password: new_password,
        };
        const isUpdate = await UserApi.updatePassword(params);

        if (isUpdate) {
          const language = reactLocalStorage.get("language");
          let notifyMess = {};
          if (language === "vn") {
            notifyMess = {
              type: "success",
              title: "",
              description: "Cập nhật mật khẩu thành công",
            };
          } else {
            notifyMess = {
              type: "success",
              title: "",
              description: "Successfully updated password",
            };
          }
          Notification(notifyMess);

          reactLocalStorage.setObject("login_info", {});
          history.push("/pages/login");
        } else {
          const language = reactLocalStorage.get("language");
          let notifyMess = {};
          if (language === "vn") {
            notifyMess = {
              type: "error",
              title: "",
              description: "Cập nhật mật khẩu thất bại",
            };
          } else {
            notifyMess = {
              type: "error",
              title: "",
              description: "Failed updated password",
            };
          }
          Notification(notifyMess);
        }
      }
    }
  };
  //
  handleSubmit = (e) => {
    const language = reactLocalStorage.get("language");
    const value = document.getElementById("input__password").value;

    if (isEmpty(value)) {
      let notifi = {};
      if (language === "vn") {
        notifi = {
          type: "warning",
          title: "Thất bại",
          description: "Trường mật khẩu không được để trống",
        };
      } else {
        notifi = {
          type: "warning",
          title: "Failed",
          description: "Password feild can't be empty",
        };
      }
      Notification(notifi);
      return;
    } else if (value.length < 8) {
      let notifi = {};
      if (language === "vn") {
        notifi = {
          type: "warning",
          title: "Thất bại",
          description: "Mật khẩu của bạn phải có ít nhất 8 ký tự",
        };
      } else {
        notifi = {
          type: "warning",
          title: "Failed",
          description: "Your password must have at least 8 characters",
        };
      }
      Notification(notifi);
      return;
    } else {
      e.preventDefault();
      this.updatePassword();
    }
  };

  render() {
    const { t } = this.props;
    return this.state.isTokenExpire ? (
      <pageError />
    ) : (
      <Row className="m-0 justify-content-center reset__password">
        <Col
          sm="8"
          xl="7"
          lg="10"
          md="8"
          className="d-flex justify-content-center"
        >
          <Card className="bg-authentication rounded-0 mb-0 w-100">
            <Row className="m-0">
              <Col
                lg="6"
                className="d-lg-block d-none text-center align-self-center px-5"
              >
                <img className="px-5 mx-2" src={resetImg} alt="resetImg" />
              </Col>
              <Col lg="6" md="12" className="p-0 col2">
                <Card className="rounded-0 mb-0 px-2 py-50 col2_bgColor">
                  <CardHeader className="pb-1 pt-1">
                    <CardTitle>
                      <h4 className="mb-0 col2_color">
                        {t("view.pages.update_password")}
                      </h4>
                    </CardTitle>
                  </CardHeader>
                  <p className="px-2 col2_auth-titleColor">
                    {t("view.pages.enter_new_password", {
                      plsEnter: t("please_enter"),
                    })}
                  </p>
                  <CardBody className="pt-1">
                    <Form>
                      <FormGroup className="form-label-group">
                        <Input
                          id="input__password"
                          className="col2_input"
                          placeholder={t("view.user.new_password")}
                          required
                          maxLength={255}
                          minLength={8}
                          onChange={(e) => {
                            this.onChange(e);
                            document.getElementById("input__password").value =
                              e.target.value.replace(/\s/g, "");
                          }}
                          type="password"
                        />
                        <Label>{t("view.user.new_password")}</Label>
                      </FormGroup>

                      <Button.Ripple
                        block
                        color="primary"
                        // type="submit"
                        className="btn-block mt-1 mt-sm-0"
                        onClick={(e) => {
                          this.handleSubmit(e);
                        }}
                      >
                        {t("view.pages.update")}
                      </Button.Ripple>
                    </Form>

                    <Button.Ripple
                      block
                      className="btn-block"
                      color="primary"
                      outline
                      onClick={(e) => {
                        e.preventDefault();
                        history.push("/pages/login");
                      }}
                    >
                      {t("view.pages.return_to_homepage")}
                    </Button.Ripple>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    );
  }
}
export default withTranslation()(ResetPassword);
