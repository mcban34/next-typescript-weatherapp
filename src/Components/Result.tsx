import React from 'react'
import { ResultData } from '../types/index'

const Result: React.FC<ResultData> = ({ weatherData }) => {
    return (
        <div>
            <div className="mt-4 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {weatherData.map((day: any, index: number) => (
                        <div key={index} className=" rounded-lg p-4 relative hover:shadow-md transition-shadow backdrop-blur-sm bg-white/5">
                            <img src={day.icon} width={50} className='absolute right-3 top-4' alt="" />
                            <h3 className="font-medium text-lg mb-2">{day.day}</h3>
                            <div className="space-y-1">
                                <p className="text-2xl font-bold">{day.degree}°C</p>
                                <div className="text-sm text-gray-400">
                                    <p>Nem: {day.humidity}%</p>
                                    {day.min && day.max && (
                                        <p>
                                            Min: {day.min}°C / Max: {day.max}°C
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Result