import { isEmpty } from "lodash";
import React, { useEffect, useState } from "react";
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
  Row
} from 'reactstrap';
import UserApi from '../../../actions/api/user/UserApi';
import fgImg from '../../../assets/img/pages/forgot-password.png';
import '../../../assets/scss/pages/authentication.scss';
import Notification from '../../../components/vms/notification/Notification';
import { history } from '../../../history';
import './ForgotPassword.scss'
import { useTranslation } from 'react-i18next';
import { reactLocalStorage } from "reactjs-localstorage";


const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const { t } = useTranslation();
  const language = reactLocalStorage.get("language");


  useEffect(() => {
    if (
      language == "vn"
        ? (document.title = "CCTV | Khôi phục mật khẩu")
        : (document.title = "CCTV | Recover Password")
    );
  }, [t]);

  const onSendMailReset = async () => {
    if (isEmpty(email)) {
      const notifyMess = {
        type: "warning",
        title: "Thất bại",
        description: "Bạn không được để trống trường email ",
      };
      Notification(notifyMess);
      return;
    }

    const check =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (!check.test(String(email).toLowerCase())) {
      const notifyMess = {
        type: "warning",
        title: "Thất bại",
        description: "Định dạng email không đúng",
      };
      Notification(notifyMess);
      return;
    }

    const isReset = await UserApi.resetPassword({ email });
    console.log("isReset", isReset)
    if (isReset) {
      setEmail("");

      const notifyMess = {
        type: "success",
        title: "",
        description: "Một email đã được gửi cho bạn, hãy kiểm tra ",
      };
      Notification(notifyMess);
    }
    //  else {
    //   const notifyMess = {
    //     type: 'error',
    //     title: '',
    //     description: 'Gửi emai thất bại'
    //   };
    //   Notification(notifyMess);
    // }
  };

  return (
    <Row className='m-0 justify-content-center'>
      <Col
        sm='8'
        xl='7'
        lg='10'
        md='8'
        className='d-flex justify-content-center'
      >
        <Card className='bg-authentication rounded-0 mb-0 w-100'>
          <Row className='m-0'>
            <Col
              lg='6'
              className='d-lg-block d-none text-center align-self-center'
            >
              <img src={fgImg} alt='fgImg' />
            </Col>
            <Col lg='6' md='12' className='p-0 dark-card-color'>
              <Card className='rounded-0 mb-0 px-2 py-1 h100 fp'>
                <CardHeader className='pb-1'>
                  <CardTitle>
                    <h4 className="mb-0 fp__title">{t('view.pages.recover_password')}</h4>
                  </CardTitle>
                </CardHeader>
                <p className="px-2 auth-title fp__desc">
                  {t('view.pages.enter_email')}
                </p>
                <CardBody className='pt-1 pb-0'>
                  <Form>
                    <FormGroup className='form-label-group input__email--forgot-password'>
                      <Input
                        // type='email'
                        placeholder='Email'
                        className='email__receive-new-password fp__input'
                        required
                        value={email}
                        maxLength={255}
                        onChange={(e) => {
                          const value = e.target.value.trim();
                          setEmail(value);
                        }}
                      // className='input__email--forgot-password'
                      />
                      <Label>Email</Label>
                    </FormGroup>
                    <div className='float-md-left d-block mb-1'>
                      <Button.Ripple
                        color='primary'
                        outline
                        className='px-75 btn-block'
                        onClick={() => history.push("/pages/login")}
                      >
                        {t('view.pages.login')}
                      </Button.Ripple>
                    </div>
                    <div className='float-md-right d-block mb-1'>
                      <Button.Ripple
                        color='primary'
                        type='submit'
                        className='px-75 btn-block'
                        onClick={(e) => {
                          e.preventDefault();
                          onSendMailReset();
                          // history.push('/');
                        }}
                      >
                        {t('view.pages.recover_pw')}
                      </Button.Ripple>
                    </div>
                  </Form>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Card>
      </Col>
    </Row>
  );
};

export default ForgotPassword;
