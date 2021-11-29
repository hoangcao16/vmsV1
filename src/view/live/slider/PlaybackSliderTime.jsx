import moment from "moment";
import React, { useEffect, useRef, useState } from 'react';
import { Minus, Plus } from 'react-feather';
import { WithoutTimeSecond2 } from "../../../utility/vms/timer";
import './PlaybackSliderTime.scss';

// const initialMarkers = [...Array.from({ length: 20 }, (_, i) => i - 10)]
const STEP = 10;
const PlaybackSliderTime = ({ playbackByDragSlideTime, dateTimeSeek }) => {
    // const [value, setValue] = React.useState([0, 100]);
    const [marks, setMarks] = React.useState([]);
    let [stepSize, setStepSize] = React.useState(10);
    const itemsRef = useRef([]);
    // const [seekTime, setSeekTime] = useState(moment('2021-09-24 08:15:31'));
    const [currentDateTime, setcurrentDateTime] = useState(moment());
    const [realtimeCurrentDateTime, setRealTimeCurrentDateTime] = useState(moment());
    const [zoomLevel, setZoomLevel] = useState(60);
    const oldOffset = useRef();
    useEffect(() => {
        dragElement(document.getElementById("slider__mask"));
        generateMarkers(currentDateTime);
        setRealTimeCurrentDateTime(currentDateTime)
    }, [currentDateTime, zoomLevel]);
    useEffect(() => {
    }, []);

    useEffect(() => {
        setcurrentDateTime(moment(dateTimeSeek * 1000)); //dateTimeSeek is in seconds
    }, [dateTimeSeek]);

    const renderMarkers = () => {
        return (
            marks.map((item, idx) => (
                <div data-transform={item.style.transform} style={{
                    height: `${item.style.height}`,
                    transform: `translateX(${item.style.transform}px)`,
                }}
                    key={idx}
                    className={`slider__marker ${item.className}`}
                    ref={el => itemsRef.current[idx] = el}
                >
                    <span className="slider__marker-hour">{item.hourLabel}</span>
                    <span className="slider__marker-date">{item.dateLabel}</span>

                </div>
            ))
        )
    }

    const getWidthBoxTimeline = () => {
        const bboxSliders = document.getElementById("slider__markers")?.getBoundingClientRect();
        const slidersWidth = bboxSliders.width;
        return slidersWidth;
    }

    const generateMarkers = (currentDateTime) => {
        var stepTimeSeconds = zoomLevel * 60 * 1000; //1 hour
        const slidersWidth = getWidthBoxTimeline();
        setcurrentDateTime(currentDateTime)
        // calculate startTime and lastTime
        const startTime = currentDateTime - STEP * stepTimeSeconds
        const lastTime = currentDateTime + STEP * stepTimeSeconds
        const delta = lastTime - startTime;
        let markers = []
        let timeLeft = WithoutTimeSecond2(currentDateTime.unix()).getTime()
        let timeRight = timeLeft + stepTimeSeconds
        let timeLeftCnt = 0
        while (timeLeft >= startTime) {
            let date = ''
            const hour = moment(timeLeft).format('HH:mm:ss')
            if (hour.startsWith("00") || hour.startsWith("06") || hour.startsWith("12") || hour.startsWith("18")) {
                date = moment(timeLeft).format('DD/MM/YY')
            } else {
                date = ''
            }
            markers.push({
                hourLabel: moment(timeLeft).format('HH:mm'),
                dateLabel: date,
                id: --timeLeftCnt,
                className: `slider__marker`,
                style: {
                    // left: (timeLeft - startTime) * 100 / delta + '%',
                    transform: ((timeLeft - startTime) / delta) * slidersWidth,
                    height: '50%',
                }
            })
            timeLeft = timeLeft - stepTimeSeconds
        }

        let timeRightCnt = 0
        while (timeRight <= lastTime) {
            let date = ''
            const hour = moment(timeRight).format('HH:mm:ss')
            if (hour.startsWith("00") || hour.startsWith("06") || hour.startsWith("12") || hour.startsWith("18")) {
                date = moment(timeRight).format('DD/MM/YY')
            } else {
                date = ''
            }
            markers.push({
                hourLabel: moment(timeRight).format('HH:mm'),
                dateLabel: date,
                id: ++timeRightCnt,
                className: `slider__marker`,
                style: {
                    // left: (timeRight - startTime) * 100 / delta + '%',
                    transform: ((timeRight - startTime) / delta) * slidersWidth,
                    height: '50%'
                }
            })

            timeRight = timeRight + stepTimeSeconds
        }
        setMarks(markers)
    }


    function dragElement(elmnt) {
        var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        if (document.getElementById(elmnt.id + "header")) {
            // if present, the header is where you move the DIV from:
            document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
        } else {
            // otherwise, move the DIV from anywhere inside the DIV:
            elmnt.onmousedown = dragMouseDown;
        }

        function dragMouseDown(e) {
            e = e || window.event;
            e.preventDefault();
            // get the mouse cursor position at startup:
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            // call a function whenever the cursor moves:
            document.onmousemove = elementDrag;
        }

        function elementDrag(e) {
            e = e || window.event;
            e.preventDefault();
            // calculate the new cursor position:
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;

            if (pos1 != 0) {
                const listMarkerElm = document.querySelectorAll(".slider__marker");
                listMarkerElm.forEach(item => {
                    item.style.transform = `translateX(${+item.dataset.transform + elmnt.offsetLeft - pos1}px)`;
                    // item.dataset.transform = +item.dataset.transform + elmnt.offsetLeft - pos1;
                })

                const offsetPixel = elmnt.offsetLeft - pos1;
                const currentTimeAfterSeek = calculateSeekTimeTo(offsetPixel, currentDateTime)
                setRealTimeCurrentDateTime(currentTimeAfterSeek)

                elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
                pos3 = e.clientX;
                pos4 = e.clientY;
            }

        }

        const calculateSeekTimeTo = (offsetPixel, fromDateTime) => {
            const slidersWidth = getWidthBoxTimeline();
            const distanceByPerMarker = (offsetPixel) / (slidersWidth / (STEP * 2));
            let currentTimeAfterSeek = fromDateTime;
            if (distanceByPerMarker < 0) {
                currentTimeAfterSeek = moment(currentTimeAfterSeek).subtract(distanceByPerMarker * zoomLevel / 60, 'h')
            } else {
                currentTimeAfterSeek = moment(currentTimeAfterSeek).subtract(distanceByPerMarker * zoomLevel / 60, 'h')
            }
            return currentTimeAfterSeek
        }

        const handleReCalTimeline = (offsetPixel) => {
            const currentTimeAfterSeek = calculateSeekTimeTo(offsetPixel, currentDateTime)
            setcurrentDateTime(currentTimeAfterSeek);
            //Play
            playbackByDragSlideTime(currentTimeAfterSeek.unix());//sedconds
        }

        function closeDragElement(e) {
            // stop moving when mouse button is released:
            e = e || window.event;
            e.preventDefault();
            // calculate the new cursor position:
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            if (oldOffset.current != 0 && oldOffset.current != pos3) {
                const offsetPixel = elmnt.offsetLeft - pos1;
                document.onmouseup = null;
                document.onmousemove = null;
                handleReCalTimeline(offsetPixel)
                oldOffset.current = pos3;
                elmnt.style.left = "0px";
            }
        }
    }

    const handleZoomIn = () => {
        setZoomLevel(zoomLevel / 2);
    }
    const handleZoomOut = () => {
        setZoomLevel(zoomLevel * 2);
    }

    return (
        <div className="row slider-container">

            <div className="slider" id="slider">
                <div id="sliderheader">Zoom</div>
                <div className="slider__markers-seekTime">
                    <span>{realtimeCurrentDateTime.format('HH:mm:ss')} </span>
                </div>
                <div id="slider__markers" className="slider__markers">

                    {
                        renderMarkers()
                    }
                    <div id="slider__mask" className="slider__markers">
                    </div>
                </div>
                <div className="slider__zoom">
                    <span>   <Minus style={{ cursor: 'pointer' }} onClick={handleZoomIn} /></span>
                    <span>   <Plus style={{ cursor: 'pointer' }} onClick={handleZoomOut} /></span>
                </div>
            </div>
        </div>
    )
}
export default PlaybackSliderTime;
