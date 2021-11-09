import { Button, Card, Col, Form, Input, Row } from 'antd';
import React, { useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { reactLocalStorage } from 'reactjs-localstorage';
import UserApi from '../../actions/api/user/UserApi';
import Notification from '../../components/vms/notification/Notification';
import './ChangePassword.scss';
import { history } from '../../history';
import { useTranslation } from 'react-i18next';
import Breadcrumds from '../breadcrumds/Breadcrumds';

const formItemLayout = {
  wrapperCol: { span: 24 },
  labelCol: { span: 24 }
};

function ChangePassword(props) {
  const { t } = useTranslation();
  const language = reactLocalStorage.get('language')
  const [form] = Form.useForm();

  useEffect(() => {
    if (
      language == "vn"
        ? (document.title = "CCTV | Đổi mật khẩu")
        : (document.title = "CCTV | Change Password")
    );
  },[t]);

  const handleSubmit = async (value) => {
    let user = reactLocalStorage.getObject('user', null);
    const payload = {
      ...value
    };

    const isUpdate = await UserApi.updateUser(user?.userUuid, payload);

    if (isUpdate) {
      const notifyMess = {
        type: 'success',
        title: '',
        description: 'Cập nhật mật khẩu thành công '
      };
      Notification(notifyMess);

      const isLogout = await UserApi.logout();

      if (isLogout) {
        reactLocalStorage.setObject('user', null);
        reactLocalStorage.setObject('permissionUser', null);
        history.push('/pages/login');
      }
    }
  };

  return (
    <div>
      <Breadcrumds
        url="/app/setting"
        nameParent={t('breadcrumd.setting')}
        nameChild={t('view.user.change_password')}
      />
      <div className="ChangePassWord">
        <Card className="ChangePassWord--card">
          <h4 className="font-weight-700 title">
            {t('view.user.change_password')}
          </h4>
          <div className="ChangePassWord--card--border">
            <Form
              className="bg-grey pt-2"
              form={form}
              {...formItemLayout}
              onFinish={handleSubmit}
              {...formItemLayout}
              initialValues={{}}
              scrollToFirstError
            >
              <Row gutter={24}>
                <Col span={4}></Col>
                <Col span={16}>
                  <Row gutter={24} style={{ width: '100%' }} className="mt-1">
                    <Col span={6}>
                      <p>
                        {t('view.user.new_password')} <span color="red">*</span>
                      </p>
                    </Col>

                    <Col span={18}>
                      <Form.Item
                        name={['password']}
                        rules={[
                          {
                            required: true,
                            message: `${t('view.map.required_field')}`
                          },
                          {
                            min: 8,
                            message: `${t(
                              'view.user.detail_list.password_length'
                            )}`
                          }
                        ]}
                      >
                        <Input
                          placeholder={t('view.user.detail_list.password')}
                          type="password"
                          maxLength={255}
                          onChange={(e) => {
                            form.setFieldsValue({
                              password: e.target.value.replace(/\s/g, '')
                            });
                          }}
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                </Col>
                <Col span={4}></Col>
              </Row>
              <div className="buttonChangePassword">
                <Button type="primary" htmlType="submit ">
                  {t('view.map.button_save')}
                </Button>
              </div>
            </Form>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default withRouter(ChangePassword);
