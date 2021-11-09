import React, { useEffect, useState } from "react";
import { ReactComponent as PlusCircleOutlined } from "../../assets/icons/icon-add-blue.svg";
import { ReactComponent as MinusCircleBlue } from "../../assets/icons/icon-sub-blue.svg";
import { ReactComponent as MinusCircleRed } from "../../assets/icons/icon-sub-red.svg";
import { TYPE_CONTEXT_MENU } from "../common/vms/constans/map";

const ContextMenuPopup = (props) => {
  const { onClickFirstItem, onClickSecondItem, mapType, trans: t } = props;
    const [firstContent, setFirstConten] = useState({
    text: "",
    icon: null,
  });
  const [secondContent, setSecondConten] = useState({
    text: "",
    icon: null,
  });

  useEffect(() => {
    
    switch (mapType) {
      case TYPE_CONTEXT_MENU[0]:
        setFirstConten({
          text: <span className="add_camera">{`${t('view.maps.add_camera', { add: t('add'), cam: t('camera') })}`}</span>,
          icon: <PlusCircleOutlined />,
        });
        setSecondConten({
          text: <span className="add_location">{`${t('view.maps.add_location', { add: t('add'), loc: t('location') })}`}</span>,
          icon: <PlusCircleOutlined />,
        });
        break;
      case TYPE_CONTEXT_MENU[1]:
        setFirstConten({
          text: <span className="delete_this_tracking_location">{`${t('view.maps.delete_this_tracking_location', { del: t('delete'), loc: t('location') })}`}</span>,
          icon: <MinusCircleBlue />,
        });
        setSecondConten({
          text: <span className="delete_all_tracking_location">{`${t('view.maps.delete_all_tracking_location', { del: t('delete'), loc: t('location') })}`}</span>,
          icon: <MinusCircleRed />,
        });
        break;
      case TYPE_CONTEXT_MENU[2]:
        setFirstConten({
          text: <span className="add_tracking_location">{`${t('view.maps.add_tracking_location', { add: t('add'), loc: t('location') })}`}</span>,
          icon: <PlusCircleOutlined />,
        });
        setSecondConten({
          text: <span className="delete_all_tracking_location">{`${t('view.maps.delete_all_tracking_location', { del: t('delete'), loc: t('location') })}`}</span>,
          icon: <MinusCircleRed />,
        });
        break;
      default:
        setFirstConten({
          text: <span className="add_camera">{`${t('view.maps.add_camera', { add: t('add'), cam: t('camera') })}`}</span>,
          icon: <PlusCircleOutlined />,
        });
        setSecondConten({
          text: <span className="add_location">{`${t('view.maps.add_location', { add: t('add'), loc: t('location') })}`}</span>,
          icon: <PlusCircleOutlined />,
        });
    }
  }, [mapType]);

  return (
    <>
      <div className="camera-control control-item">
        <a onClick={() => onClickFirstItem(mapType)}>
          {firstContent.icon}
          {firstContent.text}
        </a>
      </div>
      <div className="camera-control control-item">
        <a onClick={() => onClickSecondItem(mapType)}>
          {" "}
          {secondContent.icon}
          {secondContent.text}
        </a>
      </div>
    </>
  );
};

export default ContextMenuPopup;
