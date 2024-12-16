import { faCameraAlt } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useEffect, useState } from 'react'
import { useUpdateProfileMutation } from '../features/api/apiProfileSlice'
import { useDispatch } from 'react-redux'

const FormInputProfile = ({ data, username, input, setInput}) => {
   
    const [ update, { data: dataUpdate, isError,isLoading,error } ] = useUpdateProfileMutation()
    const dispatch = useDispatch()
   

   

   

    return (
        <div className="mb-10">
           
            
        </div>
    )
}

export default FormInputProfile