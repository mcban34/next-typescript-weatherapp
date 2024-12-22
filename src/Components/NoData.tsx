import React from 'react'
import { Nodata } from '../types/index'

const NoData: React.FC<Nodata> = ({ text }) => {
    return (
        <div className='mt-5 text-center bg-white/10 backdrop-blur-md p-3 rounded-md'>
            {text}
        </div>
    )
}

export default NoData