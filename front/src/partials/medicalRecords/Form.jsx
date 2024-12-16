import { useDispatch } from "react-redux"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit, faPlus, faPlusSquare, faRefresh, faSpinner, faTrash } from '@fortawesome/free-solid-svg-icons'
import { useState } from "react"
import ErrorMsg from "../../components/ErrorMsg"
import { useEffect } from "react"
import { setMessage } from "../../features/medicalRecordsSlice"
import Modal from "../../components/Modal_"
import { useFindAllPatientsQuery } from "../../features/api/apiPatientsSlice"
import { formatDate } from "../../utils/Utils"
import { useFindOneMedicalRecordsQuery, useStoreMedicalRecordsMutation, useUpdateMedicalRecordsMutation } from "../../features/api/apiMedicalRecordSlice"

const Form = ({ id, setId, showModal, setShowModal }) => {
    const golDarah = ["A+", "A", "B+", "B", "AB+", "AB", "O+", "O"]
    const newForm = {
        keluhan: "",
        biaya: "",
        hasil_periksa: "",
        keterangan: "",
        resep: "",
        tgl_periksa: "",
        PatientId: "",
        error: null
    }
    const dispatch = useDispatch()
    const [ form, setForm ] = useState({ medicalRecords: [newForm] })
    const { data } = useFindOneMedicalRecordsQuery({ id },{ skip: (id) ? false : true }) 
    const [ update, { isLoading: loadingUpdate }] = useUpdateMedicalRecordsMutation()
    const [ add, { isLoading: loadingAdd } ] = useStoreMedicalRecordsMutation()
    const { data: dataPatients } = useFindAllPatientsQuery({ restores: false, search: "", page: 1, perPage: 100 })
    const [ patients, setPatients ] = useState([])
    
    useEffect(() => {
        if(data?.response?.medicalRecords) setForm({ medicalRecords: [{
            medical_records_id: data.response.medicalRecords.id,
            keluhan: data.response.medicalRecords.keluhan,
            biaya: data.response.medicalRecords.biaya,
            hasil_periksa: data.response.medicalRecords.hasil_periksa,
            keterangan: data.response.medicalRecords.keterangan,
            resep: data.response.medicalRecords.resep,
            tgl_periksa: data.response.medicalRecords.tgl_periksa,
            PatientId: data.response.medicalRecords.Patient.id,
            error: null
        }] })
    },[ data ])

    useEffect(() => {
        if(dataPatients?.response?.patients) setPatients(dataPatients.response.patients)
    },[ dataPatients ])

    const handleChange = (e,i) => {
        const { name,value,checked } = e.target
    
        const [...list] = form.medicalRecords
        list[i][name] = value
        setForm({ medicalRecords: list })
    }

    console.log({ patients

     });
    
    
    const handleClickSave = async () => {
        try {
            const res = (id) ? await update(form).unwrap() : await add(form).unwrap()
            dispatch(setMessage(res?.message))
            setShowModal(false)
        } catch (error) {
            const inpt = form.medicalRecords.map(val => ({...val, error: ""}))
            let msg = []
            
            if(error?.data?.errors && error?.data?.errors.length != 0){
                error.data.errors.forEach((err) => {
                    const indexErr = err.param.match(/\[([0-9]+)\]/)[1]
                    const name = err.param.match(/\.([A-Za-z]+)/)[1]
                    
                    msg.push([indexErr,err.msg])
                    const d = msg.map((filter) => {
                        if(filter[0] == indexErr) return filter[1]
                    }).filter(v=> v)

                    inpt[indexErr].error = { [name]: d  }
                
                })
            }
            setForm({ medicalRecords: inpt })
        }
    }

    const handleClickReset = (e) => {
        e.preventDefault()
        const [...list] = form.medicalRecords

        const newList = list.map(() => newForm)
        setForm({ medicalRecords: newList })
    }

    const handleClickAddForm = (e) => {
        e.preventDefault()
        setForm({ medicalRecords: [...form.medicalRecords, newForm]})
    }

    const handleClickDeleteForm = (e,i) => {
        e.preventDefault()
        const [...list] = form.medicalRecords

        list.splice(i,1)
        setForm({ medicalRecords: list })
    }

    const ButtonModal = () => {
        return (
            <div>
            { id 
                ? <>

                    <button 
                        type='button'
                        onClick={handleClickSave}
                        className='
                        bg-blue-800 py-1 px-2 rounded-sm 
                        border-0 text-white
                        h-auto text-sm w-auto
                        font-medium text-center hover:bg-blue-900 mr-1'
                        > { (loadingUpdate) ? <FontAwesomeIcon icon={faSpinner} /> : <span><FontAwesomeIcon icon={faPlusSquare} /> Simpan</span> }
                    </button>
                </>
                : <> 
                    <button 
                        type='submit'
                        onClick={handleClickSave}
                        className='
                        bg-blue-800 py-1 px-2 rounded-sm 
                        border-0 text-white
                        h-auto text-sm w-auto
                        font-medium text-center hover:bg-blue-900 mr-1'
                        > { (loadingAdd) ? <FontAwesomeIcon icon={faSpinner} /> : <span><FontAwesomeIcon icon={faPlusSquare} /> Tambah</span> }
                    </button>
                </>
            }
            </div>
        )
    }

    const ModalTitle = () => {
        return (id) ? <span><FontAwesomeIcon icon={faEdit}/> Edit Pasien</span> : <span><FontAwesomeIcon icon={faPlus}/> Tambah Pasien</span>
    }

    return (
        <>
        <Modal setId={setId} type="md" title={<ModalTitle />}  button={<ButtonModal />} showModal={showModal} setShowModal={setShowModal}>
        <div className='w-full mb-7 p-4 h-auto'> 

            <div>
            { form.medicalRecords.map((item,index) => {
                return (
                    <div key={index} className={`w-full`}>
                    { index != 0 && (<div className="mt-5 border-b-0 w-full h-2 bg-slate-600 mb-4"></div>) }
                        <div className="w-full mb-2">
                                <label htmlFor="PatientId" className="font-semibold">Pasien</label>
                                <select 
                                    name="PatientId" 
                                    id="PatientId"
                                    value={item.PatientId}
                                    onChange={(e) => handleChange(e,index)} 
                                    className="w-full text-slate-900 text-sm font-extralight my-0 p-1 border focus:outline-none focus:ring focus:ring-purple-500 rounded-md"
                                >
                                    <option value="">-- Pilih pasien --</option>
                                    { patients.map(ee=>  <option key={ee.id} value={ee.id}>{ ee.nama }</option>) }
                                </select>
                                <ErrorMsg message={item.error?.PatientId || ""} />
                            </div>
                        <div className="flex flex-col md:flex-row sm:flex-row lg:flex-row xl:flex-row gap-3">
                            <div className="w-full mb-2">
                                <label htmlFor="keluhan" className="font-semibold">Keluhan</label>
                                <textarea  
                                    onChange={(e) => handleChange(e,index)} 
                                    value={item.keluhan} 
                                    name="keluhan" 
                                    id="keluhan" 
                                    className="w-full text-slate-900 text-sm font-extralight my-0 p-1 border focus:outline-none focus:ring focus:ring-purple-500 rounded-md" 
                                    placeholder="Masukan keluhan"/>
                                <ErrorMsg message={item.error?.keluhan || ""} />
                            </div>
                            <div className="w-full mb-2">
                                <label htmlFor="hasil_periksa" className="font-semibold">Hasil Periksa</label>
                                <textarea  
                                    onChange={(e) => handleChange(e,index)} 
                                    value={item.hasil_periksa} 
                                    name="hasil_periksa" 
                                    id="hasil_periksa" 
                                    className="w-full text-slate-900 text-sm font-extralight my-0 p-1 border focus:outline-none focus:ring focus:ring-purple-500 rounded-md" 
                                    placeholder="Masukan hasil_periksa"/>
                                <ErrorMsg message={item.error?.hasil_periksa || ""} />
                            </div>
                        </div>
                        <div className="flex flex-col md:flex-row sm:flex-row lg:flex-row xl:flex-row gap-3">
                            <div className="w-full mb-2">
                                <label htmlFor="keterangan" className="font-semibold">Keterangan</label>
                                <textarea  
                                    onChange={(e) => handleChange(e,index)} 
                                    value={item.keterangan} 
                                    name="keterangan" 
                                    id="keterangan" 
                                    className="w-full text-slate-900 text-sm font-extralight my-0 p-1 border focus:outline-none focus:ring focus:ring-purple-500 rounded-md" 
                                    placeholder="Masukan keterangan"/>
                                <ErrorMsg message={item.error?.keterangan || ""} />
                            </div>
                            <div className="w-full mb-2">
                                <label htmlFor="resep" className="font-semibold">Resep</label>
                                <textarea  
                                    onChange={(e) => handleChange(e,index)} 
                                    value={item.resep} 
                                    name="resep" 
                                    id="resep" 
                                    className="w-full text-slate-900 text-sm font-extralight my-0 p-1 border focus:outline-none focus:ring focus:ring-purple-500 rounded-md" 
                                    placeholder="Masukan resep"/>
                                <ErrorMsg message={item.error?.resep || ""} />
                            </div>
                        </div>
                        <div className="flex flex-col md:flex-row sm:flex-row lg:flex-row xl:flex-row gap-3">
                            <div className="w-full mb-2">
                                <label htmlFor="biaya" className="font-semibold">Biaya</label>
                                <input 
                                    type="number" 
                                    onChange={(e) => handleChange(e,index)} 
                                    value={item.biaya} 
                                    name="biaya" 
                                    id="biaya" 
                                    className="w-full text-slate-900 text-sm font-extralight my-0 p-1 border focus:outline-none focus:ring focus:ring-purple-500 rounded-md" 
                                    placeholder="Masukan biaya"/>
                                <ErrorMsg message={item.error?.biaya || ""} />
                            </div>
                            <div className="w-full mb-2">
                                <label htmlFor="tgl_periksa" className="font-semibold">Tanggal Periksa</label>
                                <input 
                                    type="date" 
                                    onChange={(e) => handleChange(e,index)} 
                                    value={formatDate(item.tgl_periksa)} 
                                    name="tgl_periksa" 
                                    id="tgl_periksa" 
                                    className="w-full text-slate-900 text-sm font-extralight my-0 p-1 border focus:outline-none focus:ring focus:ring-purple-500 rounded-md" 
                                />
                                <ErrorMsg message={item.error?.tgl_periksa || ""} />
                            </div>
                        </div>
                        { (index != 0) && (<div className="mt-4 ">
                        <button 
                            type='button'
                            onClick={(e) => handleClickDeleteForm(e,index)}
                            className='
                            bg-red-800 py-1 px-2 rounded-sm 
                            border-0 text-white
                            h-auto text-sm w-auto
                            font-medium text-center hover:bg-red-900 mr-1'
                            > <span><FontAwesomeIcon icon={faTrash} /> Hapus</span> 
                        </button>
                        </div>) }

                        <div className="mt-4 flex justify-between gap-1 items-center">
                        { index == (form.medicalRecords.length -1) && (<>
                        
                        <div>
                        { !id &&  <button 
                            type='button'
                            onClick={handleClickAddForm}
                            className='
                            bg-indigo-800 py-1 px-2 rounded-sm 
                            border-0 text-white
                            h-auto text-sm w-auto
                            font-medium text-center hover:bg-indigo-900 mr-1'
                            > <span><FontAwesomeIcon icon={faPlus} /> Tambah Form</span> 
                        </button> }
                        </div>
                        <div>
                        <button 
                            type='button'
                            onClick={handleClickReset}
                            className='
                            bg-red-800 py-1 px-2 rounded-sm 
                            border-0 text-white
                            h-auto text-sm w-auto
                            font-medium text-center hover:bg-red-900 mr-1'
                            > <span><FontAwesomeIcon icon={faRefresh} /> Reset</span> 
                        </button>
                        </div>

                        </>) }
                        </div>
                    </div>
                )
            })  }
            </div>
        </div>
        </Modal>
        </>
    ) 
}

export default Form