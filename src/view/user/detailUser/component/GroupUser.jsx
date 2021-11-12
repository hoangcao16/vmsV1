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
import './GroupUser.scss';
import { useTranslation } from "react-i18next";


const formItemLayout = {
  wrapperCol: { span: 24 },
  labelCol: { span: 24 }
};

const GroupUser = (props) => {
  const { t } = useTranslation();

  const { handleReload } = props;
  const [form] = Form.useForm();

  const [allGroup, setAllGroup] = useState([]);
  const [group, setGroup] = useState([]);
  // const [isLoading, setLoading] = useState(false);

  const history = useHistory();
  let { path } = useRouteMatch();

  const location = useLocation();

  useEffect(() => {
    UserApi.getAllGroup().then((result) => {
      setAllGroup(result?.sort(compare));
    });
    UserApi.getGroupByUser({ uuid: props?.id }).then((result) => {
      setGroup(result?.groups || []);
    });
  }, [props?.reload]);

  const onChange = async (value) => {
    const payload = {
      user_uuid: props?.id,
      group_uuids: value
    };

    const update = await UserApi.setGroupForUser(payload);

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

  const detailLink = async (id) => {
    history.push(`/app/setting/account/group/detail/${id}`);
  };

  const render = (name, id) => {
    reactLocalStorage.setObject('tabIndex', 3);
    return (
      <div className="group-user__item">
        <span className="group-user__item--name">{name}</span>

        <LinkOutlined
          onClick={(e) => {
            e.stopPropagation();
            detailLink(id);
          }}
        />
      </div>
    );
  };

  let groupUuidArr = [];

  if (!isEmpty(group)) {
    groupUuidArr = group.map((r) => r.group_uuid);
    form.setFieldsValue({ group_uuid: groupUuidArr });
  }

  if (!isEmpty(allGroup) && isEmpty(group)) {
    form.setFieldsValue({ group_uuid: [] });
  }

  function compare(a, b) {
    if (a.name < b.name) {
      return -1;
    }
    if (a.name > b.name) {
      return 1;
    }
    return 0;
  }

  return (
    <div className="detail-user--group-user">
      <Card className="cardRole">
        <h4>{t('view.user.user_group', { U: t('U'), g: t('g'), u: t('u'), G: t('G') })}</h4>
        {!isEmpty(allGroup) ? (
          <Form
            className="bg-grey"
            form={form}
            {...formItemLayout}
            initialValues={groupUuidArr}
          >
            <Form.Item name={['group_uuid']}>
              <Select
                mode="multiple"
                style={{ width: '100%' }}
                options={allGroup.map((g) => ({
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

export default GroupUser;
