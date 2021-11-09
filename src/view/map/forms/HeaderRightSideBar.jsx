import React from 'react'
import { useTranslation } from 'react-i18next';

const HeaderRightSideBar = ({toggleCollapsedCameraList}) => {
  const { t } = useTranslation();

    return (
        <div class="camera-list__header">
        <a className="toggle-collapse" onClick={toggleCollapsedCameraList} />
        <h5>
          <i className="app-icon icon-camera-list" /> {t('view.map.camera_list', { cam: t('camera') })}
        </h5>
      </div>
    )
}

export default HeaderRightSideBar
