import { LinkOutlined } from '@ant-design/icons';
import { Card, Form, Select } from 'antd';
import { isEmpty } from 'lodash-es';
import React, { useEffect, useState } from 'react';
import { useHistory, useLocation, useRouteMatch } from 'react-router-dom';
import { reactLocalStorage } from 'reactjs-localstorage';
import UserApi from '../../../../actions/api/user/UserApi';
import Notification from '../../../../components/vms/notification/Notification';
import '../../../commonStyle/commonAuto.scss';
import '../../../commonStyle/commonSelect.scss';
import './RoleUser.scss';
import { useTranslation } from "react-i18next";


const formItemLayout = {
  wrapperCol: { span: 24 },
  labelCol: { span: 24 }
};

const RoleUser = (props) => {
  const { t } = useTranslation();

  const [form] = Form.useForm();

  const { handleReload } = props;

  const [allRoles, setAllRoles] = useState([]);
  const [roles, setRoles] = useState([]);

  const history = useHistory();
  let { path } = useRouteMatch();

  const location = useLocation();

  useEffect(() => {
    const data = {
      filter: '',
      page: 1,
      size: ''
    };

    UserApi.getAllRole(data).then((result) => {
      setAllRoles(result?.payload.sort(compare));
    });

    UserApi.getGroupByUser({ uuid: props.id }).then((result) => {
      // const data = [...result.roles];

      setRoles(result.roles);
    });
  }, [props?.reload]);

  const detailLink = async (id) => {
    history.push(`/app/setting/account/roles/detail/${id}`);
  };

  const render = (name, id) => {
    reactLocalStorage.setObject('tabIndex', 3);
    return (
      <div className="role__item">
        <span className="roll__item--name">{name}</span>

        <LinkOutlined
          onClick={(e) => {
            e.stopPropagation();
            detailLink(id);
          }}
        />
      </div>
    );
  };

  const onChange = async (value) => {
    const update = await UserApi.setRoleForUser({
      user_uuid: props?.id,
      role_uuids: value
    });

    if (update) {
      handleReload();
      const notifyMess = {
        type: 'success',
        title: '',
        description: 'Cập nhật thành công'
      };
      Notification(notifyMess);
    }
  };

  function compare(a, b) {
    if (a.name < b.name) {
      return -1;
    }
    if (a.name > b.name) {
      return 1;
    }
    return 0;
  }

  let roleUuidArr = [];

  if (!isEmpty(roles)) {
    roleUuidArr = roles.map((r) => r.role_uuid);
    form.setFieldsValue({ role_uuid: roleUuidArr });
  }

  if (!isEmpty(allRoles) && isEmpty(roles)) {
    form.setFieldsValue({ role_uuid: [] });
  }

  return (
    <div className="detail-user--role">
      <Card className="cardRole">
        <h4>{t('R')}</h4>

        {!isEmpty(allRoles) ? (
          <Form form={form} {...formItemLayout} initialValues={roleUuidArr}>
            <Form.Item name={['role_uuid']}>
              <Select
                mode="multiple"
                style={{ width: '100%' }}
                options={allRoles.map((g) => ({
                  value: g.uuid,
                  label: render(g.name, g.uuid)
                }))}
                onChange={(e) => onChange(e)}
                bordered={false}
                showSearch={true}
              />
            </Form.Item>
          </Form>
        ) : null}
      </Card>
    </div>
  );
};

export default RoleUser;
