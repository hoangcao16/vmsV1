import React, { lazy, Suspense } from 'react';
import { connect } from 'react-redux';
import { Redirect, Route, Router, Switch } from 'react-router-dom';
import Spinner from './components/@vuexy/spinner/Loading-spinner';
import { history } from './history';
import { ContextLayout } from './utility/context/Layout';
import { FORM_MAP_ITEM } from './view/common/vms/constans/map';


// Route-based code splitting














const Alerts = lazy(() => import('./components/reactstrap/alerts/Alerts'));
const Buttons = lazy(() => import('./components/reactstrap/buttons/Buttons'));
const Breadcrumbs = lazy(() =>
  import('./components/reactstrap/breadcrumbs/Breadcrumbs')
);

const Carousel = lazy(() =>
  import('./components/reactstrap/carousel/Carousel')
);
const Collapse = lazy(() =>
  import('./components/reactstrap/collapse/Collapse')
);
const Dropdowns = lazy(() =>
  import('./components/reactstrap/dropdowns/Dropdown')
);
const ListGroup = lazy(() =>
  import('./components/reactstrap/listGroup/ListGroup')
);
const Modals = lazy(() => import('./components/reactstrap/modal/Modal'));

const NavComponent = lazy(() =>
  import('./components/reactstrap/navComponent/NavComponent')
);
const Navbar = lazy(() => import('./components/reactstrap/navbar/Navbar'));
const Tabs = lazy(() => import('./components/reactstrap/tabs/Tabs'));
const TabPills = lazy(() =>
  import('./components/reactstrap/tabPills/TabPills')
);
const Tooltips = lazy(() =>
  import('./components/reactstrap/tooltips/Tooltips')
);
const Popovers = lazy(() =>
  import('./components/reactstrap/popovers/Popovers')
);
const Badge = lazy(() => import('./components/reactstrap/badge/Badge'));
const BadgePill = lazy(() =>
  import('./components/reactstrap/badgePills/BadgePill')
);
const Progress = lazy(() =>
  import('./components/reactstrap/progress/Progress')
);
const Media = lazy(() => import('./components/reactstrap/media/MediaObject'));
const Spinners = lazy(() =>
  import('./components/reactstrap/spinners/Spinners')
);
const Toasts = lazy(() => import('./components/reactstrap/toasts/Toasts'));

const chips = lazy(() => import('./components/@vuexy/chips/Chips'));
const divider = lazy(() => import('./components/@vuexy/divider/Divider'));
const vuexyWizard = lazy(() => import('./components/@vuexy/wizard/Wizard'));










// const accountSettings = lazy(() =>
//   import('./views/pages/account-settings/AccountSettings')
// );




const Import = lazy(() => import('./extensions/import-export/Import'));
const Export = lazy(() => import('./extensions/import-export/Export'));
const ExportSelected = lazy(() =>
  import('./extensions/import-export/ExportSelected')
);
const Camera = lazy(() => import('./view/camera/index'));
const CameraGroup = lazy(() => import('./view/camera/TableCameraGroup'));

const Files = lazy(() => import('./view/storage/files/TableStorage'));
const ClearSetting = lazy(() =>
  import('./view/storage/clear-setting/TableClearSetting')
);
const ExportEventFile = lazy(() =>
  import('./view/storage/export-event-file/ExportEventFile')
);
const HardDriveList = lazy(() =>
  import('./view/storage/hard-drive-list/TableHardDriveList')
);
const RecordSetting = lazy(() =>
  import('./view/storage/record-setting/TableRecordSetting')
);
// const ThreshSaveSetting = lazy(() =>
//   import('./view/storage/store-setting/StoreSetting')
// );
const StoreSetting = lazy(() =>
  import('./view/storage/store-setting/StoreSetting')
);
const Scan = lazy(() => import('./view/camera/TableCameraScan'));

const NVR = lazy(() => import('./view/commonDevice/nvr/TableNVR'));
const Playback = lazy(() =>
  import('./view/commonDevice/playback/TablePlayback')
);
const Camproxy = lazy(() =>
  import('./view/commonDevice/camproxy/TableCamproxy')
);
const Setting = lazy(() => import('./view/setting/TableSetting'));
const ptzMan = lazy(() => import('./view/ptz-man/TablePtzManager'));

const Monitoring = lazy(() => import('./view/monitoring/TableMonitoring'));
const Event = lazy(() => import('./view/event/TableEvent'));
const Alert = lazy(() => import('./view/alert/TableAlert'));
const Zone = lazy(() => import('./view/commonDevice/zone/TableZone'));
const DeviceManage = lazy(() => import('./view/commonDevice/DeviceManage'));
const Category = lazy(() => import('./view/category/TableCategory'));
const SettingAccount = lazy(() => import('./view/user/Setting'));
const TableHumans = lazy(() => import('./view/ai-humans/TableHumans'));
const Config = lazy(() => import('./view/ai-config/Config'));

const Login = lazy(() => import('./views/pages/authentication/login/Login'));
const forgotPassword = lazy(() =>
  import('./views/pages/authentication/ForgotPassword')
);
const lockScreen = lazy(() =>
  import('./views/pages/authentication/LockScreen')
);
const resetPassword = lazy(() =>
  import('./views/pages/authentication/ResetPassword')
);
const register = lazy(() =>
  import('./views/pages/authentication/register/Register')
);


const Live = lazy(() => import('./view/live/Live'));
const Maps = lazy(() => import('./view/maps/Maps'));
const Preset = lazy(() => import('./view/preset/Preset'));
const Report = lazy(() => import('./view/report/Report'));
const Infor = lazy(() => import('./view/infor/InforUserDetails'));
// const Notification = lazy(() => import('./view/notification/Notification'));

// Set Layout and Component Using App Route
const RouteConfig = ({ component: Component, fullLayout, ...rest }) => (
  <Route
    {...rest}
    render={(props) => {
      return (
        <ContextLayout.Consumer>
          {(context) => {
            let LayoutTag =
              fullLayout === true
                ? context.fullLayout
                : context.state.activeLayout === 'horizontal'
                  ? context.horizontalLayout
                  : context.VerticalLayout;
            return (
              <LayoutTag {...props} permission={props.user}>
                <Suspense fallback={<Spinner />}>
                  <Component {...props} />
                </Suspense>
              </LayoutTag>
            );
          }}
        </ContextLayout.Consumer>
      );
    }}
  />
);
const mapStateToProps = (state) => {
  return {
    user: state.auth.login.userRole
  };
};

const AppRoute = connect(mapStateToProps)(RouteConfig);

class AppRouter extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    sessionStorage.removeItem(FORM_MAP_ITEM);
    return (
      // Set the directory path if you are deploying in sub-folder
      <Router history={history}>
        <Switch>
          <AppRoute exact path="/" component={Report} />

          <AppRoute
            path="/email"
            exact
            component={() => <Redirect to="/email/inbox" />}
          />
          <AppRoute
            path="/todo"
            exact
            component={() => <Redirect to="/todo/all" />}
          />


          <AppRoute path="/components/alerts" component={Alerts} />
          <AppRoute path="/components/buttons" component={Buttons} />
          <AppRoute path="/components/breadcrumbs" component={Breadcrumbs} />
          <AppRoute path="/components/carousel" component={Carousel} />
          <AppRoute path="/components/collapse" component={Collapse} />
          <AppRoute path="/components/dropdowns" component={Dropdowns} />
          <AppRoute path="/components/list-group" component={ListGroup} />
          <AppRoute path="/components/modals" component={Modals} />
          <AppRoute path="/components/nav-component" component={NavComponent} />
          <AppRoute path="/components/navbar" component={Navbar} />
          <AppRoute path="/components/tabs-component" component={Tabs} />
          <AppRoute path="/components/pills-component" component={TabPills} />
          <AppRoute path="/components/tooltips" component={Tooltips} />
          <AppRoute path="/components/popovers" component={Popovers} />
          <AppRoute path="/components/badges" component={Badge} />
          <AppRoute path="/components/pill-badges" component={BadgePill} />
          <AppRoute path="/components/progress" component={Progress} />
          <AppRoute path="/components/media-objects" component={Media} />
          <AppRoute path="/components/spinners" component={Spinners} />
          <AppRoute path="/components/toasts" component={Toasts} />


          <AppRoute path="/extra-components/chips" component={chips} />
          <AppRoute path="/extra-components/divider" component={divider} />
          <AppRoute path="/forms/wizard" component={vuexyWizard} />




          {/*<AppRoute*/}
          {/*  path="/pages/account-settings"*/}
          {/*  component={accountSettings}*/}
          {/*/>*/}

          <AppRoute path="/pages/login" component={Login} fullLayout />
          <AppRoute path="/pages/register" component={register} fullLayout />
          <AppRoute
            path="/pages/forgot-password"
            component={forgotPassword}
            fullLayout
          />
          <AppRoute
            path="/pages/lock-screen"
            component={lockScreen}
            fullLayout
          />
          <AppRoute
            path="/pages/reset-password"
            component={resetPassword}
            fullLayout
          />


          <AppRoute path="/app/camera/list" component={Camera} />
          <AppRoute path="/app/camera_group/list" component={CameraGroup} />
          <AppRoute path="/app/storage/list" component={Files} />
          <AppRoute
            path="/app/storage/clear-setting"
            component={ClearSetting}
          />
          <AppRoute
            path="/app/storage/export-event-file"
            component={ExportEventFile}
          />
          <AppRoute
            path="/app/storage/hard-drive-list"
            component={HardDriveList}
          />
          <AppRoute
            path="/app/storage/record-setting"
            component={RecordSetting}
          />
          <AppRoute
            path="/app/storage/store-setting"
            component={StoreSetting}
          />
          <AppRoute path="/app/nvr/list" component={NVR} />
          <AppRoute path="/app/playback/list" component={Playback} />
          <AppRoute path="/app/camproxy/list" component={Camproxy} />
          <AppRoute path="/setting" component={Setting} />
          <AppRoute path="/app/ptz-man/list" component={ptzMan} />
          <AppRoute path="/app/zone/list" component={Zone} />
          <AppRoute path="/app/device-manage/list" component={DeviceManage} />
          <AppRoute path="/app/category/list" component={Category} />
          <AppRoute path="/app/setting" component={SettingAccount} />
          {/*<AppRoute path="/app/map" component={MapViewOnline} />*/}
          <AppRoute path="/app/live" component={Live} />
          <AppRoute path="/app/maps" component={Maps} />
          <AppRoute path="/monitoring" component={Monitoring} />
          <AppRoute path="/event" component={Event} />
          <AppRoute path="/alert" component={Alert} />

          <AppRoute path="/extensions/import" component={Import} />
          <AppRoute path="/extensions/export" component={Export} />
          <AppRoute
            path="/extensions/export-selected"
            component={ExportSelected}
          />
          <AppRoute path="/app/preset" component={Preset} />
          <AppRoute path="/app/report" component={Report} />
          <AppRoute path="/app/infor" component={Infor} />
          <AppRoute path="/app/setting/scan" component={Scan} />
          <AppRoute path="/humans/list" component={TableHumans} />
          <AppRoute path="/ai-config" component={Config} />
        </Switch>
      </Router>
    );
  }
}

export default AppRouter;
