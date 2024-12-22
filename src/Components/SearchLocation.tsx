import React from 'react';
import { SearchLocayionData } from '../types/index'
import { toast } from 'react-toastify';

import { fetchWeatherData } from '../services/api'

const SearchLocation: React.FC<SearchLocayionData> = ({ setSearchWeatherData, searchQuery, setSearchQuery, setLoading }) => {
    const getWeatherData = async () => {
        setLoading(true)
        const response = await fetchWeatherData(searchQuery);
        if (response.success) {
            setSearchWeatherData(response.result);
            setLoading(false)
        }
        else {
            toast.error(response.message)
            setLoading(false)
        }
    }

    const handleSearchWeather = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            getWeatherData()
        }
    };

    return (
        <div>
            <form onSubmit={handleSearchWeather} className="flex gap-2">
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Arama Yapınız..."
                    className="flex-1 border border-gray-200 rounded-lg px-3 text-gray-500 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                    type="submit"
                    disabled={!searchQuery.trim()}
                    className={`px-4 py-2 rounded-lg text-white font-medium transition-all duration-200
                    ${searchQuery.trim()
                            ? 'bg-green-600 hover:bg-green-700'
                            : 'bg-gray-400 cursor-not-allowed'}`}
                >
                    Ara
                </button>
            </form>
        </div>
    );
};

export default SearchLocation;