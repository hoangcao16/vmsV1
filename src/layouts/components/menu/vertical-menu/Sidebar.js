import classnames from 'classnames';
import React, { Component } from 'react';
import Hammer from 'react-hammerjs';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { removeAllPlayBackHlsLive } from '../../../../redux/actions/live';
import { removeAllCamLiveOnMap } from '../../../../redux/actions/map/camLiveAction';
import { resetMapObject } from '../../../../redux/actions/map/formMapActions';
import { ContextLayout } from '../../../../utility/context/Layout';
import { CAM_LIVE_ITEMS, FORM_MAP_ITEM } from '../../../../view/common/vms/constans/map';
import SidebarHeader from './SidebarHeader';
import SideMenuContent from './sidemenu/SideMenuContent';
class Sidebar extends Component {
  static getDerivedStateFromProps(props, state) {
    if (props.activePath !== state.activeItem) {
      sessionStorage.removeItem(FORM_MAP_ITEM);
      sessionStorage.removeItem(CAM_LIVE_ITEMS);
      props.resetMapObject();
      props.removeAllCamLiveOnMap();
      props.listCamLive.length > 0 && props.listCamLive.forEach((cam) => {
        cam && cam.hls && cam.hls.destroy()
      })
      props.listPlayBackHls.length > 0 && props.listPlayBackHls.forEach((cam) => {
        cam && cam.hls && cam.hls.destroy()
      })
      props.removeAllCamLiveOnMap();
      return {
        activeItem: props.activePath
      };
    }
    // Return null if the state hasn't changed
    return null;
  }
  state = {
    width: window.innerWidth,
    activeIndex: null,
    hoveredMenuItem: null,
    activeItem: this.props.activePath,
    menuShadow: false,
    ScrollbarTag: PerfectScrollbar
  };


  mounted = false;

  updateWidth = () => {
    if (this.mounted) {
      this.setState((prevState) => ({
        width: window.innerWidth
      }));
      this.checkDevice();
    }
  };

  componentDidMount() {
    this.mounted = true;
    if (this.mounted) {
      if (window !== 'undefined') {
        window.addEventListener('resize', this.updateWidth, false);
      }
      this.checkDevice();
    }
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  checkDevice = () => {
    var prefixes = ' -webkit- -moz- -o- -ms- '.split(' ');
    var mq = function (query) {
      return window.matchMedia(query).matches;
    };

    if ('ontouchstart' in window || window.DocumentTouch) {
      this.setState({
        ScrollbarTag: 'div'
      });
    } else {
      this.setState({
        ScrollbarTag: PerfectScrollbar
      });
    }
    var query = ['(', prefixes.join('touch-enabled),('), 'heartz', ')'].join(
      ''
    );
    return mq(query);
  };

  changeActiveIndex = (id) => {
    if (id !== this.state.activeIndex) {
      this.setState({
        activeIndex: id
      });
    } else {
      this.setState({
        activeIndex: null
      });
    }
  };

  handleSidebarMouseEnter = (id) => {
    if (id !== this.state.hoveredMenuItem) {
      this.setState({
        hoveredMenuItem: id
      });
    } else {
      this.setState({
        hoveredMenuItem: null
      });
    }
  };

  handleActiveItem = (url) => {
    this.setState({
      activeItem: url
    });
  };

  render() {
    let {
      sidebarVisibility,
      activeTheme,
      activePath,
      sidebarState,
      currentLang,
      permission,
      currentUser,
      isZoom,
      setLanguage
    } = this.props;

    let {  activeIndex, hoveredMenuItem, activeItem } =
      this.state;


    return (
      <ContextLayout.Consumer>
        {(context) => {
          let dir = context.state.direction;
          return (
            <React.Fragment>
              <div
                className={classnames(
                  `main-menu menu-fixed menu-light menu-accordion menu-shadow theme-${activeTheme}`,
                  { collapsed: sidebarState === true }
                )}
                style={{ width: isZoom ? 0 : null }}
              // onMouseEnter={() => sidebarHover(false)}
              // onMouseLeave={() => sidebarHover(true)}
              >
                <SidebarHeader />
                <div
                  className='main-menu-content'
                >
                  <Hammer
                    onSwipe={() => {
                      sidebarVisibility();
                    }}
                    direction={
                      dir === 'rtl' ? 'DIRECTION_RIGHT' : 'DIRECTION_LEFT'
                    }
                  >
                    <ul className="navigation navigation-main">
                      <SideMenuContent
                        setActiveIndex={this.changeActiveIndex}
                        activeIndex={activeIndex}
                        hoverIndex={hoveredMenuItem}
                        handleSidebarMouseEnter={this.handleSidebarMouseEnter}
                        activeItemState={activeItem}
                        handleActiveItem={this.handleActiveItem}
                        activePath={activePath}
                        lang={currentLang}
                        permission={permission}
                        currentUser={currentUser}
                        collapsedMenuPaths={false}
                        toggleMenu={false}
                        deviceWidth={this.props.deviceWidth}
                        setLanguage={setLanguage}
                      />
                    </ul>
                  </Hammer>
                </div>
              </div>
            </React.Fragment>
          );
        }}
      </ContextLayout.Consumer>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    currentUser: state.auth.login.userRole,
    isZoom: state.customizer.customizer.zoom,
    listCamLive: state.map.camsLive.listCamLive,
    listPlayBackHls: state.live.listPlayBack
  };
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    { removeAllCamLiveOnMap, resetMapObject, removeAllPlayBackHlsLive },
    dispatch
  );
};
export default connect(mapStateToProps, mapDispatchToProps)(Sidebar);
