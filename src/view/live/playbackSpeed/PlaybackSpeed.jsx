import React from "react";
import { ChevronDown, ChevronUp } from "react-feather";
import { useTranslation } from "react-i18next";
import { MAX_SPEED, MIN_SPEED } from "../../common/vms/constans/playback";
import "./PlaybackSpeed.scss";

const PlaybackSpeed = (props) => {
  const { t } = useTranslation();
  const { playbackChangeSpeedCallback, curSpeed } = props;
  // const [speed, setSpeed] = useState(NORMAL_SPEED);
  // useEffect(() => {
  // setSpeed(NORMAL_SPEED)
  // }, [resetSpeed])
  const handleSpeedUp = () => {
    if (curSpeed * 2 >= MAX_SPEED) {
      playbackChangeSpeedCallback(MAX_SPEED);
    } else {
      playbackChangeSpeedCallback(curSpeed * 2);
    }
  };
  const handleSpeedDown = () => {
    if (curSpeed / 2 <= MIN_SPEED) {
      playbackChangeSpeedCallback(MIN_SPEED);
    } else {
      playbackChangeSpeedCallback(curSpeed / 2);
    }
  };
  return (
    <div className="speed">
      <span className="speed__title">{t("view.user.detail_list.speed")}</span>
      <div className="speed__value">{curSpeed}X</div>
      <div className="speed__control">
        <ChevronUp onClick={handleSpeedUp} />
        <ChevronDown onClick={handleSpeedDown} />
      </div>
    </div>
  );
};

export default PlaybackSpeed;
