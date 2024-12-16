import { createSlice } from "@reduxjs/toolkit" 

export const initialState = {
    isRestore: JSON.parse(localStorage.getItem("cms_drugs_isrestore")) || false,
    message: null,
    options: [],
    checkedId: []
}

export const drugsSlice = createSlice({
    name: "drugs",
    initialState,
    reducers: {
        resetState: (state) => {
            state.options = []
            state.checkedId = []
            state.isRestore = false
            state.message = null
        },
        removeMessage: (state) => {
            state.message = null
        },
        setMessage: (state,action) => {
            state.message = action.payload
        },
        setIsRestore: (state, action) => {
            state.isRestore = action.payload
        },
        setOptions: (state,action) => {
            state.options = action.payload
        },
        setCheckedId: (state,action) => {
            state.checkedId = action.payload
        }
    },
    extraReducers: _ =>{
    }
})

export const {
    resetState,
    removeMessage,
    setCheckedId,
    setMessage,
    setOptions,
    setIsRestore
} = drugsSlice.actions

export default drugsSlice.reducer