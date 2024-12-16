import { Op } from "sequelize"
import { Drugs  } from "../models/Index.js"
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
  const drugs = await Drugs.findAll({...where, paranoid ,limit, offset, order: [["id","DESC"]]})   
  const totals = await Drugs.count(whereCount)

  const totalsCount = (search == "") ? totals : drugs.length
  const totalsPage = Math.ceil(totalsCount / limit)
  const totalsFilters = drugs.length
  
  return { 
    status:  200,
    message: "", 
    response: { drugs, page, offset, limit,totalsPage,totals, totalsFilters } 
  }
}

export const findOne = async (req) => {
  const { id } = req.params
  const paranoid = req.query.type == "restore" ? false : true
  const where = paranoid 
  ? { where: { [Op.and]: { id: id, deletedAt: { [Op.is]: null} }  } }
  : { where: { [Op.and]: { id: id, deletedAt: { [Op.not]: null} }  } }

  const drugs = await Drugs.findOne({...where, paranoid})
  if(!drugs) throw CreateErrorMessage("Tidak ada data",404)
  return { 
    status:  200,
    message: "", 
    response: { drugs } 
  }

}
export const store = async (req) => {
  let { drugs } = req.body
  drugs = drugs.map(e => ({...e, tgl_kadaluarsa: formatDateTime(e.tgl_kadaluarsa)}))
  await Drugs.bulkCreate(drugs,{ fields: ["nama","jenis","dosis","stok","harga","tgl_kadaluarsa","desk"] })
  return { 
    status:  201,
    message: `${drugs.length} Data berhasil di simpan`, 
    response: { drugs  } 
  }
}

export const update = async (req) => {
  const { drugs } = req.body
  const response = (await Promise.all(drugs.map(async e =>  {
    e.tgl_kadaluarsa = (e.tgl_kadaluarsa == e.tgl_kadaluarsa_old) ? e.tgl_kadaluarsa_old : formatDateTime(e.tgl_kadaluarsa)
    const drugs = await Drugs.findOne({ where: { id: e.drugs_id }, paranoid: false, attributes: ["id"] })
    if(!drugs) return 
    await drugs.update(e,{ fields: ["nama","jenis","dosis","stok","harga","tgl_kadaluarsa","desk"] })

    return { id: drugs.id }
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

  const drugs = (await Drugs.findAll({ where: { id: id }, paranoid: false, attributes: ["id"] })).filter(e=> e != null)
  if(drugs.length == 0) throw CreateErrorMessage("Tidak ada data",404)

  await Drugs.destroy({ where: { id: id }, force: force })
  return { 
    status:  200,
    message: `${ drugs.length } Data berhasil di hapus`, 
    response: { drugs  } 
  }
}

export const restore = async (req) => {
  const { id } = req.body
  const drugs = (await Drugs.findAll({ where: { id: id }, paranoid: false, attributes: ["id"] })).filter(e=> e != null)
  
  if(drugs.length == 0) throw CreateErrorMessage("Tidak ada data",404)
  await Drugs.restore({ where: { id: id } })
  
  return { 
    status:  200,
    message: `${ drugs.length } Data berhasil di restore`,  
    response: { drugs } 
  }
}
