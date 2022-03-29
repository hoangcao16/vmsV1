import React, { useEffect, useState } from "react";
import moment from "moment";

moment.locale("en");

export default function WeekPanel({ value, setTest, onSelect }) {
  const currentYear = moment(value).format("YYYY");
  const totalWeeks = moment(value).weeksInYear();
  console.log(totalWeeks, currentYear);

  useEffect(() => {}, [value]);

  return (
    <div tabIndex={-1} className="ant-picker-panel">
      <div className="ant-picker-month-panel">
        <div className="ant-picker-header">
          <button
            type="button"
            tabIndex={-1}
            className="ant-picker-header-super-prev-btn"
          >
            <span className="ant-picker-super-prev-icon" />
          </button>
          <div className="ant-picker-header-view">{currentYear}</div>
          <button
            type="button"
            tabIndex={-1}
            className="ant-picker-header-super-next-btn"
          >
            <span className="ant-picker-super-next-icon" />
          </button>
        </div>
        <div className="ant-picker-body ant-picker-body-custom">
          {Array.from(new Array(totalWeeks)).map((_, index) => (
            <div
              className="ant-picker-cell"
              onClick={() => {
                onSelect(moment(`${index + 1}-${currentYear}`, "WW-YYYY"));
              }}
            >
              <div className="ant-picker-cell-inner">{index + 1}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
