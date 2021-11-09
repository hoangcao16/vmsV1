import React, {useEffect, useState} from 'react';
import {ChevronDown, ChevronUp} from "react-feather";
import './PlaybackSpeed.scss'
import {MAX_SPEED, MIN_SPEED, NORMAL_SPEED} from "../../common/vms/constans/playback";

const PlaybackSpeed = (props) => {
    const {resetSpeed, playbackChangeSpeed} = props;
    const [speed, setSpeed] = useState(NORMAL_SPEED);
    useEffect(() => {
        setSpeed(NORMAL_SPEED)
    }, [resetSpeed])
    const handleSpeedUp = () => {
        if (speed * 2 >= MAX_SPEED) {
            setSpeed(MAX_SPEED);
        } else {
            setSpeed(speed * 2);
        }
        playbackChangeSpeed(speed)
    }
    const handleSpeedDown = () => {
        if (speed / 2 <= MIN_SPEED) {
            setSpeed(MIN_SPEED);
        } else {
            setSpeed(speed / 2);
        }
        playbackChangeSpeed(speed)
    }
    return (
        <div className="speed">
            <span className="speed__title">Speed</span>
            <div className="speed__value">
                {speed}X
            </div>
            <div className="speed__control">
                <ChevronUp onClick={handleSpeedUp}/>
                <ChevronDown onClick={handleSpeedDown}/>
            </div>
        </div>
    )
}

export default PlaybackSpeed;