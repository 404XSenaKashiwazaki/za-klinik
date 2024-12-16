import { useDispatch } from "react-redux"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit, faPlus, faPlusSquare, faRefresh, faSpinner, faTrash } from '@fortawesome/free-solid-svg-icons'
import { useState } from "react"
import ErrorMsg from "../../components/ErrorMsg"
import { useEffect } from "react"
import { setMessage } from "../../features/drugsSlice"
import Modal from "../../components/Modal_"
import { useFindOnePatientsQuery, useStorePatientsMutation, useUpdatePatientsMutation } from "../../features/api/apiPatientsSlice"
import { formatDate } from "../../utils/Utils"
import { useFindOneDrugsQuery, useStoreDrugsMutation, useUpdateDrugsMutation } from "../../features/api/apiDrugsSlice"

const Form = ({ id, setId, showModal, setShowModal }) => {
    const golDarah = ["A+", "A", "B+", "B", "AB+", "AB", "O+", "O"]
    const newForm = {
        nama: "",
        dosis: "",
        stok: "",
        jenis: "",
        harga: "",
        tgl_kadaluarsa: "",
        desk: "",
        error: null
    }
    const dispatch = useDispatch()
    const [ form, setForm ] = useState({ drugs: [newForm] })
    const { data } = useFindOneDrugsQuery({ id },{ skip: (id) ? false : true }) 
    const [ update, { isLoading: loadingUpdate }] = useUpdateDrugsMutation()
    const [ add, { isLoading: loadingAdd } ] = useStoreDrugsMutation()

    useEffect(() => {
        if(data?.response?.drugs) setForm({ drugs: [{
            drugs_id: data.response.drugs.id,
            nama: data.response.drugs.nama,
            dosis: data.response.drugs.dosis,
            stok: data.response.drugs.stok,
            jenis: data.response.drugs.jenis,
            harga: data.response.drugs.harga,
            tgl_kadaluarsa: data.response.drugs.tgl_kadaluarsa,
            tgl_kadaluarsa_old: data.response.drugs.tgl_kadaluarsa,
            desk: data.response.drugs.desk,
            error: null
        }] })
    },[ data ])

    const handleChange = (e,i) => {
        const { name,value,checked } = e.target
    
        const [...list] = form.drugs
        list[i][name] = value
        setForm({ drugs: list })
    }

    console.log({ form });
    
    
    const handleClickSave = async () => {
        try {
            const res = (id) ? await update(form).unwrap() : await add(form).unwrap()
            dispatch(setMessage(res?.message))
            setShowModal(false)
        } catch (error) {
            const inpt = form.drugs.map(val => ({...val, error: ""}))
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
            setForm({ drugs: inpt })
        }
    }

    const handleClickReset = (e) => {
        e.preventDefault()
        const [...list] = form.drugs

        const newList = list.map(() => newForm)
        setForm({ drugs: newList })
    }

    const handleClickAddForm = (e) => {
        e.preventDefault()
        setForm({ drugs: [...form.drugs, newForm]})
    }

    const handleClickDeleteForm = (e,i) => {
        e.preventDefault()
        const [...list] = form.drugs

        list.splice(i,1)
        setForm({ drugs: list })
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
        return (id) ? <span><FontAwesomeIcon icon={faEdit}/> Edit Obat</span> : <span><FontAwesomeIcon icon={faPlus}/> Tambah Obat</span>
    }

    return (
        <>
        <Modal setId={setId} type="md" title={<ModalTitle />}  button={<ButtonModal />} showModal={showModal} setShowModal={setShowModal}>
        <div className='w-full mb-7 p-4 h-auto'> 

            <div>
            { form.drugs.map((item,index) => {
                return (
                    <div key={index} className={`w-full`}>
                    { index != 0 && (<div className="mt-5 border-b-0 w-full h-2 bg-slate-600 mb-4"></div>) }
                        <div className="flex flex-col md:flex-row sm:flex-row lg:flex-row xl:flex-row gap-3">
                            <div className="w-full mb-2">
                                <label htmlFor="nama" className="font-semibold">Nama</label>
                                <input 
                                    type="text" 
                                    onChange={(e) => handleChange(e,index)} 
                                    value={item.nama} 
                                    name="nama" 
                                    id="nama" 
                                    className="w-full text-slate-900 text-sm font-extralight my-0 p-1 border focus:outline-none focus:ring focus:ring-purple-500 rounded-md" 
                                    placeholder="Masukan nama"/>
                                <ErrorMsg message={item.error?.nama || ""} />
                            </div>
                            <div className="w-full mb-2">
                                <label htmlFor="jenis" className="font-semibold">Jenis</label>
                                <input 
                                    type="text" 
                                    onChange={(e) => handleChange(e,index)} 
                                    value={item.jenis} 
                                    name="jenis" 
                                    id="jenis" 
                                    className="w-full text-slate-900 text-sm font-extralight my-0 p-1 border focus:outline-none focus:ring focus:ring-purple-500 rounded-md" 
                                    placeholder="Masukan jenis"/>
                                <ErrorMsg message={item.error?.jenis || ""} />
                            </div>
                        </div>
                        <div className="flex flex-col md:flex-row sm:flex-row lg:flex-row xl:flex-row gap-3">
                            <div className="w-full mb-2">
                                <label htmlFor="dosis" className="font-semibold">Dosis</label>
                                <textarea  
                                    onChange={(e) => handleChange(e,index)} 
                                    value={item.dosis} 
                                    name="dosis" 
                                    id="dosis" 
                                    className="w-full text-slate-900 text-sm font-extralight my-0 p-1 border focus:outline-none focus:ring focus:ring-purple-500 rounded-md" 
                                    placeholder="Masukan dosis"/>
                                <ErrorMsg message={item.error?.dosis || ""} />
                            </div>
                        </div>
                        <div className="flex flex-col md:flex-row sm:flex-row lg:flex-row xl:flex-row gap-3">
                            <div className="w-full mb-2">
                            <label htmlFor="stok" className="font-semibold">Stok</label>
                                <input 
                                    type="number" 
                                    onChange={(e) => handleChange(e,index)} 
                                    value={item.stok} 
                                    name="stok" 
                                    id="stok" 
                                    className="w-full text-slate-900 text-sm font-extralight my-0 p-1 border focus:outline-none focus:ring focus:ring-purple-500 rounded-md" 
                                    placeholder="Masukan stok"/>
                                <ErrorMsg message={item.error?.stok || ""} />
                            </div>
                            <div className="w-full mb-2">
                                <label htmlFor="harga" className="font-semibold">Harga</label>
                                <input 
                                    type="number" 
                                    onChange={(e) => handleChange(e,index)} 
                                    value={item.harga} 
                                    name="harga" 
                                    id="harga" 
                                    className="w-full text-slate-900 text-sm font-extralight my-0 p-1 border focus:outline-none focus:ring focus:ring-purple-500 rounded-md" 
                                    placeholder="Masukan harga"/>
                                <ErrorMsg message={item.error?.harga || ""} />
                            </div>
                        </div>
                        <div className="flex flex-col md:flex-row sm:flex-row lg:flex-row xl:flex-row gap-3">
                            <div className="w-full mb-2">
                                <label htmlFor="tgl_kadaluarsa" className="font-semibold">Tanggal Kadaluarsa</label>
                                <input 
                                    type="date" 
                                    onChange={(e) => handleChange(e,index)} 
                                    value={formatDate(item.tgl_kadaluarsa)} 
                                    name="tgl_kadaluarsa" 
                                    id="tgl_kadaluarsa" 
                                    className="w-full text-slate-900 text-sm font-extralight my-0 p-1 border focus:outline-none focus:ring focus:ring-purple-500 rounded-md" 
                                />
                                <ErrorMsg message={item.error?.tgl_kadaluarsa || ""} />
                            </div>
                            <div className="w-full mb-2">
                                <label htmlFor="desk" className="font-semibold">Deskripsi</label>
                                <textarea  
                                onChange={(e) => handleChange(e,index)} 
                                value={item.desk} 
                                name="desk" 
                                id="desk" 
                                className="w-full text-slate-900 text-sm font-extralight my-0 p-1 border focus:outline-none focus:ring focus:ring-purple-500 rounded-md" 
                                placeholder="Masukan deskripsi"/>
                                <ErrorMsg message={item.error?.desk || ""} />
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
                        { index == (form.drugs.length -1) && (<>
                        
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