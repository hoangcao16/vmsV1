import {
  ArrowLeftOutlined,
  ExclamationCircleOutlined,
  LoadingOutlined,
  PlusOutlined,
  UserOutlined
} from '@ant-design/icons';
import {
  Avatar,
  Button,
  Card,
  Col,
  DatePicker,
  Form,
  Input,
  Modal,
  Row,
  Select,
  Upload
} from 'antd';
import MuiPhoneNumber from 'material-ui-phone-number';
import moment from 'moment';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, withRouter } from 'react-router-dom';
import { v4 as uuidV4 } from 'uuid';
import ExportEventFileApi from '../../../../actions/api/exporteventfile/ExportEventFileApi';
import UserApi from '../../../../actions/api/user/UserApi';
import Notification from '../../../../components/vms/notification/Notification';
import { NOTYFY_TYPE } from '../../../common/vms/Constant';
import './../../../commonStyle/commonDatePicker.scss';
import './../../../commonStyle/commonForm.scss';
import './../../../commonStyle/commonInput.scss';
import './AddUser.scss';

const { Option } = Select;

function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}

function beforeUpload(file) {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJpgOrPng) {
    const notifyMess = {
      type: NOTYFY_TYPE.danger,
      title: ''
      // description: `${t('noti.upload_file_desc')}`
    };
    Notification(notifyMess);
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    const notifyMess = {
      type: NOTYFY_TYPE.danger,
      title: ''
      // description: `${t('noti.size_file_desc')}`
    };
    Notification(notifyMess);
  }
  return isJpgOrPng && isLt2M;
}

const formItemLayout = {
  wrapperCol: { span: 24 },
  labelCol: { span: 24 }
};

function AddUser(props) {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [form] = Form.useForm();
  const history = useHistory();

  const handleChange = (info) => {
    if (info.file.status === 'uploading') {
      setLoading(true);
    }
  };

  const uploadImage = async (options) => {
    const { file } = options;
    await ExportEventFileApi.uploadAvatar(uuidV4(), file).then((result) => {
      if (
        result.data.payload &&
        result.data.payload.fileUploadInfoList.length > 0
      ) {
        getBase64(file, (imageUrl) => {
          setLoading(false);
          setImageUrl(imageUrl);
          let fileName = result.data.payload.fileUploadInfoList[0].name;
          form.setFieldsValue({
            avatar_file_name: fileName
          });
        });
      }
    });
  };

  const handleSubmit = async (value) => {
    if (validatePhoneNumber(value?.phone)) {
      const payload = {
        ...value,
        phone: value?.phone,
        date_of_birth: moment(value?.date_of_birth).format('DD-MM-YYYY')
      };

      const createdUser = await UserApi.createdUser(payload);

      if (createdUser?.uuid) {
        const notifyMess = {
          type: 'success',
          title: `${t('view.user.detail_list.success')}`,
          description: `${t('noti.successfully_added_data', { add: t('add') })}`
        };
        Notification(notifyMess);

        history.replace(`detail/${createdUser?.uuid}`);
      } else {
        const notifyMess = {
          type: 'warning',
          title: `${t('view.user.detail_list.fail')}`,
          description: `${t('noti.unsuccessfully_add_data', { add: t('add') })}`
        };
        Notification(notifyMess);
      }
    }

  };

  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>
        {t('view.user.detail_list.add_image', { add: t('add') })}
      </div>
    </div>
  );

  const goBack = () => {
    props.history.goBack();
  };

  function disabledDate(current) {
    // Can not select days before today and today
    return current && current > moment().endOf('day');
  }

  function confirm() {
    Modal.confirm({
      title: `${t('view.user.detail_list.confirm')}`,
      icon: <ExclamationCircleOutlined />,
      content: `${t('noti.cancel')}`,
      okText: `${t('view.user.detail_list.cancel')}`,
      cancelText: `${t('view.user.detail_list.back')}`,
      onOk: test
    });
  }

  const validatePhoneNumber = (value) => {

    const pattern = /^[+]*[(]{0,1}[0-9]{1,3}[)]{0,1}[-\s\./0-9]*$/g
    if (!pattern.test(value) && value.length > 10) {
      const notifyMess = {
        type: NOTYFY_TYPE.error,
        description: 'Định dạng số điện thoại chưa đúng'
      };
      Notification(notifyMess);
      return false;
    }
    return true;
  }

  const test = () => {
    props.history.goBack();
  };

  return (
    <div>
      <div className="add__user">
        <Card className="add__user--card">
          <div className="d-flex align-items-center">
            <ArrowLeftOutlined className="mr-1" onClick={goBack} />
            <h4 className="font-weight-700">
              {t('view.user.detail_list.add_new_user', {
                add: t('add'),
                u: t('u'),
                U: t('U')
              })}
            </h4>
          </div>
          <div>
            <div className=" d-flex justify-content-center">
              <Upload
                accept=".png,.jpeg,.jpg"
                name="avatar"
                listType="picture-card"
                className="avatar-uploader width-150"
                showUploadList={false}
                beforeUpload={beforeUpload}
                customRequest={uploadImage}
                onChange={handleChange}
              >
                {imageUrl ? (
                  <div className=" d-flex justify-content-center">
                    <Avatar
                      icon={<UserOutlined />}
                      src={imageUrl}
                      className="avatarUser"
                      size={{
                        xs: 24,
                        sm: 32,
                        md: 40,
                        lg: 64,
                        xl: 80,
                        xxl: 130
                      }}
                    />
                  </div>
                ) : (
                  uploadButton
                )}
              </Upload>
            </div>

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
                <Col span={3}></Col>
                <Col span={18}>
                  <Row gutter={24} style={{ width: '100%' }} className="mt-1">
                    <Col span={7}>
                      <p>
                        {t('view.user.detail_list.name')}
                        <span style={{ color: 'red', fontSize: '18px' }}>
                          {' '}
                          *
                        </span>
                      </p>
                    </Col>

                    <Col span={17}>
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
                          id="input__name"
                          placeholder={t(
                            'view.user.detail_list.please_enter_name',
                            { plsEnter: t('please_enter') }
                          )}
                          autocomplete="off"
                          maxLength={255}
                          onBlur={(e) => {
                            form.setFieldsValue({
                              name: e.target.value.trim()
                            });
                          }}
                        />
                      </Form.Item>
                      <Form.Item
                        hidden={true}
                        name={['avatar_file_name']}
                        rules={[{ required: false }]}
                      >
                        <Input type="hidden" />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Row gutter={24} style={{ width: '100%' }} className="mt-1">
                    <Col span={7}>
                      <p>
                        {t('view.user.detail_list.gender')}
                        <span style={{ color: 'red', fontSize: '18px' }}>
                          {' '}
                          *
                        </span>
                      </p>
                    </Col>

                    <Col span={17}>
                      <Form.Item
                        name="sex"
                        rules={[
                          {
                            required: true,
                            message: `${t('view.map.required_field')}`
                          }
                        ]}
                      >
                        <Select
                          placeholder={t('view.user.detail_list.choose_gender')}
                        >
                          <Option value={0}>
                            {t('view.user.detail_list.male')}
                          </Option>
                          <Option value={1}>
                            {t('view.user.detail_list.female')}
                          </Option>
                        </Select>
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={24} style={{ width: '100%' }} className="mt-1">
                    <Col span={7}>
                      <p>{t('view.user.detail_list.dob')}</p>
                    </Col>

                    <Col span={17}>
                      <Form.Item name="date_of_birth">
                        <DatePicker
                          placeholder={t('view.user.detail_list.dob')}
                          disabledDate={disabledDate}
                          inputReadOnly={true}
                          format="DD-MM-YYYY"
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={24} style={{ width: '100%' }} className="mt-1">
                    <Col span={7}>
                      <p style={{ display: 'inline-block' }}>
                        {t('view.user.detail_list.phone_number')}
                      </p>
                      <span style={{ color: 'red', fontSize: '18px' }}> *</span>
                    </Col>

                    <Col span={17}>
                      <Form.Item
                        name={['phone']}
                        rules={[
                          {
                            required: true,
                            message: `${t('view.map.required_field')}`
                          },
                          {
                            min: 10,
                            message: `${t('noti.at_least_10_characters')}`
                          }
                        ]}
                      >
                        <Input
                          type="text"
                          maxLength={13}
                          onBlur={(e) => validatePhoneNumber(e.target.value)}
                          placeholder='Số điện thoại'
                        />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Row gutter={24} style={{ width: '100%' }} className="mt-1">
                    <Col span={7}>
                      <p>
                        {t('view.user.detail_list.email')}
                        <span style={{ color: 'red', fontSize: '18px' }}>
                          {' '}
                          *
                        </span>
                      </p>
                    </Col>

                    <Col span={17}>
                      <Form.Item
                        name={['email']}
                        rules={[
                          {
                            required: true,
                            message: `${t(
                              'view.user.detail_list.gmail_address_required'
                            )}`,
                            type: 'email'
                          },
                          {
                            max: 255,
                            message: `${t('noti.255_characters_limit')}`
                          }
                        ]}
                      >
                        <Input placeholder="Email" autocomplete="off" />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Row gutter={24} style={{ width: '100%' }} className="mt-1">
                    <Col span={7}>
                      <p>
                        {t('view.user.detail_list.password')}
                        <span style={{ color: 'red', fontSize: '18px' }}>
                          {' '}
                          *
                        </span>
                      </p>
                    </Col>

                    <Col span={17}>
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
                          },
                          {
                            max: 255,
                            message: `${t('noti.255_characters_limit')}`
                          }
                        ]}
                      >
                        <Input
                          id="input__password"
                          placeholder={t('view.user.detail_list.password')}
                          autocomplete="off"
                          type="password"
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
                <Col span={3}></Col>
              </Row>
              <div
                className="submit pt-2"
                style={{
                  textAlign: 'center'
                }}
              >
                <Button className="mr-1" onClick={confirm}>
                  {t('view.map.button_cancel')}
                </Button>

                <Button
                  type="primary"
                  htmlType="submit "
                  className="buttonAddUser"
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

export default withRouter(AddUser);
