import { check } from "express-validator"
import Drugs from "../../models/_models/Drugs.js"
import { CreateErrorMessage } from "../../utils/CreateError.js"

export const validateDuplicate = (req,res,next) => {
    let { drugs } = req.body
    const uniqName = []    
    if(!drugs) throw CreateErrorMessage("Permintaan anda tidak valid",400)
    drugs = drugs.map((e,i)=> {
        const nama = e.nama.split(" ").map(t=> t.charAt(0).toUpperCase() + t.slice(1)).join(" ")
        uniqName.push(nama)
        return { ...e, nama }
    })
    const uniqErr = []
    drugs.filter((e,i)=> {
        if(uniqName.indexOf(e.nama) != i) uniqErr.push({
            "value": e.nama,
            "msg": `Nama ( ${ e.nama } ) sudah digunakan`,
            "param": `drugs[${i}].nama`,
            "location": "body"
        })
    })

    if(uniqErr.length > 0) return res.status(400).json({ errors: [...uniqErr] })
    req.body.drugs = drugs
    next()
}

export const validateUpdate = async (req,res,next) => {
    let { drugs } = req.body
    const namelErr = []
    const usernameErr = []
    
    const allErr = []
    drugs = await Promise.all(drugs.map(async (e,i)=>{
        const nameInDb = await Drugs.findOne({ where: { nama: e.nama }, paranoid: false })
        if(nameInDb && nameInDb.id != e.drugs_id) namelErr.push({
            "value": e.nama,
            "msg": `Nama (${ e.nama }) sudah digunakan`,
            "param": `drugs[${i}].nama`,
            "location": "body"
        })
        return e
    }))
    if(usernameErr.length > 0) allErr.push(usernameErr)

    if(namelErr.length > 0) allErr.push(namelErr)
    if(allErr.length > 0) return res.status(400).json({ errors: [...allErr] })
    req.body.drugs = drugs

    next()   
}


export const rule = [
    check("drugs.*.nama").trim().notEmpty().withMessage("Nama tidak boleh kosong").custom( async (nama,{ req }) => {
        const inDb = await Drugs.findOne({ where: { nama: nama }, paranoid: false })
        if(req.method == "POST"){
            if(inDb) throw new Error(`Nama ${ nama } sudah di gunakan`)
            return
        }
    }),
    check("drugs.*.jenis").trim().notEmpty().withMessage("Jenis tidak boleh kosong"),
    check("drugs.*.dosis").trim().notEmpty().withMessage("Dosis tidak boleh kosong"),
    check("drugs.*.stok").trim().notEmpty().withMessage("Stok tidak boleh kosong"),
    check("drugs.*.harga").trim().notEmpty().withMessage("Harga tidak boleh kosong"),
    check("drugs.*.tgl_kadaluarsa").trim().notEmpty().withMessage("Tanggal kadaluarsa tidak boleh kosong"),
    check("drugs.*.desk").trim().notEmpty().withMessage("Deskripsi tidak boleh kosong"),
]