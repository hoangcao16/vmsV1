import React from 'react'
import { Slider } from 'antd';

const index = ({onChange, value=30}) => {
    const onChangeSlider = (value) => {
        onChange(value)
    }
    return (
        <Slider value={value}  onChange={onChangeSlider}/>
    )
}

export default index
