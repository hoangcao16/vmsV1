import styled from 'styled-components'
import Select from 'react-select'
import { Modal } from 'antd'
export const SelectProgessState = styled(Select)`
  .select-progess-state__control {
    background-color: #333333;
    border-color: #464647;
  }
  .select-progess-state__menu {
    background-color: #333333;
    color: #d0e5ff;
  }
  .select-progess-state__option--is-focused {
    background-color: #464647;
  }
  .select-progess-state__single-value {
    color: #d0e5ff;
  }
`
export const ConfirmUpdate = styled(Modal)`
  .ant-btn {
    & > span {
      color: #333333;
    }
  }
  .ant-btn-primary {
    & > span {
      color: #fff !important;
    }
  }
`
