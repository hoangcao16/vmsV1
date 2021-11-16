import React, { useState } from 'react';
import { DatePicker, TimePicker } from "antd";
import locale from "antd/lib/locale/vi_VN";
import moment from "moment";
import '../commonStyle/commonDatePicker.scss';
import '../commonStyle/commonTimePicker.scss';
import { useTranslation } from 'react-i18next';


const PlaybackDateTimeSelection = (props) => {
    const { t } = useTranslation();
    const { playbackCameraSeekTimeCallback } = props;
    const [seekToDate, setSeekToDate] = useState(null);
    const [seekToTime, setSeekToTime] = useState(null);

    const onDateChange = (date, dateString) => {
        let now = moment(dateString)
        setSeekToDate(moment(now, 'YYYY-MM-DD'))
        setSeekToTime(null)
    }
    const onTimeChange = (time, timeString) => {
        setSeekToTime(moment(timeString, 'HH:mm:SS'))
        if (seekToDate) {
            const seekDateTime = moment(seekToDate.format('YYYY-MM-DD').toString() + "T" + timeString).unix()
            playbackCameraSeekTimeCallback(seekDateTime)
        }
    }
    return (
        <div className="playbackDateTime">
            <DatePicker dropdownClassName="playback-menu-tool__date" locale={locale} value={seekToDate}
                defaultValue={moment('2021-09-20', 'YYYY-MM-DD')}
                placeholder={t('view.maps.select_date')}
                onChange={onDateChange} />
            <TimePicker popupClassName="playback-menu-tool__time" locale={locale} onChange={onTimeChange} placeholder={t('view.maps.select_time')}
                value={seekToTime} />
        </div>
    )
}


export default PlaybackDateTimeSelection;