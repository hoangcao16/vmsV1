import React, {useState, useRef, useEffect} from 'react';
import {FiFastForward, FiPause, FiPlay, FiRewind, FiSkipBack, FiSkipForward} from "react-icons/fi";
import {CaretRightOutlined, PauseOutlined} from '@ant-design/icons'
import ReactHlsPlayer from 'react-hls-player';
import playbackApi from "../../api/playback/cameraApi";
import Hls, {LoaderContext} from "hls.js";
import lionSvcApi from "../../api/lion/cameraApi";
import {SEEK_BACK, SEEK_FORWARD, STEP_SIZE_MINUTE} from '../common/vms/constans/playback'
import styled from 'styled-components';
import PlaybackSpeed from "./playbackSpeed/PlaybackSpeed";

const PlaybackCurrentTime = styled.div`
  color: white;
  font-size: 15px;
`;
const STARTTIME = 1631761260
const STATIC_LINK_TEST = 'http://10.0.0.63:18602/play/hls/d86053c0-8410-4bb1-a4cc-e84998f0e971_611cb14dd601800001a321d1/index.m3u8'
const PlayControl = (props) => {
    const {playbackCameraSeekTypeCallback, pauseOrPlayCallback} = props;
    const [isPlaying, setIsPlaying] = useState(false)
    const [currentPlaybackTime, setCurrentPlaybackTime] = useState(STARTTIME)
    const camUuid = "d86053c0-8410-4bb1-a4cc-e84998f0e971_611cb14dd601800001a321d1"
    const checkDisabled = () => {
    }
    const pauseOrPlay = () => {
        setIsPlaying(!isPlaying)
        pauseOrPlayCallback(isPlaying)
    }
    useEffect(() => {
        // playbackCamera(SEEK_BACK)
    }, []);


    const handleSeekBack = () => {
        playbackCameraSeekTypeCallback(SEEK_BACK)
    }
    const handleSeekForward = () => {
        playbackCameraSeekTypeCallback(SEEK_FORWARD)
    }

    return (
        <div className="playControl">
            <div className={`${checkDisabled() ? 'playIconContainer__disabled' : 'playIconContainer'}`}>
                <FiRewind className="playIcon" onClick={() => {
                }}/>
            </div>
            <div className={`${checkDisabled() ? 'playIconContainer__disabled' : 'playIconContainer'}`}>
                <FiSkipBack className="playIcon" onClick={handleSeekBack}/>
            </div>
            <div className={`${checkDisabled() ? 'playIcon2Container__disabled' : 'playIcon2Container'}`}>
                <div className='control__icon'>
                    {
                        isPlaying ? (<PauseOutlined className="playIcon2" onClick={() => {
                                pauseOrPlay()
                            }}/>)
                            : (<CaretRightOutlined className="playIcon2" onClick={() => {
                                pauseOrPlay()
                            }}/>)
                    }
                </div>
            </div>
            <div className={`${checkDisabled() ? 'playIconContainer__disabled' : 'playIconContainer'}`}>
                <FiSkipForward className="playIcon" onClick={handleSeekForward}/>
            </div>
            <div className={`${checkDisabled() ? 'playIconContainer__disabled' : 'playIconContainer'}`}>
                <FiFastForward className="playIcon" onClick={() => {
                }}/>
            </div>

        </div>
    )
}

export default PlayControl;