import styled from 'styled-components'
import Select from 'react-select'
export const SelectProgessState = styled(Select)`
  .select-progess-state__control {
    background-color: #333333;
    border-color: #464647;
  }
  .select-progess-state__menu {
    background-color: #333333;
    color: #5ab1f1;
  }
  .select-progess-state__option--is-focused {
    background-color: #464647;
  }
  .select-progess-state__single-value {
    color: #5ab1f1;
  }
`
