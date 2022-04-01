/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from 'react'
import MapboxDraw from '@mapbox/mapbox-gl-draw'
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css'
import mapboxgl from 'vietmaps-gl'
import _ from 'lodash'
import {
  CircleMode,
  DirectMode,
  DragCircleMode,
  SimpleSelectMode,
} from 'mapbox-gl-draw-circle'
import Notification from '../../../../components/vms/notification/Notification'

import {
  CAM_LIVE_ITEMS,
  FORM_MAP_ITEM,
  LAT_LNG,
  MAP_STYLES,
  NAVIGATION_CONTROL,
  STYLE_MODE,
  TRACKING_POINTS,
  TYPE_CONTEXT_MENU,
  TYPE_FORM_ACTION_ON_MAP,
} from '../../../common/vms/constans/map'
import { useTranslation } from 'react-i18next'
import { AdminisUnitIconSvg } from '../../../maps/icons/adminisUnit.icon'
import { NOTYFY_TYPE } from '../../../common/vms/Constant'
import { cameraGreenIconSvg } from '../../../map/camera-green.icon'
import { cameraRedIconSvg } from '../../../map/camera-red.icon'
import { svg } from '../../../map/camera.icon'

const PreviewMap = ({ data, fileCurrent }) => {
  const { t } = useTranslation()
  const mapboxRef = useRef(null)
  const mapBoxDrawRef = useRef(null)
  const mapCamMarkersRef = useRef([])
  const mapAdUnitMarkersRef = useRef([])
  const [currentLan, setCurrentLan] = useState(null)
  const zoom = 14
  const image = new Image()
  const adminisUinitIcon = new Image()
  const cameraRedIcon = new Image()
  const cameraGreenIcon = new Image()
  image.src = 'data:image/svg+xml;charset=utf-8;base64,' + btoa(svg)
  adminisUinitIcon.src =
    'data:image/svg+xml;charset=utf-8;base64,' + btoa(AdminisUnitIconSvg)
  cameraRedIcon.src =
    'data:image/svg+xml;charset=utf-8;base64,' + btoa(cameraRedIconSvg)
  cameraGreenIcon.src =
    'data:image/svg+xml;charset=utf-8;base64,' + btoa(cameraGreenIconSvg)
  const renderCameraIcon = (cam) => {
    if (cam.source === 1) {
      return cameraGreenIcon.src
    }
    if (cam.recordingStatus === 0) {
      return cameraRedIcon.src
    }
    return image.src
  }
  //khởi tạo map
  const createNewMarker = (data) => {
    console.log('data', data)
    if (_.inRange(data.lat_, -90, 90)) {
      var elem = document.querySelector('.map-camera-marker-node')
      if (elem) {
        elem.remove()
      }
      const el = document.createElement('div')
      el.className = 'map-camera-marker-node'
      const img = document.createElement('img')
      img.setAttribute('data-imgCamId', data.id)
      img.src = renderCameraIcon(data)
      el.appendChild(img)
      const mapCardNode = document.createElement('div')
      mapCardNode.className = 'map-popup-node  map-camera-popup-node'
      const marker = new mapboxgl.Marker({ element: el, draggable: true })
        .setLngLat([data.long_, data.lat_])
        .addTo(mapboxRef.current)
      marker.on('dragend', () => {
        Notification({
          type: NOTYFY_TYPE.warning,
          title: `${t('noti.view_mode')}`,
          description: `${t('noti.cannot_update_in_this_mode')}`,
        })
      })

      mapCamMarkersRef.current && (mapCamMarkersRef.current = marker)
      mapboxRef.current.resize()
      mapboxRef.current.flyTo({
        center: [data?.long_, data?.lat_],
      })
    }
  }
  const showViewMap = () => {
    try {
      mapboxgl.accessToken = process.env.REACT_APP_VIETMAP_TOKEN
      if (!mapboxRef.current) {
        //khởi tạo map
        mapboxRef.current = new mapboxgl.Map({
          container: 'map',
          style: MAP_STYLES[STYLE_MODE.normal],
          hash: true,
          center: currentLan ? currentLan : LAT_LNG,
          zoom: zoom,
          attributionControl: false,
        })

        //thêm phần thanh công cụ zoom
        mapboxRef.current.addControl(
          new mapboxgl.NavigationControl({
            showCompass: false,
            showZoom: true,
          }),
          NAVIGATION_CONTROL
        )

        mapBoxDrawRef.current = new MapboxDraw({
          displayControlsDefault: false,
          userProperties: true,
          // defaultMode: "direct_select ",
          clickBuffer: 10,
          touchBuffer: 10,
          modes: {
            ...MapboxDraw.modes,
            draw_circle: CircleMode,
            simple_select: SimpleSelectMode,
            direct_select: DirectMode,
            drag_circle: DragCircleMode,
          },
        })

        // Add this draw object to the map when map loads
        // thêm phần control cho map: kéo, xoay map
        mapboxRef.current.addControl(mapBoxDrawRef.current)

        // mapboxRef.current.on('draw.create', (e) => notifyParent(e))
        // mapboxRef.current.on('draw.update', (e) => notifyParent(e))
        // mapboxRef.current.on('draw.delete', (e) => notifyParent(e))
      }
    } catch (error) {
      console.log(error)
    }
  }
  const calRatioZoom = (marker, currentZoom) => {
    const scalePercent = 1 + (currentZoom - 8) * 0.4
    console.log(marker.getElement())
    const svgElement = marker.getElement().children[0]
    svgElement.style.transform = `scale(${scalePercent})`
    svgElement.style.transformOrigin = 'bottom'
  }
  const handleControlZoomMarker = () => {
    const currentZoom = mapboxRef.current.getZoom()
    mapCamMarkersRef.current &&
      calRatioZoom(mapCamMarkersRef.current, currentZoom)
    mapAdUnitMarkersRef.current &&
      mapAdUnitMarkersRef.current.forEach((marker) => {
        calRatioZoom(marker, currentZoom)
      })
  }
  useEffect(() => {
    showViewMap()
    mapboxRef.current &&
      mapboxRef.current.on('zoom', function () {
        handleControlZoomMarker()
      })
  }, [])
  useEffect(() => {
    setCurrentLan([data.long_, data.lat_])
    createNewMarker(data)
  }, [fileCurrent, data])
  return (
    <>
      <div key='map' id='map' className='view-map-preview'></div>
    </>
  )
}
export default PreviewMap
