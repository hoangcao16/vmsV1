import React from 'react'
import { Radio, Image } from "antd";
import styled from "styled-components";
import { STYLE_MODE } from '../common/vms/constans/map';
import dark from '../../assets/img/icons/map/dark.svg'
import light from '../../assets/img/icons/map/light.svg'
import snow from '../../assets/img/icons/map/snow.svg'
import Icon from '@ant-design/icons'
import './ControlMapStyles.scss'



const MapStyleWrapper = styled.div`
position: absolute;
top: 20px;
left: 50%;
transform: translateX(-50%);
z-index: 100;
`;

const ControlMapStyles = (props) => {
  const { onChange } = props;
  return (
    <MapStyleWrapper className='map__style'>
      <Radio.Group onChange={onChange}>
        <Radio.Button value={STYLE_MODE.dark}>
          <Image src={dark} preview={false} />
        </Radio.Button>
        <Radio.Button value={STYLE_MODE.normal}>
          <Image src={light} preview={false} />
        </Radio.Button>
      </Radio.Group>
    </MapStyleWrapper>
  )
}

export default ControlMapStyles
