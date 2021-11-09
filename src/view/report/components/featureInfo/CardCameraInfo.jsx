import React from 'react';
import './CardCameraInfo.scss';
import { Videocam } from '@material-ui/icons';

export default function CardCameraInfo(props) {
  return (

      <div className={`CardItem ${props?.color}`}>
        <div className="CardItemWrapper">
          <Videocam className="CardItemWrapper__icons" />
          <span className="CardItemWrapper__title">{props?.name}</span>
        </div>
        <div className="CardItemWrapper__number">{props?.total}</div>
    </div>
  );
}
