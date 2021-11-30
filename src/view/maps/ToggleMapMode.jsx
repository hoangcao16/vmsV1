import { Button, Image, Tooltip } from "antd";
import React from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import snow from "../../assets/img/icons/map/snow.svg";
import "./ToggleMapMode.scss";

const EditModeStyle = styled.div`
  position: absolute;
  top: 20px;
  right: 300px;
  z-index: 100;
`;

const ToggleMapMode = (props) => {
  const { t } = useTranslation();
  const { toggleEditMode, editMode } = props;
  return (
    <EditModeStyle className="map__edit-mode">
      <Tooltip
        placement="top"
        title={t("view.user.detail_list.edit_mode")}
        arrowPointAtCenter={true}
      >
        <Button
          onClick={toggleEditMode}
          className={editMode ? "btn-active" : ""}
        >
          <Image preview={false} src={snow} />
        </Button>
      </Tooltip>
    </EditModeStyle>
  );
};

export default ToggleMapMode;
