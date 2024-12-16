import { apiSlice } from "./apiSlice"

const invalidatesTags = [{ type: "Patients", id: "LIST-PATIENTS" }]

export const apiPatients = apiSlice.injectEndpoints({
    endpoints: builder => ({

        findAllPatients: builder.query({
            query: (params) => {
                const { page, search, perPage, restores } = params
                const restore = restores ? "restore": ""
                return { 
                    url: "patients?search="+search+"&page="+page+"&per_page="+perPage+`&type=${restore}`,
                    method: "GET"
                }
            },
            providesTags: result => {
                return result?.response?.patients.length > 0
                    ? result.response.patients.map(data => ({ type: "Patients", id: data.id },{ type: "Patients",id: "LIST-PATIENTS" }))
                    : [{ type: "Patients", id: "LIST-PATIENTS" }]
            }
        }),

        findOnePatients: builder.query({
            query: ({ id }) => ({ url: "patients/"+id, method: "GET" }),
            providesTags: result => {
                return result?.response?.patients
                ? [{ type: "Patients", id: result.response.patients.id },{ type: "Patients", id: "LIST-PATIENTS" }]
                : [{ type: "Patients", id: "LIST-PATIENTS" }]
            }
        }),


        storePatients: builder.mutation({
            query(data){
                return { 
                    url:"patients/add", 
                    method: "POST",
                    data: data,
                    headers: { "Content-Type": "multipart/form-data" }
                }
            },
            invalidatesTags
        }),

        updatePatients: builder.mutation({
            query(data){
                return { 
                    url:"patients/update", 
                    method: "PUT",
                    data: data,
                    headers: { "Content-Type": "multipart/form-data" }
                }
            },
            invalidatesTags
        }),

        restorePatients: builder.mutation({
            query(data){
                return { 
                    url:"patients/restore", 
                    method: "PUT", 
                    data: data 
                }
            },
            invalidatesTags
        }),

        destroyPatients: builder.mutation({
            query(data){
                const { permanent } = data
                return { 
                    url:"patients/destroy"+permanent, 
                    method: "DELETE", 
                    data: data
                }
            },
            invalidatesTags
        }),
        destroyMultipelPatients: builder.mutation({
            query(data){
                const { permanent } = data
                return { 
                    url:"patients/destroy"+permanent, 
                    method: "DELETE", 
                    data: data
                }
            },
            invalidatesTags
        }),
        restoreMultipelPatients: builder.mutation({
            query(data){
                return { 
                    url:"patients/restore", 
                    method: "PUT", 
                    data: data
                }
            },
            invalidatesTags
        }),
    })
})


export const {
    useFindAllPatientsQuery,
    useFindOnePatientsQuery,
    useFindAllPatientsByIdQuery,
    useStorePatientsMutation,
    useUpdatePatientsMutation,
    useRestorePatientsMutation,
    useDestroyPatientsMutation,
    useDestroyMultipelPatientsMutation,
    useRestoreMultipelPatientsMutation,
} = apiPatients
