import { useDispatch } from "react-redux"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit, faPlus, faPlusSquare, faRefresh, faSpinner, faTrash } from '@fortawesome/free-solid-svg-icons'
import { useState } from "react"
import ErrorMsg from "../../components/ErrorMsg"
import { useEffect } from "react"
import { setMessage } from "../../features/patientsSlice"
import Modal from "../../components/Modal_"
import { useFindOnePatientsQuery, useStorePatientsMutation, useUpdatePatientsMutation } from "../../features/api/apiPatientsSlice"
import { formatDate } from "../../utils/Utils"

const Form = ({ id, setId, showModal, setShowModal }) => {
    const golDarah = ["A+", "A", "B+", "B", "AB+", "AB", "O+", "O"]
    const newForm = {
        nama: "",
        alamat: "",
        usia: "",
        jenis_kelamin: "",
        tempat_lahir: "",
        tgl_lahir: "",
        noHp: "",
        agama: "",
        gol_darah: "",
        pekerjaan: "",
        tgl_daftar: "",
        error: null
    }
    const dispatch = useDispatch()
    const [ form, setForm ] = useState({ patients: [newForm] })
    const { data } = useFindOnePatientsQuery({ id },{ skip: (id) ? false : true }) 
    const [ update, { isLoading: loadingUpdate }] = useUpdatePatientsMutation()
    const [ add, { isLoading: loadingAdd } ] = useStorePatientsMutation()

    useEffect(() => {
        if(data?.response?.patients) setForm({ patients: [{
            patients_id: data.response.patients.id,
            nama: data.response.patients.nama,
            alamat: data.response.patients.alamat,
            usia: data.response.patients.usia,
            jenis_kelamin: data.response.patients.jenis_kelamin,
            tempat_lahir: data.response.patients.tempat_lahir,
            tgl_lahir: data.response.patients.tgl_lahir,
            tgl_lahir_old: data.response.patients.tgl_lahir,
            noHp: data.response.patients.noHp,
            agama: data.response.patients.agama,
            gol_darah: data.response.patients.gol_darah,
            pekerjaan: data.response.patients.pekerjaan,
            tgl_daftar: data.response.patients.tgl_daftar,
            tgl_daftar_old: data.response.patients.tgl_daftar,
            error: null
        }] })
    },[ data ])

    const handleChange = (e,i) => {
        const { name,value,checked } = e.target
    
        const [...list] = form.patients
        list[i][name] = value
        setForm({ patients: list })
    }

    console.log({ form });
    
    
    const handleClickSave = async () => {
        try {
            const res = (id) ? await update(form).unwrap() : await add(form).unwrap()
            dispatch(setMessage(res?.message))
            setShowModal(false)
        } catch (error) {
            const inpt = form.patients.map(val => ({...val, error: ""}))
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
            setForm({ patients: inpt })
        }
    }

    const handleClickReset = (e) => {
        e.preventDefault()
        const [...list] = form.patients

        const newList = list.map(() => newForm)
        setForm({ patients: newList })
    }

    const handleClickAddForm = (e) => {
        e.preventDefault()
        setForm({ patients: [...form.patients, newForm]})
    }

    const handleClickDeleteForm = (e,i) => {
        e.preventDefault()
        const [...list] = form.patients

        list.splice(i,1)
        setForm({ patients: list })
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
            { form.patients.map((item,index) => {
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
                                <label htmlFor="usia" className="font-semibold">Usia</label>
                                <input 
                                    type="number" 
                                    onChange={(e) => handleChange(e,index)} 
                                    value={item.usia} 
                                    name="usia" 
                                    id="usia" 
                                    className="w-full text-slate-900 text-sm font-extralight my-0 p-1 border focus:outline-none focus:ring focus:ring-purple-500 rounded-md" 
                                    placeholder="Masukan usia"/>
                                <ErrorMsg message={item.error?.usia || ""} />
                            </div>
                        </div>
                        <div className="flex flex-col md:flex-row sm:flex-row lg:flex-row xl:flex-row gap-3">
                            <div className="w-full mb-2">
                                <label htmlFor="jenis_kelamin" className="font-semibold">Jenis Kelamin</label>
                                <select 
                                    name="jenis_kelamin" 
                                    id="jenis_kelamin"
                                    value={item.jenis_kelamin}
                                    onChange={(e) => handleChange(e,index)} 
                                    className="w-full text-slate-900 text-sm font-extralight my-0 p-1 border focus:outline-none focus:ring focus:ring-purple-500 rounded-md"
                                >
                                    <option value="">-- Pilih jenis kelamin --</option>
                                    <option value="Laki-laki">Laki-laki</option>
                                    <option value="perempuan">Perempuan</option>
                                </select>
                                <ErrorMsg message={item.error?.jenis_kelamin || ""} />
                            </div>
                            <div className="w-full mb-2">
                                <label htmlFor="alamat" className="font-semibold">Alamat</label>
                                <textarea  
                                    onChange={(e) => handleChange(e,index)} 
                                    value={item.alamat} 
                                    name="alamat" 
                                    id="alamat" 
                                    className="w-full text-slate-900 text-sm font-extralight my-0 p-1 border focus:outline-none focus:ring focus:ring-purple-500 rounded-md" 
                                    placeholder="Masukan alamat"/>
                                <ErrorMsg message={item.error?.alamat || ""} />
                            </div>
                        </div>
                        <div className="flex flex-col md:flex-row sm:flex-row lg:flex-row xl:flex-row gap-3">
                            <div className="w-full mb-2">
                                <label htmlFor="tempat_lahir" className="font-semibold">Tempat Lahir</label>
                                <input 
                                    type="text" 
                                    onChange={(e) => handleChange(e,index)} 
                                    value={item.tempat_lahir} 
                                    name="tempat_lahir" 
                                    id="tempat_lahir" 
                                    className="w-full text-slate-900 text-sm font-extralight my-0 p-1 border focus:outline-none focus:ring focus:ring-purple-500 rounded-md" 
                                    placeholder="Masukan tempat lahir"/>
                                <ErrorMsg message={item.error?.tempat_lahir || ""} />
                            </div>
                            <div className="w-full mb-2">
                                <label htmlFor="tgl_lahir" className="font-semibold">Tanggal Lahir</label>
                                <input 
                                    type="date" 
                                    onChange={(e) => handleChange(e,index)} 
                                    value={formatDate(item.tgl_lahir)} 
                                    name="tgl_lahir" 
                                    id="tgl_lahir" 
                                    className="w-full text-slate-900 text-sm font-extralight my-0 p-1 border focus:outline-none focus:ring focus:ring-purple-500 rounded-md" 
                                    placeholder="Masukan tgl lahir"/>
                                <ErrorMsg message={item.error?.tgl_lahir || ""} />
                            </div>
                        </div>
                        <div className="flex flex-col md:flex-row sm:flex-row lg:flex-row xl:flex-row gap-3">
                            <div className="w-full mb-2">
                                <div className="mb-2">
                                    <label htmlFor="noHp" className="font-semibold">No Hp</label>
                                    <input 
                                        type="text" 
                                        onChange={(e) => handleChange(e,index)} 
                                        value={item.noHp} 
                                        name="noHp" 
                                        id="noHp" 
                                        className="w-full text-slate-900 text-sm font-extralight my-0 p-1 border focus:outline-none focus:ring focus:ring-purple-500 rounded-md" 
                                        placeholder="Masukan no hp"/>
                                    <ErrorMsg message={item.error?.noHp || ""} />
                                </div>
                                <div className="mb-2">
                                    <label htmlFor="agama" className="font-semibold">Agama</label>
                                    <input 
                                        type="text" 
                                        onChange={(e) => handleChange(e,index)} 
                                        value={item.agama} 
                                        name="agama" 
                                        id="agama" 
                                        className="w-full text-slate-900 text-sm font-extralight my-0 p-1 border focus:outline-none focus:ring focus:ring-purple-500 rounded-md" 
                                        placeholder="Masukan agama"/>
                                    <ErrorMsg message={item.error?.agama || ""} />
                                </div>
                            </div>
                            <div className="w-full mb-2">
                                <label htmlFor="usia" className="font-semibold">Golongan Darah</label>
                                    <div className="w-full grid grid-cols-6 gap-1 text-slate-900 text-sm font-extralight my-0 p-1 border focus:outline-none focus:ring focus:ring-purple-500 rounded-md">
                                        
                                    { golDarah.map((g,i) => <div className="flex gap-1 items-center" key={g}>
                                        <input checked={ item.gol_darah == g ? true : false} onChange={(e) => handleChange(e,index)} type="checkbox" className="p-1" value={g}  name="gol_darah" id="gol_darah" />{ g }</div>) }
                                    </div>
                                <ErrorMsg message={item.error?.gol_darah || ""} />
                            </div>
                        </div>
                        <div className="flex flex-col md:flex-row sm:flex-row lg:flex-row xl:flex-row gap-3">
                            <div className="w-full mb-2">
                                <label htmlFor="pekerjaan" className="font-semibold">Pekerjaan</label>
                                <textarea  
                                    onChange={(e) => handleChange(e,index)} 
                                    value={item.pekerjaan} 
                                    name="pekerjaan" 
                                    id="pekerjaan" 
                                    className="w-full text-slate-900 text-sm font-extralight my-0 p-1 border focus:outline-none focus:ring focus:ring-purple-500 rounded-md" 
                                    placeholder="Masukan pekerjaan"/>
                                <ErrorMsg message={item.error?.pekerjaan || ""} />
                            </div>
                            <div className="w-full mb-2">
                                <label htmlFor="tgl_daftar" className="font-semibold">Tanggal Daftar</label>
                                <input 
                                    type="date" 
                                    onChange={(e) => handleChange(e,index)} 
                                    value={formatDate(item.tgl_daftar)} 
                                    name="tgl_daftar" 
                                    id="tgl_daftar" 
                                    className="w-full text-slate-900 text-sm font-extralight my-0 p-1 border focus:outline-none focus:ring focus:ring-purple-500 rounded-md" 
                                />
                                <ErrorMsg message={item.error?.tgl_daftar || ""} />
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
                        { index == (form.patients.length -1) && (<>
                        
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