import styled from 'styled-components'
import { Modal } from 'antd'
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
`
export const Input = styled.input`
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
`
