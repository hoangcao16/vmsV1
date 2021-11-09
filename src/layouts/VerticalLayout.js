import { FullscreenExitOutlined, FullscreenOutlined } from "@ant-design/icons";
import { Tooltip } from "antd";
import classnames from "classnames";
import React, { PureComponent } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import Customizer from "../components/@vuexy/customizer/Customizer";
import {
  changeFooterType,
  changeMenuColor,
  changeMode,
  changeNavbarColor,
  changeNavbarType,
  changeZoom,
  collapseSidebar,
  hideScrollToTop,
} from "../redux/actions/customizer/index";
import Footer from "./components/footer/Footer";
import Sidebar from "./components/menu/vertical-menu/Sidebar";
import { reactLocalStorage } from 'reactjs-localstorage';
import { loopHooks } from "react-table";
class VerticalLayout extends PureComponent {
  constructor(props) {
    super(props);
    this.setLanguage = this.setLanguage.bind(this);
  }
  state = {
    width: window.innerWidth,
    sidebarState: this.props.app.customizer.sidebarCollapsed,
    layout: this.props.app.customizer.theme,
    collapsedContent: this.props.app.customizer.sidebarCollapsed,
    sidebarHidden: false,
    currentLang: "en",
    appOverlay: false,
    customizer: false,
    currRoute: this.props.location.pathname,
    language:  reactLocalStorage.get('language'),
  };
  collapsedPaths = [];
  mounted = false;
  updateWidth = () => {
    if (this.mounted) {
      this.setState((prevState) => ({
        width: window.innerWidth,
      }));
    }
  };

  handleCustomizer = (bool) => {
    this.setState({
      customizer: bool,
    });
  };

  componentDidMount() {
    this.mounted = true;
    let {
      location: { pathname },
      app: {
        customizer: { theme, direction },
      },
    } = this.props;

    if (this.mounted) {
      if (window !== "undefined") {
        window.addEventListener("resize", this.updateWidth, false);
      }
      if (this.collapsedPaths.includes(pathname)) {
        this.props.collapseSidebar(true);
      }

      let layout = theme;
      let dir = direction;
      if (dir === "rtl")
        document.getElementsByTagName("html")[0].setAttribute("dir", "rtl");
      else document.getElementsByTagName("html")[0].setAttribute("dir", "ltr");
      return layout === "dark"
        ? document.body.classList.add("dark-layout")
        : layout === "semi-dark"
        ? document.body.classList.add("semi-dark-layout")
        : null;
    }
  }

  setLanguage(value) {
    this.setState({language: value})
  }

  componentDidUpdate(prevProps, prevState) {
    const language = reactLocalStorage.get('language');
    if(prevState.language !== language) {
      this.setState({
        language: language
      })
    }
    let {
      location: { pathname },
      app: {
        customizer: { theme, sidebarCollapsed },
      },
    } = this.props;

    let layout = theme;
    if (this.mounted) {
      if (layout === "dark") {
        document.body.classList.remove("semi-dark-layout");
        document.body.classList.add("dark-layout");
      }
      if (layout === "semi-dark") {
        document.body.classList.remove("dark-layout");
        document.body.classList.add("semi-dark-layout");
      }
      if (layout !== "dark" && layout !== "semi-dark") {
        document.body.classList.remove("dark-layout", "semi-dark-layout");
      }

      if (
        prevProps.app.customizer.sidebarCollapsed !==
        this.props.app.customizer.sidebarCollapsed
      ) {
        this.setState({
          collapsedContent: sidebarCollapsed,
          sidebarState: sidebarCollapsed,
        });
      }
      if (
        prevProps.app.customizer.sidebarCollapsed ===
          this.props.app.customizer.sidebarCollapsed &&
        pathname !== prevProps.location.pathname &&
        this.collapsedPaths.includes(pathname)
      ) {
        this.props.collapseSidebar(true);
      }
      if (
        prevProps.app.customizer.sidebarCollapsed ===
          this.props.app.customizer.sidebarCollapsed &&
        pathname !== prevProps.location.pathname &&
        !this.collapsedPaths.includes(pathname)
      ) {
        this.props.collapseSidebar(true);
      }
    }
  }

  handleCollapsedMenuPaths = (item) => {
    let collapsedPaths = this.collapsedPaths;
    if (!collapsedPaths.includes(item)) {
      collapsedPaths.push(item);
      this.collapsedPaths = collapsedPaths;
    }
  };

  toggleSidebarMenu = (val) => {
    this.setState({
      sidebarState: true,
      collapsedContent: true,
    });
  };

  sidebarMenuHover = (val) => {
    this.setState({
      sidebarState: val,
    });
  };

  handleSidebarVisibility = () => {
    if (this.mounted) {
      if (window !== undefined) {
        window.addEventListener("resize", () => {
          if (this.state.sidebarHidden) {
            this.setState({
              sidebarHidden: !this.state.sidebarHidden,
            });
          }
        });
      }
      this.setState({
        sidebarHidden: !this.state.sidebarHidden,
      });
    }
  };

  componentWillUnmount() {
    this.mounted = false;
  }

  handleCurrentLanguage = (lang) => {
    this.setState({
      currentLang: lang,
    });
  };

  handleAppOverlay = (value) => {
    if (value.length > 0) {
      this.setState({
        appOverlay: true,
      });
    } else if (value.length < 0 || value === "") {
      this.setState({
        appOverlay: false,
      });
    }
  };

  handleAppOverlayClick = () => {
    this.setState({
      appOverlay: false,
    });
  };

  render() {
    const {language} = this.state
    let appProps = this.props.app.customizer;
    let zoom = this.props.app.customizer.zoom;

    console.log("zoom:", zoom);
    let menuThemeArr = [
      "primary",
      "success",
      "danger",
      "info",
      "warning",
      "dark",
    ];
    let sidebarProps = {
      toggleSidebarMenu: true,
      toggle: this.toggleSidebarMenu,
      sidebarState: this.state.sidebarState,
      sidebarHover: this.sidebarMenuHover,
      sidebarVisibility: this.handleSidebarVisibility,
      visibilityState: this.state.sidebarHidden,
      activePath: this.props.match.path,
      collapsedMenuPaths: this.handleCollapsedMenuPaths,
      currentLang: this.state.currentLang,
      activeTheme: appProps.menuTheme,
      collapsed: this.state.collapsedContent,
      permission: this.props.permission,
      deviceWidth: this.state.width,
      setLanguage: this.setLanguage
    };
    let navbarProps = {
      toggleSidebarMenu: this.toggleSidebarMenu,
      sidebarState: this.state.sidebarState,
      sidebarVisibility: this.handleSidebarVisibility,
      currentLang: this.state.currentLang,
      changeCurrentLang: this.handleCurrentLanguage,
      handleAppOverlay: this.handleAppOverlay,
      appOverlayState: this.state.appOverlay,
      navbarColor: appProps.navbarColor,
      navbarType: appProps.navbarType,
    };

    let footerProps = {
      footerType: appProps.footerType,
      hideScrollToTop: appProps.hideScrollToTop,
    };

    let customizerProps = {
      customizerState: this.state.customizer,
      handleCustomizer: this.handleCustomizer,
      changeMode: this.props.changeMode,
      changeNavbar: this.props.changeNavbarColor,
      changeNavbarType: this.props.changeNavbarType,
      changeFooterType: this.props.changeFooterType,
      changeMenuTheme: this.props.changeMenuColor,
      collapseSidebar: this.props.collapseSidebar,
      hideScrollToTop: this.props.hideScrollToTop,
      activeMode: appProps.theme,
      activeNavbar: appProps.navbarColor,
      navbarType: appProps.navbarType,
      footerType: appProps.footerType,
      menuTheme: appProps.menuTheme,
      scrollToTop: appProps.hideScrollToTop,
      sidebarState: appProps.sidebarCollapsed,
    };


    return (
      <div
        className={classnames(
          `wrapper vertical-layout theme-${appProps.menuTheme} menu-collapsed`
        )}
      >
        <Sidebar {...sidebarProps} />
        <div
          className='app-content content'
          style={{ marginLeft: zoom ? 0 : null }}
          onClick={this.handleAppOverlayClick}
        >
          {/*tuanpa comment this line to hide horizontal navbar*/}
          {/*<Navbar {...navbarProps} />*/}
          <div className='content-wrapper'>{this.props.children}</div>
          <div
            className='zoom d-flex align-items-center'
            style={{ bottom: "2vh" }}
            onClick={() => this.props.changeZoom(!zoom)}
          >
            <Tooltip
              placement='topLeft'
              title={language == 'vn' ? (zoom ? "Thoát xem toàn màn hình" : "Xem toàn màn hình") : (zoom ? "Exit fullscreen" : "Fullscreen")}
            >
              {zoom ? <FullscreenExitOutlined /> : <FullscreenOutlined />}
            </Tooltip>

          </div>
        </div>

        <Footer {...footerProps} />
        {appProps.disableCustomizer !== true ? (
          <Customizer {...customizerProps} />
        ) : null}
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    app: state.customizer,
  };
};

export default connect(mapStateToProps, {
  changeMode,
  collapseSidebar,
  changeNavbarColor,
  changeNavbarType,
  changeFooterType,
  changeMenuColor,
  hideScrollToTop,
  changeZoom,
})(VerticalLayout);
