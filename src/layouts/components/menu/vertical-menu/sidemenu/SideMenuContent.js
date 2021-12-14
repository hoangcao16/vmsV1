import { Select, Tooltip } from "antd";
import classnames from "classnames";
import { isEmpty } from "lodash";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { reactLocalStorage } from "reactjs-localstorage";
import ExportEventFileApi from "../../../../../actions/api/exporteventfile/ExportEventFileApi";
import eventActive from "../../../../../assets/img/icons/menu-bar/active/event.png";
import { default as presetActive } from "../../../../../assets/img/icons/menu-bar/active/infor.png";
import {
  default as mapActive,
  default as vietmapActive,
} from "../../../../../assets/img/icons/menu-bar/active/map.png";
import reportActive from "../../../../../assets/img/icons/menu-bar/active/report.png";
import settingActive from "../../../../../assets/img/icons/menu-bar/active/setting.png";
import viewActive from "../../../../../assets/img/icons/menu-bar/active/view.png";
import event from "../../../../../assets/img/icons/menu-bar/inactive/event.png";
import { default as preset } from "../../../../../assets/img/icons/menu-bar/inactive/infor.png";
import {
  default as map,
  default as vietmap,
} from "../../../../../assets/img/icons/menu-bar/inactive/map.png";
import report from "../../../../../assets/img/icons/menu-bar/inactive/report.png";
import setting from "../../../../../assets/img/icons/menu-bar/inactive/setting.png";
import view from "../../../../../assets/img/icons/menu-bar/inactive/view.png";
import navigationConfig from "../../../../../configs/navigationConfig";
import NotificationBadge from "./NotificationBadge";
import "./SideMenuContent.scss";
const { Option } = Select;

const LANGUAGES = {
  vn: "vn",
  en: "en",
};

const SideMenuContent = (props) => {
  const { setLanguage } = props;
  const { i18n } = useTranslation();
  const [avatarUrl, setAvatarUrl] = useState("");

  const language = reactLocalStorage.get("language");

  useEffect(() => {
    const user = reactLocalStorage.getObject("user");

    if (!isEmpty(user?.avatar_file_name)) {
      ExportEventFileApi.getAvatar(user?.avatar_file_name).then((result) => {
        if (result.data) {
          let blob = new Blob([result.data], { type: "octet/stream" });
          let url = window.URL.createObjectURL(blob);
          setAvatarUrl(url);
        } else {
          setAvatarUrl("");
        }
      });
    }
  }, [props?.isChangeAvatar]);

  const iconInActive = {
    view: view,
    map: map,
    maps: vietmap,
    event: event,
    preset: preset,
    report: report,
    infor: avatarUrl,
    setting: setting,
  };
  const iconActive = {
    view: viewActive,
    map: mapActive,
    maps: vietmapActive,
    event: eventActive,
    preset: presetActive,
    report: reportActive,
    infor: avatarUrl,
    setting: settingActive,
  };
  // Loop over sidebar items

  const refreshPage = ()=>{     window.location.reload();  }

  const onChangLanguage = (e) => {
    const value = e.target.value
    setMultilanguageForElement(
      ".add_camera",
      "Thêm Camera",
      "Add Camera",
      value
    );
    setMultilanguageForElement(
      ".add_location",
      "Thêm địa điểm",
      "Add location",
      value
    );
    setMultilanguageForElement(
      ".delete_this_tracking_location",
      "Xóa địa điểm theo dõi này",
      "Delete this tracking location",
      value
    );
    setMultilanguageForElement(
      ".delete_all_tracking_location",
      "Xóa tất cả địa điểm theo dõi",
      "Delete all tracking location",
      value
    );
    setMultilanguageForElement(
      ".add_tracking_location",
      "Thêm địa điểm theo dõi",
      "Add tracking location",
      value
    );

    setLanguage && setLanguage(value);
    reactLocalStorage.set("language", value);
    i18n.changeLanguage(value);
    refreshPage()
  };

  const setMultilanguageForElement = (elm, valVn, valEn, lang) => {
    const existElm = document.querySelector(elm);
    if (existElm) {
      if (lang === "vn") {
        existElm.innerHTML = valVn;
      } else {
        existElm.innerHTML = valEn;
      }
    }
  };

  const menuItemsTop = navigationConfig.map((item, index) => {
    if (index < 4) {
      let renderItem = (
        <li className={classnames("nav-item", `${item.id}`)} key={item.id}>
          <Link to={item.navLink} key={item.id}>
            <Tooltip
              placement='right'
              title={language == "en" ? `${item.id}` : `${item.title}`}
              arrowPointAtCenter={true}
              overlayStyle={{ position: 'fixed' }}
            >
              <div
                className={classnames(
                  "menu-text",
                  { active: item.navLink === props.activeItemState },
                  { inActive: item.navLink !== props.activeItemState },
                  `${item.id}`
                )}

                style={{
                  backgroundImage: `url(${item.navLink === props.activeItemState
                    ? iconActive[`${item.id}`]
                    : iconInActive[`${item.id}`]
                    })`,
                  backgroundSize: `${item.navLink === props.activeItemState
                    ? "5.4rem 5.4rem"
                    : "4rem 4rem"
                    }`,
                }}
              ></div>
            </Tooltip>
          </Link>
        </li>
      );
      return renderItem;
    }
    return;
  });
  const menuItemsBottom = navigationConfig.map((item, index) => {
    if (index >= 4) {
      let renderItem = (
        <li className={classnames('nav-item', `${item.id}`)} key={item.id}>
          {item.id === 'notification' ? (
            <div>
              <NotificationBadge />
            </div>
          ) : (
            <Link to={item.navLink} key={item.id}>
              <Tooltip
                placement='right'
                title={language == "en" ? `${item.id}` : `${item.title}`}
                arrowPointAtCenter={true}
                overlayStyle={{ position: 'fixed' }}

              >
                <div
                  className={classnames(
                    "menu-text",
                    { active: item.navLink === props.activeItemState },
                    { inActive: item.navLink !== props.activeItemState },
                    `${item.id}`
                  )}
                  style={{
                    backgroundImage: `url(${item.navLink === props.activeItemState
                      ? iconActive[`${item.id}`]
                      : iconInActive[`${item.id}`]
                      })`,
                    backgroundSize: `${item.navLink === props.activeItemState
                      ? "54px 54px"
                      : "40px 40px"
                      }`,
                  }}
                ></div>
              </Tooltip>
            </Link>
          )}
        </li>
      );
      return renderItem;
    }
    return;
  });
  return (
    <React.Fragment>
      <div className='menu__items--top'>{menuItemsTop}</div>
      <div className='menu__items--bottom'>
        {menuItemsBottom}
        <div className='select--language'>
          <Tooltip
            placement='right'
            title={language == "en" ? "Language" : "Ngôn ngữ"}
            arrowPointAtCenter={true}
            overlayStyle={{ position: 'fixed' }}

          >
            <select
              defaultValue={reactLocalStorage.get("language") || LANGUAGES.vn}
              onChange={onChangLanguage}
            // dropdownClassName='dropdown__select--language'
            >
              <option value={LANGUAGES.vn}>{LANGUAGES.vn}</option>
              <option value={LANGUAGES.en}>{LANGUAGES.en}</option>
            </select>
          </Tooltip>
        </div>
      </div>
    </React.Fragment >
  );
};

const mapStateToProps = (state) => {
  return {
    isZoom: state.customizer.customizer.zoom,

    isChangeAvatar: state.customizer.customizer.changeAvatar,
  };
};
export default connect(mapStateToProps)(SideMenuContent);
