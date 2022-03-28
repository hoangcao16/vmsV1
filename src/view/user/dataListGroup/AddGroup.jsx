import { ArrowLeftOutlined } from '@ant-design/icons';
import { Button, Card, Col, Form, Input, Row } from 'antd';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, withRouter } from 'react-router-dom';
import UserApi from '../../../actions/api/user/UserApi';
import Notification from '../../../components/vms/notification/Notification';
import './AddGroup.scss';

const formItemLayout = {
  wrapperCol: { span: 24 },
  labelCol: { span: 24 }
};

function AddGroup(props) {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const history = useHistory();

  const handleSubmit = async (value) => {
    const payload = {
      ...value
    };
    const group = await UserApi.createdGroup(payload);
    if (group?.uuid) {
      const notifyMess = {
        type: 'success',
        title: '',
        description: `${t('noti.successfully_added_data', { add: t('add') })}`
      };
      Notification(notifyMess);
      history.replace(`group/detail/${group?.uuid}`);
    } else {
      const notifyMess = {
        type: 'error',
        title: '',
        description: `${t('noti.unsuccessfully_add_data', { add: t('add') })}`
      };
      Notification(notifyMess);
    }
  };

  const goBack = () => {
    props.history.goBack();
  };

  return (
    <div>
      <div className="add__group">
        <Card className="add__group--card">
          <div>
            <div className="d-flex align-items-center">
              <ArrowLeftOutlined className="mr-1" onClick={goBack} />
              <h4 className="font-weight-700">
                {t('view.user.detail_list.add_new_group', {
                  add: t('add'),
                  G: t('G'),
                  g: t('g')
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
                  <Row gutter={24} style={{ width: '100%' }} className="mt-1">
                    <Col span={6}>
                      <p>
                        {t('view.user.detail_list.group_name', {
                          G: t('G'),
                          g: t('g')
                        })}{' '}
                        <span color="red">*</span>
                      </p>
                    </Col>

                    <Col span={18}>
                      <Form.Item
                        name={['name']}
                        rules={[
                          {
                            required: true,
                            message: `${t('view.map.required_field')}`
                          }
                        ]}
                      >
                        <Input
                          placeholder={t(
                            'view.user.detail_list.enter_group_name',
                            { plsEnter: t('please_enter'), g: t('g') }
                          )}
                          maxLength={255}
                          onBlur={(e) => {
                            form.setFieldsValue({
                              name: e.target.value.trim()
                            });
                          }}
                          onPaste={(e) => {
                            form.setFieldsValue({
                              name: e.target.value.trimStart()
                            });
                          }}
                        />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Row gutter={24} style={{ width: '100%' }} className="mt-1">
                    <Col span={6}>
                      <p>
                        {t('view.user.detail_list.group_desc', {
                          G: t('G'),
                          g: t('g')
                        })}
                      </p>
                    </Col>

                    <Col span={18}>
                      <Form.Item name={['description']}>
                        <Input
                          placeholder={t(
                            'view.user.detail_list.enter_group_desc',
                            { plsEnter: t('please_enter'), g: t('g') }
                          )}
                          maxLength={255}
                          onBlur={(e) => {
                            form.setFieldsValue({
                              description: e.target.value.trim()
                            });
                          }}
                          onPaste={(e) => {
                            form.setFieldsValue({
                              description: e.target.value.trimStart()
                            });
                          }}
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
                  textAlign: 'center'
                }}
              >
                <Button
                  type="primary"
                  htmlType="submit "
                  className="buttonAddGroup"
                >
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

export default withRouter(AddGroup);
