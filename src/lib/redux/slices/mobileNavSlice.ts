import { createSlice } from '@reduxjs/toolkit';

interface MobileNavState {
    isOpen: boolean;
}

const initialState: MobileNavState = {
    isOpen: false,
}

const mobileNavSlice = createSlice({
    name: 'mobileNav',
    initialState,
    reducers: {
        toggleMobileNav: (state) => {
            state.isOpen = !state.isOpen;
        },
        openMobileNav: (state) => {
            state.isOpen = true;
        },
        closeMobileNav: (state) => {
            state.isOpen = false;
        },
    },
})

export const { toggleMobileNav, openMobileNav, closeMobileNav } = mobileNavSlice.actions;

export default mobileNavSlice.reducer;