import { WeatherResponse } from '../types/index'

export const fetchWeatherData = async (city: string): Promise<WeatherResponse> => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_WEATHER_URL}?data.lang=tr&data.city=${city}`, {
            headers: {
                'content-type': 'application/json',
                'authorization': `apikey ${process.env.NEXT_PUBLIC_WEATHER_API_KEY}`
            }
        });

        if (!response.ok) {
            throw new Error('Hava durumu verileri alınamadı');
        }

        return response.json()
    } catch (error) {
        throw error
    }
};