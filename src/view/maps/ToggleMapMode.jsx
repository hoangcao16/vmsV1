import React from 'react'
import styled from "styled-components";
import { Button, Image } from "antd";
import snow from '../../assets/img/icons/map/snow.svg'
import './ToggleMapMode.scss'

const EditModeStyle = styled.div`
position: absolute;
top: 20px;
right: 300px;
z-index: 100;
`;

const ToggleMapMode = (props) => {
  const { toggleEditMode, editMode } = props;
  return (
    <EditModeStyle className="map__edit-mode">
      <Button
        onClick={toggleEditMode}
        className={editMode ? "btn-active" : ""}
      >
        <Image preview={false} src={snow} />
      </Button>
    </EditModeStyle>
  )
}

export default ToggleMapMode
