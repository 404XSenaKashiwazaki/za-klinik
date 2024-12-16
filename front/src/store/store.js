import { configureStore } from "@reduxjs/toolkit"
import authSlice from "../features/authSlice"
import userSlice from "../features/usersSlice"
import modalSlice from "../features/modalSlice"
import rolesSlice from "../features/rolesSlice"
import { apiSlice } from "../features/api/apiSlice"
import patientsSlice from "../features/patientsSlice"
import drugsSlice from "../features/drugsSlice"
import medicalRecordsSlice from "../features/medicalRecordsSlice"
import profileSlice from "../features/profileSlice"
import siteSlice from "../features/siteSlice"
import sliderSlice from "../features/sliderSlice"

export const store = configureStore({
    reducer: { 
        auth : authSlice,
        users : userSlice,
        modal: modalSlice,
        roles: rolesSlice,
        patients: patientsSlice,
        drugs: drugsSlice,
        medicalRecords: medicalRecordsSlice,
        profile: profileSlice,
        sites: siteSlice,
        sliders: sliderSlice,
        [apiSlice.reducerPath]: apiSlice.reducer
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(apiSlice.middleware),
    devTools: true
})