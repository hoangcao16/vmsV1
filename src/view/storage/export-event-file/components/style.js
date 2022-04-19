import styled from "styled-components";
import { Modal, Input, Row } from "antd";
import Select from "react-select";

const { TextArea } = Input;
export const StyledTicketModal = styled(Modal)`
  .ant-modal-content {
    background-color: #191919;
    color: #d0e5ff;
  }
  .ant-modal-footer {
    border-top: none;
    padding: 50px 20px;
  }
  .ant-btn {
    & > span {
      color: #333333;
    }
  }
  .ant-btn-primary {
    background-color: #1380ff;
    & > span {
      color: #fff !important;
    }
  }
`;
export const StyledInput = styled.input`
  @media screen {
    background: transparent;
    color: #d0e5ff;
    border: none;
    outline: none;
    letter-spacing: 2px;
    max-width: 140px;
  }
  @media print {
    display: none;
  }
`;
export const StyledSendTicketModal = styled(Modal)`
  .ant-modal-content,
  .ant-modal-header {
    background-color: #191919;
    color: #d0e5ff;
    border-bottom: 1px solid #3c3636;
  }
  .ant-modal-title {
    padding-top: 0 !important;
  }
  .ant-modal-body {
    padding: 24px !important;
  }
  .ant-modal-footer {
    border-top: none;
    padding: 24px 16px 8px 16px;
  }
  font-size: 14px;
  font-weight: 500;
  .ant-radio-group {
    span {
      color: #d0e5ff !important;
    }
  }
  .email-content {
    margin-top: 20px;
  }
  .ant-btn {
    & > span {
      color: #333333;
    }
  }
  .ant-btn-primary {
    background-color: #1380ff;
    & > span {
      color: #fff !important;
    }
  }
`;
export const SendTicketModalHeader = styled.div`
  text-align: center;
  font-size: 22px;
  font-weight: 600;
  color: #d0e5ff;
`;
export const StyledOutSideSelect = styled(Select)`
  .select-outside-system__control {
    background-color: #333333;
    border-color: #464647;
  }
  .select-outside-system__menu {
    background-color: #333333;
    color: #5ab1f1;
  }
  .select-outside-system__option--is-focused {
    background-color: #464647;
  }
  .select-outside-system__single-value {
    color: #5ab1f1;
  }
  .select-outside-system__option {
    padding: 8px 12px;
  }
`;
export const StyledEmailInput = styled(TextArea)`
  &[data-type="error"] {
    border-color: #ff0000 !important;
    box-shadow: 0 0 0 2px #ff181833 !important;
  }
`;
export const ErrorMessage = styled.div`
  padding-top: 4px;
  color: #ff0000;
  font-size: 12px;
`;
export const StyledConfirmSend = styled(Modal)``;
export const StyledEventFileDetail = styled(Row)`
  width: 100%;
  margin-left: 0 !important;
  padding: 12px 20px !important;
  margin-bottom: 12px;
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 14px;
  color: rgba(208, 229, 255, 0.7);
  background-color: #333333;
  .detail-item {
    align-items: center;
    padding: 6px 0;
    min-height: 40px;
    color: #d0e5ff;
  }
  .title {
    font-weight: bold;
    font-size: 16px;
    color: #d0e5ff;
  }
  .err_image {
    margin-top: 8px;
    ul {
      display: flex;
      align-items: center;
      padding-left: 0 !important;
    }
  }
`;
export const TableDetails = styled(Row)`
  width: 100%;
  .ant-table-wrapper {
    width: 100%;
  }
  .ant-table {
    background-color: #333333;
    border: 1px solid rgba(234, 240, 247, 0.1);

    table {
      border-collapse: collapse;
    }

    .ant-table-body {
      &::-webkit-scrollbar {
        width: 8px;
        height: 8px;
      }
      &::-webkit-scrollbar-track {
        background-color: #333333;
        box-shadow: inset 1px 0 #333333;
      }
      &::-webkit-scrollbar-thumb {
        background-color: rgba(208, 229, 255, 0.5);
        // border-radius: 12px;
      }
      &::-webkit-scrollbar-corner {
        background: #333333 !important;
      }
      background: #191919;
    }

    .ant-table-tbody {
      background: #191919;
    }

    .ant-table-tbody > tr.ant-table-placeholder:hover > td {
      background: #191919;
    }

    .ant-empty-description {
      color: rgba(208, 229, 255, 0.7);
    }

    .ant-table-thead .ant-table-cell {
      background-color: #333333;
      padding: 13px 8px 13px 8px;
      color: #e3f0ff;
      border-top: 1px solid rgba(234, 240, 247, 0.1);
      border-bottom: 1px solid rgba(234, 240, 247, 0.1);
      font-weight: 600;
    }

    .ant-table-tbody > tr > td {
      border-bottom: 1px solid rgba(234, 240, 247, 0.1);
      box-sizing: border-box;
      font-style: normal;
      font-weight: 500;
      font-size: 14px;
      line-height: 20px;
      color: rgba(208, 229, 255, 0.7);
    }

    .ant-table-tbody .ant-table-cell {
      padding: 16px 8px 16px 8px;
    }

    .ant-table-tbody .ant-table-cell > span {
      color: rgba(208, 229, 255, 0.7);
    }

    .ant-table-tbody > tr.ant-table-row-level-0:hover > td {
      background: #333333;
      cursor: pointer;
    }

    .ant-table-tbody > tr.selected > td {
      background: #333333;
    }

    .ant-table-cell-fix-left,
    .ant-table-cell-fix-right {
      background: #191919;
    }

    .ant-col > li {
      line-break: anywhere;
    }
  }
  .editable-cell {
    position: relative;
  }

  .editable-cell-value-wrap {
    padding: 5px 12px;
    cursor: pointer;
    min-height: 32px;
    min-width: 290px;
  }
  .ant-table-tbody > tr.selected > td {
    background: #333333;
  }
  .editable-row .editable-cell-value-wrap {
    /* padding: 4px 11px; */
    border: 1px solid transparent;
    border-radius: 8px;
  }
  .editable-row:hover .editable-cell-value-wrap {
    /* padding: 4px 11px; */
    border: 1px solid rgba(234, 240, 247, 0.1);
    border-radius: 8px;
  }
  .ant-form-item-control-input {
    border-radius: 8px;
  }
  .ant-form-item-explain-error {
    padding-top: 4px;
    font-size: 10px;
    min-height: auto;
  }
  .edit-note {
    height: 32px !important;
    &:hover,
    &:focus {
      box-shadow: none !important;
    }
  }
`;
export const ActionButton = styled(Row)`
  width: 100%;
  margin: 2rem 0;
  .ml-8 {
    margin-left: 8px;
  }
  .ant-btn-primary[disabled] {
    background-color: #888 !important;
  }
`;
