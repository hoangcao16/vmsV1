import Select from "react-select";
import React from "react";
import styled from "styled-components";
const SelectType = ({ value, onChange, option }) => {
  return (
    <>
      <SelectWrapper
        options={option}
        value={value}
        onChange={onChange}
        classNamePrefix="select-type"
        className="react-select"
      ></SelectWrapper>
    </>
  );
};
export default SelectType;
const SelectWrapper = styled(Select)`
  margin-left: 1rem;
  flex: 1;
  max-width: 200px;
  .select-type__control {
    min-height: 12px;
    background-color: #333333;
    border-color: #464647;
    .select-type__value-container {
      padding: 2px 8px;
    }
    .select-type__placeholder {
      margin-left: 2px;
      margin-right: 2px;
    }
    .select-type__indicators {
      .select-type__dropdown-indicator {
        padding: 0;
      }
    }
  }
  .select-type__menu {
    background-color: #333333;
    color: #d0e5ff;
  }
  .select-type__option--is-focused {
    background-color: #464647;
  }
  .select-type__single-value {
    color: #d0e5ff;
  }
  .select-type__option {
    padding: 8px 12px;
  }
`;
