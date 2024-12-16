import React, { useEffect, useState } from 'react'
import Modal from '../../components/Modal_'
import { faCheckSquare, faImage, faList, faSearch, faXmarkSquare } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import TimeAgo from '../../components/TimeAgo'
import { typeBtn } from "../../utils/Type"
import { Link } from 'react-router-dom'
import { formatRp } from '../../utils/FormatRp'
import { useFindOnePatientsQuery } from '../../features/api/apiPatientsSlice'
import { formatDateTime } from '../../utils/Utils'

const Detail = ({ id, setId, showModal, setShowModal  }) => {
  const [ data, setData ] = useState(null)
  const { data: dataPatients  } = useFindOnePatientsQuery({ id }, { skip: (id) ? false : true })

  useEffect(() => {
    if(dataPatients?.response?.patients) setData({
      patients_id: dataPatients.response.patients.id,
      nama: dataPatients.response.patients.nama,
      alamat: dataPatients.response.patients.alamat,
      usia: dataPatients.response.patients.usia,
      jenis_kelamin: dataPatients.response.patients.jenis_kelamin,
      tempat_lahir: dataPatients.response.patients.tempat_lahir,
      tgl_lahir: dataPatients.response.patients.tgl_lahir,
      tgl_lahir_old: dataPatients.response.patients.tgl_lahir,
      noHp: dataPatients.response.patients.noHp,
      agama: dataPatients.response.patients.agama,
      gol_darah: dataPatients.response.patients.gol_darah,
      pekerjaan: dataPatients.response.patients.pekerjaan,
      tgl_daftar: dataPatients.response.patients.tgl_daftar,
      tgl_daftar_old: dataPatients.response.patients.tgl_daftar,
    })
  },[dataPatients])

  console.log({ data});
  if(!data) return <></>
  return (
    <>
      <Modal setId={setId} type="sm" title={<span><FontAwesomeIcon icon={faSearch}/> Detail Pasien</span>}  button="" showModal={showModal} setShowModal={setShowModal}>
      <div className=" px-4 h-auto mb-2">
        {/* <div className="bg-cyan-400 rounded-sm p-2 w-full text-slate-100 text-md">
          Detail Pembeli
        </div> */}
      </div>
      <div className="flex flex-col sm:flex-row sm:justify-between gap-2 px-4 h-auto mb-2"> 
          <div className="w-full">
            <div className="flex justify-between items-center mb-2">
              <span className="w-1/2 font-bold"><p >Nama</p></span>:
              <span className="w-full px-2 "><p>{ data?.nama }</p></span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="w-1/2 font-bold"><p >Usia</p></span>:
              <span className="w-full px-2"><p>{ data?.usia } tahun</p></span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="w-1/2 font-bold"><p >Alamat</p></span>:
              <span className="w-full px-2"><p>{ data?.alamat }</p></span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="w-1/2 font-bold"><p >No Hp/Wa </p></span>:
              <span className="w-full px-2"><p>{ data?.noHp }</p></span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="w-1/2 font-bold"><p >Jenis Kelamin</p></span>:
              <span className="w-full px-2"><p>{ data?.jenis_kelamin }</p></span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="w-1/2 font-bold"><p >Tempat Lahir</p></span>:
              <span className="w-full px-2"><p>{ data?.tempat_lahir }</p></span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="w-1/2 font-bold"><p >Tanggal Lahir</p></span>:
              <span className="w-full px-2 flex flex-col gap-1">
                <p>{  new Date(data?.tgl_lahir).toString().slice(0,25) }</p>
                <TimeAgo date={data?.tgl_lahir}/>
              </span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="w-1/2 font-bold"><p >Agama</p></span>:
              <span className="w-full px-2"><p>{ data?.agama }</p></span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="w-1/2 font-bold"><p >Golongan Darah</p></span>:
              <span className="w-full px-2"><p>{ data?.gol_darah }</p></span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="w-1/2 font-bold"><p >Pekerjaan</p></span>:
              <span className="w-full px-2"><p>{ data?.pekerjaan }</p></span>
            </div>
            <div className="flex justify-between  mb-2">
              <span className="w-1/2 font-bold "><p >Tanggal Daftar</p></span>:
              <span className="w-full px-2 flex flex-col gap-1">
                <p>{  new Date(data?.tgl_daftar).toString().slice(0,25) }</p>
                <TimeAgo date={data?.tgl_daftar}/>
              </span>
            </div>
          </div>
        </div>
      </Modal>
    </>
  )
}

export default Detail