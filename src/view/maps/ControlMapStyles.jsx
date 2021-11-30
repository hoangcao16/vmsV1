import { Image, Radio, Tooltip } from "antd";
import React from "react";
import styled from "styled-components";
import dark from "../../assets/img/icons/map/dark.svg";
import light from "../../assets/img/icons/map/light.svg";
import { STYLE_MODE } from "../common/vms/constans/map";
import "./ControlMapStyles.scss";
import { useTranslation } from "react-i18next";

const MapStyleWrapper = styled.div`
  position: absolute;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 100;
`;

const ControlMapStyles = (props) => {
  const { onChange } = props;
  const { t } = useTranslation();

  return (
    <MapStyleWrapper className="map__style">
      <Radio.Group onChange={onChange}>
        <Radio.Button value={STYLE_MODE.dark}>
          <Tooltip
            placement="top"
            title={t("view.user.detail_list.dark_mode")}
            arrowPointAtCenter={true}
          >
            <Image src={dark} preview={false} />
          </Tooltip>
        </Radio.Button>
        <Radio.Button value={STYLE_MODE.normal}>
          <Tooltip
            placement="top"
            title={t("view.user.detail_list.light_mode")}
            arrowPointAtCenter={true}
          >
            <Image src={light} preview={false} />
          </Tooltip>
        </Radio.Button>
      </Radio.Group>
    </MapStyleWrapper>
  );
};

export default ControlMapStyles;
