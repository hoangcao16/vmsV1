import React from "react";

const ItemControl = ({ onSelectType, item, typeActive }) => {
  return (
    <button
      className={`menu-control-container__left__item ${
        item.type === typeActive ? "active" : ""
      }`}
      onClick={() => onSelectType(item.type)}
    >
      {item.name}
      {item.icon}
    </button>
  );
};

export default ItemControl;
