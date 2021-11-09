import themeConfig from '../../../configs/themeConfig';

const customizerReducer = (state = themeConfig, action) => {
  console.log('action.type:', action.type, action);
  switch (action.type) {
    case 'CHANGE_MODE':
      return { ...state, theme: action.mode };
    case 'CHANGE_ZOOM':
      return { ...state, zoom: action.zoom };
    case 'COLLAPSE_SIDEBAR':
      return { ...state, sidebarCollapsed: action.value };
    case 'CHANGE_NAVBAR_COLOR':
      return { ...state, navbarColor: action.color };
    case 'CHANGE_NAVBAR_TYPE':
      return { ...state, navbarType: action.style };
    case 'CHANGE_FOOTER_TYPE':
      return { ...state, footerType: action.style };
    case 'CHANGE_MENU_COLOR':
      return { ...state, menuTheme: action.style };
    case 'HIDE_SCROLL_TO_TOP':
      return { ...state, hideScrollToTop: action.value };
    case 'CHANGE_AVATAR':
      return  { ...state, changeAvatar: action.changeAvatar };
    default:
      return state;
  }
};

export default customizerReducer;
