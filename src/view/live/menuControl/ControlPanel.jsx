import React from 'react'
import {
  Button,
  Image,
} from "antd";
import {
  LeftOutlined,
  RightOutlined,
  UpOutlined,
  DownOutlined,
} from "@ant-design/icons";
import Slider from "../../../components/vms/Slider";
import controlIcon from "../../../assets/img/icons/preset/control.png";
import './ControlPanel.scss'
const controlPanel = ({ onPanLeftStart, onPanLeftEnd, onPanRightStart, onPanRightEnd, onTiltUpStart, onTiltUpEnd, onTiltDownStart, onTiltDownEnd, onZoomInStart, onZoomInEnd, onZoomOutStart, onZoomOutEnd, onChangeSlider, zoomPercent }) => {


  return (
    <div className='control-panel-wrapper' >
      <div className='control-panel'>
        <div className='control-panel__direction'>
          <Button
            className='left'
            icon={<LeftOutlined />}
            onMouseDown={onPanLeftStart}
            onMouseUp={onPanLeftEnd}
          />
          <Button
            className='right'
            icon={<RightOutlined />}
            onMouseDown={onPanRightStart}
            onMouseUp={onPanRightEnd}
          />
          <Button
            className='up'
            icon={<UpOutlined />}
            onMouseDown={onTiltUpStart}
            onMouseUp={onTiltUpEnd}
          />
          <Button
            className='down'
            icon={<DownOutlined />}
            onMouseDown={onTiltDownStart}
            onMouseUp={onTiltDownEnd}
          />
          <div className="control-panel__direction__circle">
            <img src={controlIcon} />
          </div>
        </div>
      </div>
      <div className='control-panel__zoom'>
        <div className="control-panel__zoom__top">
          <span>
            Zoom
          </span>
          <span>
            {zoomPercent}%
          </span>
        </div>
        <Slider onChange={onChangeSlider} value={zoomPercent} />
      </div>
    </div>
  )
}

export default controlPanel
