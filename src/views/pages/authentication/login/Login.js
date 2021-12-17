import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { reactLocalStorage } from "reactjs-localstorage";
import { Card, CardHeader, CardTitle, Col, Row } from "reactstrap";
import loginImg from "../../../../assets/img/pages/login.png";
import "../../../../assets/scss/pages/authentication.scss";
import "./Login.scss";
import LoginDefault from "./LoginDefault.jsx";

const Login = () => {
  const { t } = useTranslation();
  const language = reactLocalStorage.get("language");

  useEffect(() => {
    if (
      language === "vn"
        ? (document.title = "CCTV | Đăng nhập")
        : (document.title = "CCTV | Login")
    );
  }, [t]);

  return (
    <Row className="m-0 justify-content-center login">
      <Col
        sm="8"
        xl="7"
        lg="10"
        md="8"
        className="d-flex justify-content-center"
      >
        <Card className="bg-authentication login-card rounded-0 mb-0 w-100">
          <Row className="m-0">
            <Col
              lg="6"
              className="d-lg-block d-none text-center align-self-center px-1 py-0 h-w"
            >
              <img src={loginImg} alt="loginImg" className="loginImg" />
              {language == "vn" ? (
                <span className="loginTitleVN">{t("VMS")}</span>
              ) : (
                <span className="loginTitleEN">{t("VMS")}</span>
              )}
            </Col>
            <Col lg="6" md="12" className="p-0 bg-color">
              <Card
                className="rounded-0 mb-0 px-2 login-tabs-container"
                style={{ backgroundColor: "#10163a", color: "#ebeefd" }}
              >
                <CardHeader className="pb-1">
                  <CardTitle>
                    <h4 style={{ color: "#ebeefd" }} className="mb-0">
                      {t("view.pages.login")}
                    </h4>
                  </CardTitle>
                </CardHeader>
                <p className="px-2 auth-title" style={{ color: "#c2c6dc" }}>
                  {t("view.pages.wc_pls_login")}
                </p>

                <LoginDefault />
              </Card>
            </Col>
          </Row>
        </Card>
      </Col>
    </Row>
  );
};

export default Login;
