import React, { useEffect, useState } from 'react';
import { TimePicker, DatePicker, Tooltip } from 'antd';
import moment from 'moment';
import PlayControl from "./PlayControl";
import locale from 'antd/lib/locale/vi_VN';
import '../commonStyle/commonDatePicker.scss'
import '../commonStyle/commonTimePicker.scss';
import PlaybackSpeed from "./playbackSpeed/PlaybackSpeed";
import Clock from "react-digital-clock";
import { isEmpty } from 'lodash-es'


const PlaybackMenuTool = ({
    playbackCameraSeekTypeCallback,
    playbackCameraSeekTimeCallback,
    pauseOrPlayCallback,
    playbackChangeSpeedCallback,
    resetSpeed,
    curSpeed
}) => {
    const [seekToDate, setSeekToDate] = useState(null);
    const [seekToTime, setSeekToTime] = useState(null);
    const [needToPlayImmediately, setNeedToPlayImmediately] = useState(false)
    const onDateChange = (date, dateString) => {
        let now = isEmpty(dateString) ? null : moment(dateString)
        setSeekToDate(isEmpty(now) ? null : moment(now, 'YYYY-MM-DD'))
        setSeekToTime(null)
    }
    const onTimeChange = (time, timeString) => {
        setSeekToTime(isEmpty(timeString) ? null : moment(timeString, 'HH:mm:ss'))
        if (seekToDate) {
            setNeedToPlayImmediately(true)
            const seekDateTime = moment(seekToDate.format('YYYY-MM-DD').toString() + "T" + timeString).unix()
            playbackCameraSeekTimeCallback(seekDateTime)
        }
    }

    return (
        <div className="playback-menu-tool">
            <div className="playback-menu-tool__datetime play-control__left">
                <DatePicker
                    dropdownClassName="playback-menu-tool__date" locale={locale}
                    value={seekToDate}
                    defaultValue={moment('20-09-2021', 'DD-MM-YYYY')}
                    onChange={onDateChange}
                />
                <TimePicker
                    popupClassName="playback-menu-tool__time"
                    locale={locale}
                    onChange={onTimeChange}
                    value={seekToTime}
                />
            </div>
            <PlayControl playbackCameraSeekTypeCallback={playbackCameraSeekTypeCallback}
                pauseOrPlayCallback={pauseOrPlayCallback}
            />
            <div className='play-control__right'>
                <Clock className="slider__markers-currentTime" />
                <PlaybackSpeed
                    playbackChangeSpeedCallback={playbackChangeSpeedCallback} resetSpeed={resetSpeed}
                    curSpeed={curSpeed}
                />
            </div>

        </div>
    )
};

export default PlaybackMenuTool;