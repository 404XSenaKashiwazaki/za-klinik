import { Op } from "sequelize"
import { Patients } from "../models/Index.js"
import { CreateErrorMessage } from "../utils/CreateError.js"
import { formatDateTime } from "../utils/FormatDate.js"
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
      nama: { [Op.like]: `%${search}%` }
    },
    deletedAt: {
      [Op.is]: null
    }
  } }
  : { where: {
    [Op.or]: {
      nama: { [Op.like]: `%${search}%` }
    },
    deletedAt: {
      [Op.not]: null
    }
  } }

  const whereCount = { where: { deletedAt: { [(paranoid) ? Op.is : Op.not] : null } } , paranoid: false}
  const patients = await Patients.findAll({...where, paranoid ,limit, offset, order: [["id","DESC"]]})   
  const totals = await Patients.count(whereCount)

  const totalsCount = (search == "") ? totals : patients.length
  const totalsPage = Math.ceil(totalsCount / limit)
  const totalsFilters = patients.length
  
  return { 
    status:  200,
    message: "", 
    response: { patients, page, offset, limit,totalsPage,totals, totalsFilters } 
  }
}

export const findOne = async (req) => {
  const { id } = req.params
  const paranoid = req.query.type == "restore" ? false : true
  const where = paranoid 
  ? { where: { [Op.and]: { id: id, deletedAt: { [Op.is]: null} }  } }
  : { where: { [Op.and]: { id: id, deletedAt: { [Op.not]: null} }  } }

  const patients = await Patients.findOne({...where, paranoid})
  if(!patients) throw CreateErrorMessage("Tidak ada data",404)
  return { 
    status:  200,
    message: "", 
    response: { patients } 
  }

}
export const store = async (req) => {
  let { patients } = req.body
  patients = patients.map(e=> ({ ...e, tgl_daftar: formatDateTime(e.tgl_daftar), tgl_lahir: formatDateTime(e.tgl_lahir)}))
  await Patients.bulkCreate(patients,{ fields: [
    "nama",
    "alamat",
    "usia",
    "jenis_kelamin",
    "tempat_lahir",
    "tgl_lahir",
    "noHp",
    "agama",
    "gol_darah",
    "pekerjaan",
    "tgl_daftar"
  ] })
  return { 
    status:  201,
    message: `${patients.length} Data berhasil di simpan`, 
    response: { patients  } 
  }
}

export const update = async (req) => {
  const { patients } = req.body
  const response = (await Promise.all(patients.map(async e =>  {
    e.tgl_daftar = (e.tgl_daftar == e.tgl_daftar_old) ? e.tgl_daftar_old : formatDateTime(e.tgl_daftar)
    e.tgl_lahir = (e.tgl_lahir == e.tgl_lahir_old) ? e.tgl_lahir_old : formatDateTime(e.tgl_lahir)
    const roles = await Patients.findOne({ where: { id: e.patients_id }, paranoid: false, attributes: ["id"] })
    if(!roles) return 
    await roles.update(e,{ fields: [
      "nama",
      "alamat",
      "usia",
      "jenis_kelamin",
      "tempat_lahir",
      "tgl_lahir",
      "noHp",
      "agama",
      "gol_darah",
      "pekerjaan",
      "tgl_daftar"
    ] })

    return { id: roles.id }
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

  const patients = (await Patients.findAll({ where: { id: id }, paranoid: false, attributes: ["id"] })).filter(e=> e != null)
  if(patients.length == 0) throw CreateErrorMessage("Tidak ada data",404)

  await Patients.destroy({ where: { id: id }, force: force })
  return { 
    status:  200,
    message: `${ patients.length } Data berhasil di hapus`, 
    response: { patients  } 
  }
}

export const restore = async (req) => {
  const { id } = req.body
  const patients = (await Patients.findAll({ where: { id: id }, paranoid: false, attributes: ["id"] })).filter(e=> e != null)
  
  if(patients.length == 0) throw CreateErrorMessage("Tidak ada data",404)
  await Patients.restore({ where: { id: id } })
  
  return { 
    status:  200,
    message: `${ patients.length } Data berhasil di restore`,  
    response: { patients } 
  }
}
