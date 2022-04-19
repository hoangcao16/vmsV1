import React from "react";
import { useTranslation } from "react-i18next";
import {
  BrowserRouter as Router,
  NavLink,
  Route,
  Switch,
  useRouteMatch,
} from "react-router-dom";
import { reactLocalStorage } from "reactjs-localstorage";
import { Card, CardBody, TabContent } from "reactstrap";
import UserApi from "../../actions/api/user/UserApi";
import Notification from "../../components/vms/notification/Notification";
import { history } from "../../history";
import TableHumans from "../ai-humans/TableHumans";
import TableCameraGroup from "../camera/TableCameraGroup";
import TableCameraScan from "../camera/TableCameraScan";
import TableCategory from "../category/TableCategory";
import DeviceManage from "../commonDevice/DeviceManage";
import TableHardDriveList from "../storage/hard-drive-list/TableHardDriveList";
import Config from "../ai-config/Config";
import StoreSetting from "../storage/store-setting/StoreSetting";
import "./../../assets/scss/pages/account-settings.scss";
import ChangePassword from "./ChangePassword";
import "./Setting.scss";
import AdministrativeUnit from "./AdministrativeUnit";
const AI_SOURCE = process.env.REACT_APP_AI_SOURCE;

const Account = React.lazy(() => import("./Account"));

function AccountSettings() {
  const { t } = useTranslation();

  let { path } = useRouteMatch();

  const handleLogout = async () => {
    const isLogout = await UserApi.logout();

    if (isLogout) {
      reactLocalStorage.setObject("view.user", null);
      reactLocalStorage.setObject("permissionUser", null);
      history.push("/pages/login");

      const notifyMess = {
        type: "success",
        title: "",
        description: `${t("noti.logged_out_successfully")}`,
      };
      Notification(notifyMess);
    } else {
      const notifyMess = {
        type: "error",
        title: "",
        description: `${t("noti.logged_out_failed")}`,
      };
      Notification(notifyMess);
    }
  };

  return (
    <Router>
      <div className="nav-vertical">
        <ul className="setting-subtabs">
          <li>
            <NavLink exact to={`${path}`}>
              <span>{t("camera")}</span>
            </NavLink>
          </li>
          <li>
            <NavLink exact to={`${path}/administrative-unit`}>
              <span>{t("view.map.administrative_unit")}</span>
            </NavLink>
          </li>

          <li>
            <NavLink to={`${path}/set`}>
              <span className="d-md-inline-block d-none align-middle ml-1">
                {t("view.user.configuration")}
              </span>
            </NavLink>
          </li>
          {/* <li>
            <NavLink to={`${path}/storage`}>
              <span className="d-md-inline-block d-none align-middle ml-1">
                {t('view.user.archive')}
              </span>
            </NavLink>
          </li> */}
          <li>
            <NavLink to={`${path}/account`}>
              <span className="d-md-inline-block d-none align-middle ml-1">
                {t("view.user.account")}
              </span>
            </NavLink>
          </li>
          <li>
            <NavLink to={`${path}/hard`}>
              <span className="d-md-inline-block d-none align-middle ml-1">
                {t("view.user.hard_drive_list")}
              </span>
            </NavLink>
          </li>
          <li>
            <NavLink to={`${path}/device`}>
              <span className="d-md-inline-block d-none align-middle ml-1">
                {t("view.user.device")}
              </span>
            </NavLink>
          </li>
          <li>
            <NavLink to={`${path}/category`}>
              <span className="d-md-inline-block d-none align-middle ml-1">
                {t("view.user.category_management")}
              </span>
            </NavLink>
          </li>
          <li>
            <NavLink to={`${path}/change-password`}>
              <span className="d-md-inline-block d-none align-middle ml-1">
                {t("view.user.change_password")}
              </span>
            </NavLink>
          </li>
          {AI_SOURCE === "edso" && (
            <>
              <li>
                <NavLink to={`${path}/ai-config`}>
                  <span className="d-md-inline-block d-none align-middle ml-1">
                    {t("view.ai_config.config")}
                  </span>
                </NavLink>
              </li>
              <li>
                <NavLink to={`${path}/humans`}>
                  <span className="d-md-inline-block d-none align-middle ml-1">
                    {t("view.ai_humans.face")}
                  </span>
                </NavLink>
              </li>
            </>
          )}

          <li onClick={handleLogout}>
            <span
              className="d-md-inline-block d-none align-middle ml-1 curson"
              style={{ cursor: "pointer" }}
            >
              {t("view.user.log_out")}
            </span>
          </li>
        </ul>
        <Switch>
          <Route
            exact
            path={path}
            render={() => {
              return (
                <Card className="content">
                  <CardBody>
                    <TabContent>
                      <TableCameraGroup />
                    </TabContent>
                  </CardBody>
                </Card>
              );
            }}
          ></Route>
          <Route
            exact
            path={`${path}/scan`}
            render={() => {
              return (
                <Card className="content">
                  <CardBody>
                    <TabContent>
                      <TableCameraScan />
                    </TabContent>
                  </CardBody>
                </Card>
              );
            }}
          ></Route>
          <Route
            path={`${path}/administrative-unit`}
            render={() => {
              return (
                <Card className="content">
                  <CardBody>
                    <TabContent>
                      <AdministrativeUnit />
                    </TabContent>
                  </CardBody>
                </Card>
              );
            }}
          />

          <Route
            path={`${path}/set`}
            render={() => {
              return (
                <Card className="content">
                  <CardBody>
                    <TabContent>
                      <StoreSetting />
                    </TabContent>
                  </CardBody>
                </Card>
              );
            }}
          />
          {/* <Route
            path={`${path}/storage`}
            render={() => {
              return (
                <Card className="content">
                  <CardBody>
                    <TabContent>
                      <TableStorage />
                    </TabContent>
                  </CardBody>
                </Card>
              );
            }}
          /> */}
          <Route
            path={`${path}/account`}
            render={() => {
              return (
                <Card className="content">
                  <CardBody>
                    <TabContent>
                      <Account />
                    </TabContent>
                  </CardBody>
                </Card>
              );
            }}
          />
          <Route
            path={`${path}/hard`}
            render={() => {
              return (
                <Card className="content">
                  <CardBody>
                    <TabContent>
                      <TableHardDriveList />
                    </TabContent>
                  </CardBody>
                </Card>
              );
            }}
          />
          <Route
            path={`${path}/device`}
            render={() => {
              return (
                <Card className="content">
                  <CardBody>
                    <TabContent>
                      <DeviceManage />
                    </TabContent>
                  </CardBody>
                </Card>
              );
            }}
          />
          <Route
            path={`${path}/category`}
            render={() => {
              return (
                <Card className="content">
                  <CardBody>
                    <TabContent>
                      <TableCategory />
                    </TabContent>
                  </CardBody>
                </Card>
              );
            }}
          />
          <Route
            path={`${path}/ai-config`}
            render={() => {
              return (
                <Card className="content">
                  <CardBody>
                    <TabContent>
                      <Config />
                    </TabContent>
                  </CardBody>
                </Card>
              );
            }}
          />
          <Route
            path={`${path}/humans`}
            render={() => {
              return (
                <Card className="content">
                  <CardBody>
                    <TabContent>
                      <TableHumans />
                    </TabContent>
                  </CardBody>
                </Card>
              );
            }}
          />
          <Route
            path={`${path}/change-password`}
            render={() => {
              return (
                <Card className="content">
                  <CardBody>
                    <TabContent>
                      <ChangePassword />
                    </TabContent>
                  </CardBody>
                </Card>
              );
            }}
          />
        </Switch>
      </div>
    </Router>
  );
}

export default AccountSettings;
