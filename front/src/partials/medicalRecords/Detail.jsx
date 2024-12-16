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
import { useFindOneMedicalRecordsQuery } from "../../features/api/apiMedicalRecordSlice"


const Detail = ({ id, setId, showModal, setShowModal  }) => {
  const [ data, setData ] = useState(null)
  const { data: dataMedicalRecords  } = useFindOneMedicalRecordsQuery({ id }, { skip: (id) ? false : true })

  useEffect(() => {
    if(dataMedicalRecords?.response?.medicalRecords) setData({
      medical_records_id: dataMedicalRecords.response.medicalRecords.id,
      keluhan: dataMedicalRecords.response.medicalRecords.keluhan,
      biaya: dataMedicalRecords.response.medicalRecords.biaya,
      hasil_periksa: dataMedicalRecords.response.medicalRecords.hasil_periksa,
      keterangan: dataMedicalRecords.response.medicalRecords.keterangan,
      resep: dataMedicalRecords.response.medicalRecords.resep,
      tgl_periksa: dataMedicalRecords.response.medicalRecords.tgl_periksa,
      PatientId: dataMedicalRecords.response.medicalRecords.Patient.id,
      nama: dataMedicalRecords.response.medicalRecords.Patient.nama,
      usia:dataMedicalRecords.response.medicalRecords.Patient.usia,
      alamat: dataMedicalRecords.response.medicalRecords.Patient.alamat,
      noHp: dataMedicalRecords.response.medicalRecords.Patient.noHp
    })
  },[dataMedicalRecords])

  console.log({ dataMedicalRecords });
  if(!data) return <></>
  return (
    <>
      <Modal setId={setId} type="sm" title={<span><FontAwesomeIcon icon={faSearch}/> Detail Rekam Medis</span>}  button="" showModal={showModal} setShowModal={setShowModal}>
      <div className=" px-4 h-auto mb-2">
        <div className="bg-cyan-400 rounded-sm p-2 w-full text-slate-100 text-md">
          Detail Pasien
        </div>
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
        </div>
      </div>
      <div className="flex flex-col sm:flex-row sm:justify-between gap-2 px-4 h-auto mb-2 mt-5"> 
          <div className="w-full">
            <div className="flex justify-between items-center mb-2">
              <span className="w-1/2 font-bold"><p >Keluhan</p></span>:
              <span className="w-full px-2 "><p>{ data?.keluhan }</p></span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="w-1/2 font-bold"><p >Hasil Periksa</p></span>:
              <span className="w-full px-2"><p>{ data?.hasil_periksa }</p></span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="w-1/2 font-bold"><p >Keterangan</p></span>:
              <span className="w-full px-2"><p>{ data?.keterangan }</p></span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="w-1/2 font-bold"><p >Resep </p></span>:
              <span className="w-full px-2"><p>{ data?.resep }</p></span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="w-1/2 font-bold"><p >Biaya</p></span>:
              <span className="w-full px-2"><p>{ formatRp(data?.biaya) }</p></span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="w-1/2 font-bold"><p >Tanggal Periksa</p></span>:
              <span className="w-full px-2 flex flex-col gap-1">
                <p>{  new Date(data?.tgl_periksa).toString().slice(0,25) }</p>
                <TimeAgo date={data?.tgl_periksa}/>
              </span>
            </div>
          </div>
        </div>
      </Modal>
    </>
  )
}

export default Detail