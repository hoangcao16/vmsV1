import React, {useEffect, useState} from 'react';
import {TimePicker, DatePicker} from 'antd';
import moment from 'moment';
import PlayControl from "./PlayControl";
import locale from 'antd/lib/locale/vi_VN';
import '../commonStyle/commonDatePicker.scss'
import '../commonStyle/commonTimePicker.scss';
import PlaybackSpeed from "./playbackSpeed/PlaybackSpeed";
import Clock from "react-digital-clock";


const PlaybackMenuTool = ({
                              playbackCameraSeekTypeCallback,
                              playbackCameraSeekTimeCallback,
                              pauseOrPlayCallback,
                              playbackChangeSpeedCallback,
                              resetSpeed
                          }) => {
    const [seekToDate, setSeekToDate] = useState(null);
    const [seekToTime, setSeekToTime] = useState(null);
    const [needToPlayImmediately, setNeedToPlayImmediately] = useState(false)
    const onDateChange = (date, dateString) => {
        console.log('onDateChange:', date, dateString);
        let now = moment(dateString)
        setSeekToDate(moment(now, 'YYYY-MM-DD'))
        setSeekToTime(null)
    }
    const onTimeChange = (time, timeString) => {
        console.log('onTimeChange:', time, timeString);
        setSeekToTime(moment(timeString, 'HH:mm:ss'))
        if (seekToDate) {
            setNeedToPlayImmediately(true)
            //play
            console.log('onTimeChange:seekToDate', seekToDate.format('YYYY-MM-DD'));
            const seekDateTime = moment(seekToDate.format('YYYY-MM-DD').toString() + "T" + timeString).unix()
            console.log('onTimeChange:seekDateTime', seekDateTime)
            playbackCameraSeekTimeCallback(seekDateTime)
        }
    }

    return (
        <div className="playback-menu-tool">
            <div className="playback-menu-tool__datetime play-control__left">
                <DatePicker dropdownClassName="playback-menu-tool__date" locale={locale} value={seekToDate}
                            defaultValue={moment('2021-09-20', 'YYYY-MM-DD')}
                            onChange={onDateChange}/>
                <TimePicker popupClassName="playback-menu-tool__time" locale={locale} onChange={onTimeChange}
                            value={seekToTime}/>
            </div>
            <PlayControl playbackCameraSeekTypeCallback={playbackCameraSeekTypeCallback}
                         pauseOrPlayCallback={pauseOrPlayCallback}
            />
            <div className='play-control__right'>
                <Clock className="slider__markers-currentTime"/>
                <PlaybackSpeed playbackChangeSpeed={playbackChangeSpeedCallback} resetSpeed={resetSpeed}/>
            </div>

        </div>
    )
};

export default PlaybackMenuTool;