import React from 'react'

const Loading = () => {
    return (
        <div className='flex items-center justify-center absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2'>
            <span className='text-xs'>Yükleniyor.</span>
            <span className="w-24 h-24 absolute animate-ping inline-flex rounded-full bg-white/70 opacity-75"></span>
            <span className="w-24 h-24 absolute inline-flex rounded-full bg-white/30 opacity-75"></span>
        </div>
    )
}

export default Loading