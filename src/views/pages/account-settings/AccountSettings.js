import classnames from "classnames"
import React from "react"
import { Info, Instagram, Lock, Settings } from "react-feather"
import {
  Card,
  CardBody, Nav,
  NavItem,
  NavLink, TabContent,
  TabPane
} from "reactstrap"
import "../../../assets/scss/pages/account-settings.scss"
import Breadcrumbs from "../../../components/@vuexy/breadCrumbs/BreadCrumb"
import ChangePassword from "./ChangePassword"
import Account from "./Account"
import InfoTab from "./Info"
import SocialLinks from "./SocialLinks"


class AccountSettings extends React.Component {
  state = {
    activeTab: "1",
    windowWidth: null
  }

  toggle = tab => {
    this.setState({
      activeTab: tab
    })
  }

  updateWidth = () => {
    this.setState({ windowWidth  : window.innerWidth })
  }

  componentDidMount() {
    if(window !== undefined){
      this.updateWidth()
      window.addEventListener("resize", this.updateWidth)
    }
  }
  

  render() {
    let {windowWidth} = this.state
    return (
      <React.Fragment>
        <Breadcrumbs
          breadCrumbTitle="Cài đặt"
          breadCrumbParent="Tài khoản"
          breadCrumbActive="Người dùng"
        />
        <div className={`${windowWidth >= 769 ? "nav-vertical" : "account-setting-wrapper"}`}>
          <Nav className="account-settings-tab nav-left mr-0 mr-sm-3" tabs>
            <NavItem>
              <NavLink
                className={classnames({
                  active: this.state.activeTab === "1"
                })}
                onClick={() => {
                  this.toggle("1")
                }}
              >
                <Settings size={16} />
                <span className="d-md-inline-block d-none align-middle ml-1">Tài khoản</span>
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={classnames({
                  active: this.state.activeTab === "2"
                })}
                onClick={() => {
                  this.toggle("2")
                }}
              >
                <Lock size={16} />
                <span className="d-md-inline-block d-none align-middle ml-1">Camera</span>
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={classnames({
                  active: this.state.activeTab === "3"
                })}
                onClick={() => {
                  this.toggle("3")
                }}
              >
                <Info size={16} />
                <span className="d-md-inline-block d-none align-middle ml-1">Cấu hình</span>
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={classnames({
                  active: this.state.activeTab === "4"
                })}
                onClick={() => {
                  this.toggle("4")
                }}
              >
                <Instagram size={16} />
                <span className="d-md-inline-block d-none align-middle ml-1">Lưu trữ</span>
              </NavLink>
            </NavItem>
          </Nav>
          <Card>
            <CardBody>
              <TabContent activeTab={this.state.activeTab}>
                <TabPane tabId="1">
                  <Account />
                </TabPane>
                <TabPane tabId="2">
                  <ChangePassword />
                </TabPane>
                <TabPane tabId="3">
                  <InfoTab />
                </TabPane>
                <TabPane tabId="4">
                  <SocialLinks />
                </TabPane>
              </TabContent>
            </CardBody>
          </Card>
        </div>
      </React.Fragment>
    )
  }
}

export default AccountSettings
