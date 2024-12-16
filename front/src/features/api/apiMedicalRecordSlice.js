import { apiSlice } from "./apiSlice"

const invalidatesTags = [{ type: "MedicalRecords", id: "LIST-MEDICAL-RECORDS" }]

export const apiMedicalRecords = apiSlice.injectEndpoints({
    endpoints: builder => ({

        findAllMedicalRecords: builder.query({
            query: (params) => {
                const { page, search, perPage, restores } = params
                const restore = restores ? "restore": ""
                return { 
                    url: "medical-records?search="+search+"&page="+page+"&per_page="+perPage+`&type=${restore}`,
                    method: "GET"
                }
            },
            providesTags: result => {
                return result?.response?.medicalRecords.length > 0
                    ? result.response.medicalRecords.map(data => ({ type: "MedicalRecords", id: data.id },{ type: "MedicalRecords",id: "LIST-MEDICAL-RECORDS" }))
                    : [{ type: "MedicalRecords", id: "LIST-MEDICAL-RECORDS" }]
            }
        }),

        findOneMedicalRecords: builder.query({
            query: ({ id }) => ({ url: "medical-records/"+id, method: "GET" }),
            providesTags: result => {
                return result?.response?.medicalRecords
                ? [{ type: "MedicalRecords", id: result.response.medicalRecords.id },{ type: "MedicalRecords", id: "LIST-MEDICAL-RECORDS" }]
                : [{ type: "MedicalRecords", id: "LIST-MEDICAL-RECORDS" }]
            }
        }),


        storeMedicalRecords: builder.mutation({
            query(data){
                return { 
                    url:"medical-records/add", 
                    method: "POST",
                    data: data,
                    headers: { "Content-Type": "multipart/form-data" }
                }
            },
            invalidatesTags
        }),

        updateMedicalRecords: builder.mutation({
            query(data){
                return { 
                    url:"medical-records/update", 
                    method: "PUT",
                    data: data,
                    headers: { "Content-Type": "multipart/form-data" }
                }
            },
            invalidatesTags
        }),

        restoreMultipelMedicalRecords: builder.mutation({
            query(data){
                return { 
                    url:"medical-records/restore", 
                    method: "PUT", 
                    data: data 
                }
            },
            invalidatesTags
        }),

        destroyMultipelMedicalRecords: builder.mutation({
            query(data){
                const { permanent } = data
                return { 
                    url:"medical-records/destroy"+permanent, 
                    method: "DELETE", 
                    data: data
                }
            },
            invalidatesTags
        }),

    })
})


export const {
    useFindAllMedicalRecordsQuery,
    useFindOneMedicalRecordsQuery,
    useFindAllMedicalRecordsByIdQuery,
    useStoreMedicalRecordsMutation,
    useUpdateMedicalRecordsMutation,
    useRestoreMultipelMedicalRecordsMutation,
    useDestroyMultipelMedicalRecordsMutation,
} = apiMedicalRecords
