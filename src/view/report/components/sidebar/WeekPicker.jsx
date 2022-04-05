import React, { useEffect, useState, useRef } from "react";
import moment from "moment";
import { Dropdown, Input } from "antd";
import { CalendarOutlined } from "@ant-design/icons";
import "./WeekPicker.scss";

moment.locale("en");

const WeekPicker = ({ typeWeek, onChange, disableDate = () => {} }) => {
  let value;
  if (typeWeek === "EndWeek") {
    value = moment();
  } else if (typeWeek === "StartWeek") {
    value = moment().subtract(4, "weeks");
  }
  const [currentYear, setCurrentYear] = useState(
    moment(value).format("YYYY")
  );
  const [currentValue, setCurrentValue] = useState(
    moment(value).format("TW-YYYY")
  );
  const [visible, setVisible] = useState(false);
  const totalWeeks = moment(currentYear, "YYYY").isoWeeksInYear();
  const ref = useRef(null);

  //close dropdown when click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      const parent = ref.current.input.closest(".week-input");
      if (parent && !parent.contains(event.target)) {
        setVisible(false);
      }
    };
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  });

  const handleChangeYear = (diff) => {
    if (diff < 0) {
      setCurrentYear(
        moment(currentYear, "YYYY").subtract(1, "Y").format("YYYY")
      );
    } else {
      setCurrentYear(moment(currentYear, "YYYY").add(1, "Y").format("YYYY"));
    }
  };

  const handleChange = (week) => {
    const parseWeek = moment(`${week}-${currentYear}`, "WW-YYYY");

    if (disableDate(parseWeek)) {
      return;
    }
    setCurrentValue(parseWeek.format("TW-YYYY"));
    // setVisible(!visible);
    onChange && onChange(parseWeek);
  };

  const customClass = (week) => {
    
    let classList = "";
    const parseWeek = moment(`${week}-${currentYear}`, "WW-YYYY");
    
    if (
      moment(currentValue, "TW-YYYY").isoWeek() === week &&
      moment(currentValue, "TW-YYYY").year() === Number(currentYear)
      ) {
        classList += " ant-picker-cell-in-view ant-picker-cell-selected";
    }
    if (disableDate(parseWeek)) {
      classList += " ant-picker-cell-disabled";
    }

    return classList;
  };

  const WeekPanel = () => {
    return (
      <div tabIndex={-1} className="ant-picker-panel">
        <div className="ant-picker-month-panel">
          <div className="ant-picker-header">
            <button
              type="button"
              tabIndex={-1}
              className="ant-picker-header-super-prev-btn"
              onClick={() => handleChangeYear(-1)}
            >
              <span className="ant-picker-super-prev-icon" />
            </button>
            <div className="ant-picker-header-view">{currentYear}</div>
            <button
              type="button"
              tabIndex={-1}
              className="ant-picker-header-super-next-btn"
              onClick={() => handleChangeYear(1)}
            >
              <span className="ant-picker-super-next-icon" />
            </button>
          </div>
          <div className="ant-picker-body ant-picker-body-custom">
            {Array.from(new Array(totalWeeks)).map((_, index) => (
              <div
                className={`ant-picker-cell ${customClass(index + 1)}`}
                onClick={() => {
                  handleChange(index + 1);
                }}
              >
                <div className="ant-picker-cell-inner">{index + 1}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <Dropdown
      visible={visible}
      getPopupContainer={() => document.querySelector(".week-input")}
      overlay={<WeekPanel />}
    >
      <Input
        className="week-input"
        onFocus={() => setVisible(true)}
        ref={ref}
        value={currentValue}
        suffix={<CalendarOutlined />}
      />
    </Dropdown>
  );
};

export default WeekPicker;
