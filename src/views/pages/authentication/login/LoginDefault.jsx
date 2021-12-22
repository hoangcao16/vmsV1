import { notification } from 'antd';
import 'antd/dist/antd.css';
import React, { useEffect, useState } from 'react';
import { Check, Lock, Mail } from 'react-feather';
import { Link } from 'react-router-dom';
import { reactLocalStorage } from 'reactjs-localstorage';
import { Button, CardBody, Form, FormGroup, Input, Label } from 'reactstrap';
import UserApi from '../../../../actions/api/user/UserApi';
import rest_api from '../../../../actions/rest_api';
import Checkbox from '../../../../components/@vuexy/checkbox/CheckboxesVuexy';
import { history } from '../../../../history';
import './LoginDefault.scss';
import { Tooltip } from 'antd';
import { handleErrCodeAuthZ } from '../../../../actions/function/MyUltil/ResponseChecker';
import { isEmpty } from 'lodash';
import { useTranslation } from 'react-i18next';

const LoginDefault = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [isVisibleTooltipPassword, setIssVisibleTooltipPassword] =
    useState(true);
  const [isVisibleTooltipEmail, setIssVisibleTooltipEmail] = useState(true);

  useEffect(() => {
    let loginInfo = reactLocalStorage.getObject('login_info', null);
    if (loginInfo !== undefined && loginInfo !== null) {
      let email = loginInfo.email;
      let password = loginInfo.password;
      setEmail(email);
      setPassword(password);
      setRemember(true);
    }
  }, []);

  const handleRemember = (e) => {
    setRemember(e.target.checked);
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (isEmpty(email) || isEmpty(password)) {
      notification.error({
        message: `${t('noti.faid')}`,
        description: `${t('noti.full_account_password')}`,
        duration: 2
      });
      return;
    }

    const payload = {
      email: email,
      password: password
    };
    rest_api.post(
      '/authz/login',
      payload,
      async (data) => {
        const dataHandle = handleErrCodeAuthZ(data);

        if (!isEmpty(dataHandle)) {
          let user = {
            token: data?.accessToken,
            refreshToken: data?.refreshToken,
            email: email,
            userUuid: data?.userUuid,
            avatar_file_name: data?.avatar_file_name
          };
          await reactLocalStorage.setObject('user', user);

          await UserApi.getPermissionForUserLogin().then((result) => {
            reactLocalStorage.setObject('permissionUser', result);
          });

          if (remember) {
            let loginInfo = {
              email: email,
              password: password
            };
            reactLocalStorage.setObject('login_info', loginInfo);
          } else {
            reactLocalStorage.remove('login_info');
          }

          notification.success({
            message: `${t('noti.success')}`,
            description: `${t('noti.logged_in_successfully')}`,
            duration: 2
          });
          history.push('/');
        }
      },
      null,
      true
    );
  };

  return (
    <React.Fragment>
      <CardBody className="pt-1">
        <Form action="/" onSubmit={handleLogin}>
          <FormGroup className="form-label-group position-relative has-icon-left">
              <Input
                style={{
                  backgroundColor: '#262c49',
                  color: '#ebeefd',
                  border: 'none'
                }}
                type="text"
                placeholder={t('view.pages.account')}
                value={email}
                maxLength={255}
                onChange={(e) => {
                  const value = e.target.value.trim();
                  setEmail(value);
                  setIssVisibleTooltipEmail(value);
                }}
              // required
              />

            <div className="form-control-position">
              <Mail size={15} color="#c2c6dc" />
            </div>
            <Label style={{ color: '#c2c6dc !important' }}>
              {t('view.pages.account')}
            </Label>
          </FormGroup>
          <FormGroup className="form-label-group position-relative has-icon-left">
              <Input
                style={{
                  backgroundColor: '#262c49',
                  color: '#ebeefd',
                  border: 'none'
                }}
                type="password"
                maxLength={255}
                placeholder={t('view.pages.password')}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value.replace(/\s/g, ''));
                  setIssVisibleTooltipPassword(
                    e.target.value.replace(/\s/g, '')
                  );
                }}
              // required
              />

            <div className="form-control-position">
              <Lock size={15} color="#c2c6dc" />
            </div>
            <Label>{t('view.pages.password')}</Label>
          </FormGroup>
          <FormGroup className="d-flex justify-content-between align-items-center">
            <Checkbox
              className="d-flex justify-content-between align-items-center"
              color="primary"
              icon={<Check className="vx-icon" size={16} />}
              label={
                <p
                  style={{ color: '#c2c6dc', alignItems: 'center', margin: 0 }}
                >
                  {t('view.pages.save_account')}
                </p>
              }
              checked={remember}
              onChange={handleRemember}
            />
            <div className="float-right">
              <Link to="/pages/forgot-password">
                {t('view.pages.forgot_password')}
              </Link>
            </div>
          </FormGroup>

          <div className="d-flex justify-content-between">
            {/* <Button.Ripple
              color="primary"
              outline
              onClick={() => {
                history.push('/pages/register');
              }}
            >
              Đăng kí
            </Button.Ripple> */}
            <div className="d-flex justify-content-between">
              <Button.Ripple color="primary" type="submit">
                {t('view.pages.login')}
              </Button.Ripple>
            </div>
          </div>
        </Form>
      </CardBody>
    </React.Fragment>
  );
};

export default LoginDefault;
