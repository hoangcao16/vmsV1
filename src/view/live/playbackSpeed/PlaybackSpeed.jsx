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
            console.log("speed up a", MAX_SPEED)
            // setSpeed(MAX_SPEED);
            playbackChangeSpeedCallback(MAX_SPEED)
        } else {
            console.log("speed up b", curSpeed * 2)
            // setSpeed(speed * 2);
            playbackChangeSpeedCallback(curSpeed * 2)
        }

    }
    const handleSpeedDown = () => {
        if (curSpeed / 2 <= MIN_SPEED) {
            console.log("speed down", MIN_SPEED)
            // setSpeed(MIN_SPEED);
            playbackChangeSpeedCallback(MIN_SPEED)

        } else {
            console.log("speed down", curSpeed / 2)
            // setSpeed(curSpeed / 2);
            playbackChangeSpeedCallback(curSpeed / 2)

        }
    }
    return (
        <div className="speed">
            <span className="speed__title">Speed</span>
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