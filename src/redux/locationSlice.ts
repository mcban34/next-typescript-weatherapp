import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { District, Province, Neighborhood, LocationState } from '../types/index'


const initialState: LocationState = {
    provinces: [],
    selectedProvince: null,
    districts: [],
    selectedDistrict: null,
    neighborhoods: [],
    selectedNeighborhood: null,
    isLoadingDistricts: false,
    isLoadingNeighborhoods: false,
};

const locationSlice = createSlice({
    name: 'location',
    initialState,
    reducers: {
        setProvinces: (state, action: PayloadAction<Province[]>) => {
            state.provinces = action.payload;
        },
        setSelectedProvince: (state, action: PayloadAction<Province | null>) => {
            state.selectedProvince = action.payload;
            state.selectedDistrict = null;
            state.selectedNeighborhood = null;
            state.districts = [];
            state.neighborhoods = [];
        },
        setDistricts: (state, action: PayloadAction<District[]>) => {
            state.districts = action.payload;
        },
        setSelectedDistrict: (state, action: PayloadAction<District | null>) => {
            state.selectedDistrict = action.payload;
            state.selectedNeighborhood = null;
            state.neighborhoods = [];
        },
        setNeighborhoods: (state, action: PayloadAction<Neighborhood[]>) => {
            state.neighborhoods = action.payload;
        },
        setSelectedNeighborhood: (state, action: PayloadAction<Neighborhood | null>) => {
            state.selectedNeighborhood = action.payload;
        },
        setLoadingDistricts: (state, action: PayloadAction<boolean>) => {
            state.isLoadingDistricts = action.payload;
        },
        setLoadingNeighborhoods: (state, action: PayloadAction<boolean>) => {
            state.isLoadingNeighborhoods = action.payload;
        },
    },
});

export const {
    setProvinces,
    setSelectedProvince,
    setDistricts,
    setSelectedDistrict,
    setNeighborhoods,
    setSelectedNeighborhood,
    setLoadingDistricts,
    setLoadingNeighborhoods,
} = locationSlice.actions;

export default locationSlice.reducer;