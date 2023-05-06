import React from 'react'
import './loading.scss';
import { AiOutlineLoading } from 'react-icons/ai'
const LoadingBox = props => {
  return (
    <div className="loading">
      <i className="fas fa-spinner fa-spin"></i>
      <div className="spin">
        <AiOutlineLoading />
      </div>
      Loading...
    </div>
)
}

export default LoadingBox
