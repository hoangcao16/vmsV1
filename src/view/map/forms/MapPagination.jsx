import { StepBackwardOutlined, StepForwardOutlined } from '@ant-design/icons';
import React from 'react';

const MapPagination = ({ handleSelectPreviousPage, handleSelectNextPage, currentPage, totalPage, isLoading }) => {
  const handleNextPage = () => {
    if(totalPage > currentPage) {
      handleSelectNextPage();
    }
  } 
  return (
    <div className="d-flex justify-content-between pagination-wrapper">
      <div className='change__page'>
        <a
          href="#"
          className="camera-list__page-icon"
          onClick={handleSelectPreviousPage}
        >
          <StepBackwardOutlined />
        </a>
        <a
          aria-disabled
          href="#"
          className="camera-list__page-icon"
          onClick={handleNextPage}
        >
          <StepForwardOutlined />
        </a>
      </div>
      <div className="camera-list__page-number">
        {!isLoading ? `${currentPage} / ${totalPage}` : ''}
      </div>
    </div>
  )
}

export default MapPagination
