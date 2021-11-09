import ReactHlsPlayer from "react-hls-player";
import React from "react";

const HlsPlayer = ({playerVideo, playerSrc, duration}) => {
    // console.log(">>>>> HlsPlayer rendered");
    let maxBufferLength = 60;
    if (duration && duration > 0) maxBufferLength = duration;
    console.log(">>>>> HlsPlayer -> maxBufferLength:", maxBufferLength);
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
    // console.log(">>>>> prevHls.playerSrc:", prevHls.playerSrc);
    // console.log(">>>>> nextHls.playerSrc:", nextHls.playerSrc);
    return prevHls.playerSrc === nextHls.playerSrc;
}

export const MemoizedHlsPlayer = React.memo(HlsPlayer, hlsPlayerPropsAreEqual);