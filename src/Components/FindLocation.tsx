import React, { useEffect, useState } from 'react'
import { Combobox } from '@headlessui/react';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import {
    setProvinces,
    setSelectedProvince,
    setDistricts,
    setSelectedDistrict,
    setNeighborhoods,
    setSelectedNeighborhood,
    setLoadingDistricts,
    setLoadingNeighborhoods,
} from '../redux/locationSlice';

import {
    District,
    Province,
    Neighborhood,
    FindLocationData
} from '../types/index'
import { toast } from 'react-toastify';
import { fetchWeatherData } from '../services/api'


const FindLocation: React.FC<FindLocationData> = ({ setfindWeatherData, setLoading }) => {
    const [provinceQuery, setProvinceQuery] = useState('');
    const [districtQuery, setDistrictQuery] = useState('');
    const [neighborhoodQuery, setNeighborhoodQuery] = useState('');

    const dispatch = useAppDispatch();
    const {
        provinces,
        selectedProvince,
        districts,
        selectedDistrict,
        neighborhoods,
        selectedNeighborhood,
        isLoadingDistricts,
        isLoadingNeighborhoods,
    } = useAppSelector((state) => state.location);



    const capitalizeFirstLetter = (text: string): string => {
        if (!text) return '';

        const turkishLetterMap: { [key: string]: string } = {
            'i': 'İ',
            'I': 'I',
            'ı': 'I',
            'İ': 'İ'
        };

        const firstChar = text.charAt(0).toLowerCase();
        const rest = text.slice(1).toLowerCase();

        if (firstChar in turkishLetterMap) {
            return turkishLetterMap[firstChar] + rest;
        }

        return text.charAt(0).toUpperCase() + rest;
    };

    const handleLocationWeather = () => {
        let locationQuery = "";

        if (selectedNeighborhood) {
            locationQuery = `${selectedNeighborhood.name}, ${selectedDistrict?.name}`;
        } else if (selectedDistrict) {
            locationQuery = selectedDistrict.name;
        } else if (selectedProvince) {
            locationQuery = selectedProvince.name;
        }

        if (locationQuery) {
            const handleWeather = async () => {
                setLoading(true)
                const response = await fetchWeatherData(locationQuery);
                if (response.success) {
                    setfindWeatherData(response.result);
                    setLoading(false)
                }
                else {
                    setLoading(false)
                }
            }
            handleWeather()
        }
    };

    useEffect(() => {
        const fetchProvinces = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_LOCATION_PROVINCES}`);
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                const data = await response.json();
                dispatch(setProvinces(data.data));
            } catch (err) {
                toast.error("Bir Hata Oluştu! Daha Sonra Tekrar Deneyiniz")
                console.error('İller yüklenirken hata oluştu:', err);
            }
        };

        fetchProvinces();
    }, [dispatch]);

    useEffect(() => {
        const fetchDistricts = async () => {
            if (!selectedProvince) {
                dispatch(setDistricts([]));
                return;
            }

            dispatch(setLoadingDistricts(true));
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_LOCATION_PROVINCES}/${selectedProvince.id}`);
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                const data = await response.json();
                dispatch(setDistricts(data.data.districts));
            } catch (err) {
                toast.error("Bir Hata Oluştu! Daha Sonra Tekrar Deneyiniz")
                console.error('İlçeler yüklenirken hata oluştu:', err);
                dispatch(setDistricts([]));
            } finally {
                dispatch(setLoadingDistricts(false));
            }
        };

        fetchDistricts();
    }, [selectedProvince, dispatch]);

    useEffect(() => {
        const fetchNeighborhoods = async () => {
            if (!selectedDistrict) {
                dispatch(setNeighborhoods([]));
                return;
            }

            dispatch(setLoadingNeighborhoods(true));
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_LOCATION_DISTRICTS}/${selectedDistrict.id}`);
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                const data = await response.json();
                dispatch(setNeighborhoods(data.data.neighborhoods));
            } catch (err) {
                toast.error("Bir Hata Oluştu! Daha Sonra Tekrar Deneyiniz")
                console.error('Mahalleler yüklenirken hata oluştu:', err);
                dispatch(setNeighborhoods([]));
            } finally {
                dispatch(setLoadingNeighborhoods(false));
            }
        };

        fetchNeighborhoods();
    }, [selectedDistrict, dispatch]);

    const handleProvinceChange = (province: Province | null) => {
        dispatch(setSelectedProvince(province));
        setDistrictQuery('');
        setNeighborhoodQuery('');
    };

    const filteredProvinces = provinceQuery === ''
        ? provinces
        : provinces.filter((province) => {
            const normalizedProvinceName = province.name
                .replace(/İ/g, 'I')
                .toLowerCase();

            const normalizedQuery = provinceQuery
                .replace(/İ/g, 'I')
                .toLowerCase();

            return normalizedProvinceName.includes(normalizedQuery);
        });

    const filteredDistricts = districtQuery === ''
        ? districts
        : districts.filter((district) => {
            const normalizedDistrictName = district.name
                .replace(/İ/g, 'I')
                .toLowerCase();

            const normalizedQuery = districtQuery
                .replace(/İ/g, 'I')
                .toLowerCase();

            return normalizedDistrictName.includes(normalizedQuery);
        });

    const filteredNeighborhoods = neighborhoodQuery === ''
        ? neighborhoods
        : neighborhoods.filter((neighborhood) => {
            const normalizedNeighborhoodName = neighborhood.name
                .replace(/İ/g, 'I')
                .toLowerCase();

            const normalizedQuery = neighborhoodQuery
                .replace(/İ/g, 'I')
                .toLowerCase();

            return normalizedNeighborhoodName.includes(normalizedQuery);
        });


    return (
        <div>
            <div className='grid lg:grid-cols-4 grid-col gap-5 items-end'>
                <div>
                    <label className="block text-sm font-medium  mb-2">İl</label>
                    <Combobox value={selectedProvince} onChange={handleProvinceChange}>
                        <div className="relative">
                            <div className="relative w-full cursor-default overflow-hidden rounded-lg bg-white text-left border border-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm">
                                <Combobox.Input
                                    className="w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-0 outline-none"
                                    displayValue={(province: Province) => province?.name || ''}
                                    onChange={(event) => {
                                        const capitalizedValue = capitalizeFirstLetter(event.target.value);
                                        setProvinceQuery(capitalizedValue);
                                    }}
                                    placeholder="İl seçiniz"
                                />
                                <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
                                    <svg
                                        fill="none"
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        className="h-5 w-5 text-gray-600"
                                        viewBox="0 0 24 24"
                                    >
                                        <path d="m6 9 6 6 6-6"></path>
                                    </svg>
                                </Combobox.Button>
                            </div>
                            <Combobox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm z-10">
                                {filteredProvinces.length === 0 ? (
                                    <div className="relative cursor-default select-none px-4 py-2 text-gray-500">
                                        Sonuç bulunamadı.
                                    </div>
                                ) : (
                                    filteredProvinces.map((province) => (
                                        <Combobox.Option
                                            key={province.id}
                                            value={province}
                                            className={({ active }) =>
                                                `relative cursor-default select-none py-2 pl-10 pr-4 ${active ? 'bg-teal-600 text-white' : 'text-gray-900'
                                                }`
                                            }
                                        >
                                            {({ selected, active }) => (
                                                <>
                                                    <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                                                        {province.name}
                                                    </span>
                                                    {selected && (
                                                        <span className={`absolute inset-y-0 left-0 flex items-center pl-3 ${active ? 'text-white' : 'text-teal-600'
                                                            }`}>
                                                            <svg xmlns="http://www.w3.org/2000/svg" height="16" width="14" viewBox="0 0 448 512" className="fill-current">
                                                                <path d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z" />
                                                            </svg>
                                                        </span>
                                                    )}
                                                </>
                                            )}
                                        </Combobox.Option>
                                    ))
                                )}
                            </Combobox.Options>
                        </div>
                    </Combobox>
                </div>

                <div>
                    <label className="block text-sm font-medium  mb-2">İlçe</label>
                    <Combobox
                        value={selectedDistrict}
                        onChange={(district: District | null) => {
                            dispatch(setSelectedDistrict(district));
                            setDistrictQuery('');
                            setNeighborhoodQuery('');
                        }}
                        disabled={!selectedProvince || isLoadingDistricts}
                    >
                        <div className="relative">
                            <div className="relative w-full cursor-default overflow-hidden rounded-lg bg-white text-left border border-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm">
                                <Combobox.Input
                                    className="w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-0"
                                    displayValue={(district: District) => district?.name || ''}
                                    onChange={(event) => {
                                        const capitalizedValue = capitalizeFirstLetter(event.target.value);
                                        setDistrictQuery(capitalizedValue);
                                    }}
                                    placeholder={isLoadingDistricts ? "Yükleniyor..." : "İlçe seçiniz"}
                                    disabled={!selectedProvince || isLoadingDistricts}
                                />
                                <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
                                    <svg
                                        fill="none"
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        className="h-5 w-5 text-gray-600"
                                        viewBox="0 0 24 24"
                                    >
                                        <path d="m6 9 6 6 6-6"></path>
                                    </svg>
                                </Combobox.Button>
                            </div>
                            <Combobox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm z-10">
                                {isLoadingDistricts ? (
                                    <div className="relative cursor-default select-none px-4 py-2 text-gray-500">
                                        Yükleniyor...
                                    </div>
                                ) : filteredDistricts.length === 0 ? (
                                    <div className="relative cursor-default select-none px-4 py-2 text-gray-500">
                                        Sonuç bulunamadı.
                                    </div>
                                ) : (
                                    filteredDistricts.map((district) => (
                                        <Combobox.Option
                                            key={district.id}
                                            value={district}
                                            className={({ active }) =>
                                                `relative cursor-default select-none py-2 pl-10 pr-4 ${active ? 'bg-teal-600 text-white' : 'text-gray-900'
                                                }`
                                            }
                                        >
                                            {({ selected, active }) => (
                                                <>
                                                    <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                                                        {district.name}
                                                    </span>
                                                    {selected && (
                                                        <span className={`absolute inset-y-0 left-0 flex items-center pl-3 ${active ? 'text-white' : 'text-teal-600'}`}>
                                                            <svg xmlns="http://www.w3.org/2000/svg" height="16" width="14" viewBox="0 0 448 512" className="fill-current">
                                                                <path d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z" />
                                                            </svg>
                                                        </span>
                                                    )}
                                                </>
                                            )}
                                        </Combobox.Option>
                                    ))
                                )}
                            </Combobox.Options>
                        </div>
                    </Combobox>
                </div>

                {/* Mahalle Seçimi */}
                <div>
                    <label className="block text-sm font-medium  mb-2">Mahalle</label>
                    <Combobox
                        value={selectedNeighborhood}
                        onChange={(neighborhood: Neighborhood | null) => {
                            dispatch(setSelectedNeighborhood(neighborhood));
                            setNeighborhoodQuery('');
                        }}
                        disabled={!selectedDistrict || isLoadingNeighborhoods}
                    >
                        <div className="relative">
                            <div className="relative w-full cursor-default overflow-hidden rounded-lg bg-white text-left border border-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm">
                                <Combobox.Input
                                    className="w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-0"
                                    displayValue={(neighborhood: Neighborhood) => neighborhood?.name || ''}
                                    onChange={(event) => {
                                        const capitalizedValue = capitalizeFirstLetter(event.target.value);
                                        setNeighborhoodQuery(capitalizedValue);
                                    }}
                                    placeholder={isLoadingNeighborhoods ? "Yükleniyor..." : "Mahalle seçiniz"}
                                    disabled={!selectedDistrict || isLoadingNeighborhoods}
                                />
                                <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
                                    <svg
                                        fill="none"
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        className="h-5 w-5 text-gray-600"
                                        viewBox="0 0 24 24"
                                    >
                                        <path d="m6 9 6 6 6-6"></path>
                                    </svg>
                                </Combobox.Button>
                            </div>
                            <Combobox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm z-10">
                                {isLoadingNeighborhoods ? (
                                    <div className="relative cursor-default select-none px-4 py-2 ">
                                        Yükleniyor...
                                    </div>
                                ) : filteredNeighborhoods.length === 0 ? (
                                    <div className="relative cursor-default select-none px-4 py-2 text-gray-500">
                                        Sonuç bulunamadı.
                                    </div>
                                ) : (
                                    filteredNeighborhoods.map((neighborhood) => (
                                        <Combobox.Option
                                            key={neighborhood.id}
                                            value={neighborhood}
                                            className={({ active }) =>
                                                `relative cursor-default select-none py-2 pl-10 pr-4 ${active ? 'bg-teal-600 text-white' : 'text-gray-900'
                                                }`
                                            }
                                        >
                                            {({ selected, active }) => (
                                                <>
                                                    <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                                                        {neighborhood.name}
                                                    </span>
                                                    {selected && (
                                                        <span className={`absolute inset-y-0 left-0 flex items-center pl-3 ${active ? 'text-white' : 'text-teal-600'
                                                            }`}>
                                                            <svg xmlns="http://www.w3.org/2000/svg" height="16" width="14" viewBox="0 0 448 512" className="fill-current">
                                                                <path d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z" />
                                                            </svg>
                                                        </span>
                                                    )}
                                                </>
                                            )}
                                        </Combobox.Option>
                                    ))
                                )}
                            </Combobox.Options>
                        </div>
                    </Combobox>
                </div>
                <div>
                    <button
                        onClick={handleLocationWeather}
                        disabled={!selectedProvince}
                        className={`py-2 px-4 w-full rounded-lg text-white font-medium transition-all duration-200
                        ${selectedProvince
                                ? 'bg-green-600 hover:bg-green-700'
                                : 'bg-gray-400 cursor-not-allowed'}`}
                    >
                        Hava Durumunu Göster
                    </button>
                </div>
            </div>
        </div>
    )
}

export default FindLocation