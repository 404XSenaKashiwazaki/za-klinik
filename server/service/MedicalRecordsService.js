import { Op } from "sequelize"
import { MedicalRecords, Patients } from "../models/Index.js"
import { CreateErrorMessage } from "../utils/CreateError.js"
import {  formatDateTime } from "../utils/FormatDate.js"
//============================// 

export const findAll = async (req) => {
  const search = req.query.search || ""
  const page = (req.query.page && typeof parseInt(req.query.page) != NaN) ? parseInt(req.query.page) : 1
  const limit = (req.query.per_page && typeof parseInt(req.query.per_page)) ? parseInt(req.query.per_page) : 10

  const offset = page > 1 ? (page * limit) - limit : 0
  const paranoid = req.query.type == "restore" ? false : true
  const where = (paranoid) 
  ? { where: {
    [Op.or]: {
      keluhan: { [Op.like]: `%${search}%` }
    },
    deletedAt: {
      [Op.is]: null
    }
  } }
  : { where: {
    [Op.or]: {
      keluhan: { [Op.like]: `%${search}%` }
    },
    deletedAt: {
      [Op.not]: null
    }
  } }

  const whereCount = { where: { deletedAt: { [(paranoid) ? Op.is : Op.not] : null } } , paranoid: false}
  const medicalRecords = await MedicalRecords.findAll({...where, paranoid ,limit, offset, order: [["id","DESC"]]})   
  const totals = await MedicalRecords.count(whereCount)

  const totalsCount = (search == "") ? totals : medicalRecords.length
  const totalsPage = Math.ceil(totalsCount / limit)
  const totalsFilters = medicalRecords.length
  
  return { 
    status:  200,
    message: "", 
    response: { medicalRecords, page, offset, limit,totalsPage,totals, totalsFilters } 
  }
}

export const findOne = async (req) => {
  const { id } = req.params
  const paranoid = req.query.type == "restore" ? false : true
  const where = paranoid 
  ? { where: { [Op.and]: { id: id, deletedAt: { [Op.is]: null} }  } }
  : { where: { [Op.and]: { id: id, deletedAt: { [Op.not]: null} }  } }

  const medicalRecords = await MedicalRecords.findOne({...where, include:[{ model: Patients }],paranoid})
  if(!medicalRecords) throw CreateErrorMessage("Tidak ada data",404)
  return { 
    status:  200,
    message: "", 
    response: { medicalRecords } 
  }

}
export const store = async (req) => {
  let { medicalRecords } = req.body
  medicalRecords = medicalRecords.map(e=>({ ...e, tgl_periksa: formatDateTime(e.tgl_periksa) }))
  await MedicalRecords.bulkCreate(medicalRecords,{ fields: [
    "keluhan",
    "hasil_periksa",
    "keterangan",
    "resep",
    "biaya",
    "tgl_periksa",
    "PatientId"
  ] })
  return { 
    status:  201,
    message: `${medicalRecords.length} Data berhasil di simpan`, 
    response: { medicalRecords  } 
  }
}

export const update = async (req) => {
  const { medicalRecords } = req.body
  const response = (await Promise.all(medicalRecords.map(async e =>  {
    e.tgl_periksa = (e.tgl_periksa == e.tgl_periksa_old) ? e.tgl_periksa_old : formatDateTime(e.tgl_periksa)
    const medicalRecord = await MedicalRecords.findOne({ where: { id: e.medical_records_id }, paranoid: false, attributes: ["id"] })
    if(!medicalRecord) return 
    await medicalRecord.update(e,{ fields: [
      "keluhan",
      "hasil_periksa",
      "keterangan",
      "resep",
      "biaya",
      "tgl_periksa",
      "PatientId"
    ] })

    return { id: medicalRecord.id }
  }))).filter(e=> e != null)
  if(response.length == 0) throw CreateErrorMessage("Tidak ada data",404)
  return { 
    status:  201,
    message: `${response.length} Data berhasil di update`, 
    response: { response  } 
  }
}

export const destroy = async (req) => {
  const { id } = req.body
  const force = req.query.permanent == "true" ? true : false

  const medicalRecords = (await MedicalRecords.findAll({ where: { id: id }, paranoid: false, attributes: ["id"] })).filter(e=> e != null)
  if(medicalRecords.length == 0) throw CreateErrorMessage("Tidak ada data",404)

  await MedicalRecords.destroy({ where: { id: id }, force: force })
  return { 
    status:  200,
    message: `${ medicalRecords.length } Data berhasil di hapus`, 
    response: { medicalRecords  } 
  }
}

export const restore = async (req) => {
  const { id } = req.body
  const medicalRecords = (await MedicalRecords.findAll({ where: { id: id }, paranoid: false, attributes: ["id"] })).filter(e=> e != null)
  
  if(medicalRecords.length == 0) throw CreateErrorMessage("Tidak ada data",404)
  await MedicalRecords.restore({ where: { id: id } })
  
  return { 
    status:  200,
    message: `${ medicalRecords.length } Data berhasil di restore`,  
    response: { medicalRecords } 
  }
}
