import styled from "styled-components";
import { Modal, Input } from "antd";
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
