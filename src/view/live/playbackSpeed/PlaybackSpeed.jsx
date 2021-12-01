import React, { useEffect, useState } from 'react';
import { ChevronDown, ChevronUp } from "react-feather";
import './PlaybackSpeed.scss'
import { MAX_SPEED, MIN_SPEED, NORMAL_SPEED } from "../../common/vms/constans/playback";

const PlaybackSpeed = (props) => {
    const { resetSpeed, playbackChangeSpeedCallback, curSpeed } = props;
    // const [speed, setSpeed] = useState(NORMAL_SPEED);
    // useEffect(() => {
    // setSpeed(NORMAL_SPEED)
    // }, [resetSpeed])
    const handleSpeedUp = () => {
        if (curSpeed * 2 >= MAX_SPEED) {
            playbackChangeSpeedCallback(MAX_SPEED)
        } else {
            playbackChangeSpeedCallback(curSpeed * 2)
        }

    }
    const handleSpeedDown = () => {
        if (curSpeed / 2 <= MIN_SPEED) {
            playbackChangeSpeedCallback(MIN_SPEED)

        } else {
            playbackChangeSpeedCallback(curSpeed / 2)

        }
    }
    return (
        <div className="speed">
            <span className="speed__title">Tốc độ</span>
            <div className="speed__value">
                {curSpeed}X
            </div>
            <div className="speed__control">
                <ChevronUp onClick={handleSpeedUp} />
                <ChevronDown onClick={handleSpeedDown} />
            </div>
        </div>
    )
}

export default PlaybackSpeed;