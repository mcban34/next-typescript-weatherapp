export interface District {
    id: number;
    name: string;
    population: number;
    area: number;
}

export interface Province {
    id: number;
    name: string;
    districts: District[];
}

export interface Neighborhood {
    id: number;
    name: string;
    district_id: number;
}

export interface FindLocationData {
    setfindWeatherData: React.Dispatch<any>
    setLoading: React.Dispatch<React.SetStateAction<boolean>>
}

export interface ResultData {
    weatherData: any
}

export interface Nodata {
    text: string
}

export interface SearchLocayionData {
    searchWeatherData: any
    setSearchWeatherData: React.Dispatch<any>
    searchQuery: string,
    setSearchQuery: React.Dispatch<React.SetStateAction<string>>
    setLoading: React.Dispatch<React.SetStateAction<boolean>>
}

export interface LocationState {
    provinces: Province[];
    selectedProvince: Province | null;
    districts: District[];
    selectedDistrict: District | null;
    neighborhoods: Neighborhood[];
    selectedNeighborhood: Neighborhood | null;
    isLoadingDistricts: boolean;
    isLoadingNeighborhoods: boolean;
}

export interface WeatherResponse {
    city: string
    result: any[]
    success: boolean
    message?: string
}