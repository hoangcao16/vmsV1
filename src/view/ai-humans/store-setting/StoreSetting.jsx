import 'antd/dist/antd.css';
import React from 'react';
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
// import {storeSettingWraper} from './variables'

const StoreSetting = (props) => {
  return (
    <div>
      <Breadcrumds
        url="/app/setting"
        nameParent="Cài đặt"
        nameChild="Cấu hình"
      />

      <RecordSetting callOff={props.callOff} />
      <CleanSetting callOff={props.callOff} />
      <WarningStoreSetting callOff={props.callOff} />
      <EmailConfig />
    </div>
  );
};

export default withRouter(StoreSetting);
