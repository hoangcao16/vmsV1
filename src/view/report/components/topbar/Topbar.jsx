import React from 'react';
import './topbar.scss';
import { KeyboardArrowRight } from '@material-ui/icons';

export default function Topbar() {
  return (
    <div className="topbar">
      <div className="topbarTitle">Báo cáo sự kiện</div>
      <div className="topbarIcons">
        <KeyboardArrowRight />
      </div>
    </div>
  );
}
