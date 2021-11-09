import 'antd/dist/antd.css';
import React, { useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import '../../../assets/scss/pages/store-setting.scss';
import Breadcrumds from '../../breadcrumds/Breadcrumds';
import './../../commonStyle/commonCard.scss';
import './../../commonStyle/commonForm.scss';
import './../../commonStyle/commonInput.scss';
import './../../commonStyle/commonModal.scss';
import './../../commonStyle/commonSelect.scss';
import CleanSetting from './CleanSetting';
import EmailConfig from './EmailConfig';
import RecordSetting from './RecordSetting';
import WarningStoreSetting from './WarningStoreSetting';
import { useTranslation } from "react-i18next";
import { reactLocalStorage } from "reactjs-localstorage";

// import {storeSettingWraper} from './variables'

const StoreSetting = (props) => {
  const { t } = useTranslation();
  const language = reactLocalStorage.get("language");

  useEffect(() => {
    if (
      language == "vn"
        ? (document.title = "CCTV | Cấu hình")
        : (document.title = "CCTV | Configuration")
    );
  },[t]);

  return (
    <div>
      <Breadcrumds
        url="/app/setting"
        nameParent={t('breadcrumd.setting')}
        nameChild={t('view.user.configuration')}
      />

      <RecordSetting callOff={props.callOff} />
      <CleanSetting callOff={props.callOff} />
      <WarningStoreSetting callOff={props.callOff} />
      <EmailConfig />
    </div>
  );
};

export default withRouter(StoreSetting);
