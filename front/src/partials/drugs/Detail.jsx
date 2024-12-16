import React, { useEffect, useState } from 'react'
import Modal from '../../components/Modal_'
import { faCheckSquare, faImage, faList, faSearch, faXmarkSquare } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import TimeAgo from '../../components/TimeAgo'
import { typeBtn } from "../../utils/Type"
import { Link } from 'react-router-dom'
import { formatRp } from '../../utils/FormatRp'
import { formatDateTime } from '../../utils/Utils'
import { useFindOneDrugsQuery } from '../../features/api/apiDrugsSlice'

const Detail = ({ id, setId, showModal, setShowModal  }) => {
  const [ data, setData ] = useState(null)
  const { data: dataDrugs  } = useFindOneDrugsQuery({ id }, { skip: (id) ? false : true })

  useEffect(() => {
    if(dataDrugs?.response?.drugs) setData({
      drugs_id: dataDrugs.response.drugs.id,
      nama: dataDrugs.response.drugs.nama,
      dosis: dataDrugs.response.drugs.dosis,
      stok: dataDrugs.response.drugs.stok,
      jenis: dataDrugs.response.drugs.jenis,
      harga: dataDrugs.response.drugs.harga,
      tgl_kadaluarsa: dataDrugs.response.drugs.tgl_kadaluarsa,
      tgl_kadaluarsa_old: dataDrugs.response.drugs.tgl_kadaluarsa,
      desk: dataDrugs.response.drugs.desk,
    })
  },[dataDrugs])

  console.log({ data});
  if(!data) return <></>
  return (
    <>
      <Modal setId={setId} type="sm" title={<span><FontAwesomeIcon icon={faSearch}/> Detail Obat</span>}  button="" showModal={showModal} setShowModal={setShowModal}>
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
              <span className="w-1/2 font-bold"><p >Jenis</p></span>:
              <span className="w-full px-2"><p>{ data?.jenis }</p></span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="w-1/2 font-bold"><p >Dosis</p></span>:
              <span className="w-full px-2"><p>{ data?.dosis }</p></span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="w-1/2 font-bold"><p >Stok</p></span>:
              <span className="w-full px-2"><p>{ data?.stok }</p></span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="w-1/2 font-bold"><p >Harga</p></span>:
              <span className="w-full px-2"><p>{ formatRp(data?.harga) }</p></span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="w-1/2 font-bold"><p >Tanggal Kadaluarsa</p></span>:
              <span className="w-full px-2 flex flex-col gap-1">
                <p>{  new Date(data?.tgl_kadaluarsa).toString().slice(0,25) }</p>
                <TimeAgo date={data?.tgl_kadaluarsa}/>
              </span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="w-1/2 font-bold"><p >Deskrisi</p></span>:
              <span className="w-full px-2"><p>{ data?.desk }</p></span>
            </div>
          </div>
        </div>
      </Modal>
    </>
  )
}

export default Detail