import { Tabs } from 'antd';
import 'antd/dist/antd.css';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { reactLocalStorage } from 'reactjs-localstorage';
import Breadcrumds from '../breadcrumds/Breadcrumds';
import './Account.scss';
import Group from './GroupIndex';
import User from './index';
import Roles from './RolesIndex';

// import General from './General';
const { TabPane } = Tabs;

const ACCOUNT_TYPE = {
  USER: 1,
  GROUP: 2,
  ROLE: 3
};

function Account(props) {
  const { t } = useTranslation();
  const language = reactLocalStorage.get('language')
  const history = useHistory();
  let { path } = useRouteMatch();
  function callback(key) {
    reactLocalStorage.setObject('tabIndex', key);
    history.push(`${path}`);
  }

  useEffect(() => {
    if (
      language == "vn"
        ? (document.title = "CCTV | Tài khoản")
        : (document.title = "CCTV | Account")
    );
  },[t]);

  return (
    <>
      <Breadcrumds
        url="/app/setting"
        nameParent={t('breadcrumd.setting')}
        nameChild={t('view.user.account')}
      />
      <div className="tabs__container--account">
        <Tabs
          defaultActiveKey={
            reactLocalStorage.getObject('tabIndex') || ACCOUNT_TYPE.USER
          }
          onChange={callback}
          type="card"
          tabBarStyle={{
            width: '100%'
          }}
        >
          <TabPane tab={t('U')} key={ACCOUNT_TYPE.USER}>
            <User />
          </TabPane>
          <TabPane
            tab={t('view.user.user_group', {
              u: t('u'),
              U: t('U'),
              g: t('g'),
              G: t('G')
            })}
            key={ACCOUNT_TYPE.GROUP}
          >
            <Group />
          </TabPane>
          <TabPane tab={t('R')} key={ACCOUNT_TYPE.ROLE}>
            <Roles />
          </TabPane>
        </Tabs>
      </div>
    </>
  );
}

export default Account;
