import { apiSlice } from "./apiSlice"

const invalidatesTags = [{ type: "Drugs", id: "LIST-DRUGS" }]

export const apiDrugs = apiSlice.injectEndpoints({
    endpoints: builder => ({

        findAllDrugs: builder.query({
            query: (params) => {
                const { page, search, perPage, restores } = params
                const restore = restores ? "restore": ""
                return { 
                    url: "drugs?search="+search+"&page="+page+"&per_page="+perPage+`&type=${restore}`,
                    method: "GET"
                }
            },
            providesTags: result => {
                return result?.response?.drugs.length > 0
                    ? result.response.drugs.map(data => ({ type: "Drugs", id: data.id },{ type: "Drugs",id: "LIST-DRUGS" }))
                    : [{ type: "Drugs", id: "LIST-DRUGS" }]
            }
        }),

        findOneDrugs: builder.query({
            query: ({ id }) => ({ url: "drugs/"+id, method: "GET" }),
            providesTags: result => {
                return result?.response?.drugs
                ? [{ type: "Drugs", id: result.response.drugs.id },{ type: "Drugs", id: "LIST-DRUGS" }]
                : [{ type: "Drugs", id: "LIST-DRUGS" }]
            }
        }),


        storeDrugs: builder.mutation({
            query(data){
                return { 
                    url:"drugs/add", 
                    method: "POST",
                    data: data,
                    headers: { "Content-Type": "multipart/form-data" }
                }
            },
            invalidatesTags
        }),

        updateDrugs: builder.mutation({
            query(data){
                return { 
                    url:"drugs/update", 
                    method: "PUT",
                    data: data,
                    headers: { "Content-Type": "multipart/form-data" }
                }
            },
            invalidatesTags
        }),

        restoreMultipelDrugs: builder.mutation({
            query(data){
                return { 
                    url:"drugs/restore", 
                    method: "PUT", 
                    data: data 
                }
            },
            invalidatesTags
        }),

        destroyMultipelDrugs: builder.mutation({
            query(data){
                const { permanent } = data
                return { 
                    url:"drugs/destroy"+permanent, 
                    method: "DELETE", 
                    data: data
                }
            },
            invalidatesTags
        }),

    })
})


export const {
    useFindAllDrugsQuery,
    useFindOneDrugsQuery,
    useFindAllDrugsByIdQuery,
    useStoreDrugsMutation,
    useUpdateDrugsMutation,
    useRestoreMultipelDrugsMutation,
    useDestroyMultipelDrugsMutation,
} = apiDrugs
