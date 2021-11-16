import ReactHlsPlayer from "react-hls-player";
import React from "react";

const HlsPlayer = ({ playerVideo, playerSrc, duration }) => {
    let maxBufferLength = 60;
    if (duration && duration > 0) maxBufferLength = duration;
    return (
        <ReactHlsPlayer
            src={playerSrc}
            autoPlay={false}
            controls={true}
            width="100%"
            height="100%"
            playerRef={playerVideo}
            hlsConfig={{
                startPosition: -1,
                maxBufferLength: maxBufferLength,
            }}
        />
    );
}

function hlsPlayerPropsAreEqual(prevHls, nextHls) {
    return prevHls.playerSrc === nextHls.playerSrc;
}

export const MemoizedHlsPlayer = React.memo(HlsPlayer, hlsPlayerPropsAreEqual);