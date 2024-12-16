import { check } from "express-validator"
import MedicalRecords from "../../models/_models/MedicalRecords.js"
import { CreateErrorMessage } from "../../utils/CreateError.js"

export const validateDuplicate = (req,res,next) => {
    let { medicalRecords } = req.body
    const uniqName = []    
    if(!medicalRecords) throw CreateErrorMessage("Permintaan anda tidak valid",400)
    medicalRecords = medicalRecords.map((e,i)=> {
        const keluhan = e.keluhan.split(" ").map(t=> t.toUpperCase()).join(" ")
        uniqName.push(keluhan)
        return { ...e, keluhan }
    })
    const uniqErr = []
    medicalRecords.filter((e,i)=> {
        if(uniqName.indexOf(e.keluhan) != i) uniqErr.push({
            "value": e.keluhan,
            "msg": `Keluhan ( ${ e.keluhan } ) sudah digunakan`,
            "param": `medicalRecords[${i}].keluhan`,
            "location": "body"
        })
    })

    if(uniqErr.length > 0) return res.status(400).json({ errors: [...uniqErr] })
    req.body.medicalRecords = medicalRecords
    next()
}

export const validateUpdate = async (req,res,next) => {
    let { medicalRecords } = req.body
    const namelErr = []
    const usernameErr = []
    
    const allErr = []
    medicalRecords = await Promise.all(medicalRecords.map(async (e,i)=>{
        const nameInDb = await MedicalRecords.findOne({ where: { keluhan: e.keluhan }, paranoid: false })
        if(nameInDb && nameInDb.id != e.medical_records_id) namelErr.push({
            "value": e.keluhan,
            "msg": `Keluhan (${ e.keluhan }) sudah digunakan`,
            "param": `medicalRecords[${i}].keluhan`,
            "location": "body"
        })
        return e
    }))
    if(usernameErr.length > 0) allErr.push(usernameErr)

    if(namelErr.length > 0) allErr.push(namelErr)
    if(allErr.length > 0) return res.status(400).json({ errors: [...allErr] })
    req.body.medicalRecords = medicalRecords

    next()   
}


export const rule = [
    check("medicalRecords.*.keluhan").trim().notEmpty().withMessage("Keluhan tidak boleh kosong").custom( async (keluhan,{ req }) => {
        const inDb = await MedicalRecords.findOne({ where: { keluhan: keluhan }, paranoid: false })
        if(req.method == "POST"){
            if(inDb) throw new Error(`Keluhan ${ keluhan } sudah di gunakan`)
            return
        }
    }),
    check("medicalRecords.*.hasil_periksa").trim().notEmpty().withMessage("Hasil periksa tidak boleh kosong"),
    check("medicalRecords.*.keterangan").trim().notEmpty().withMessage("Keterangan tidak boleh kosong"),
    check("medicalRecords.*.resep").trim().notEmpty().withMessage("Resep tidak boleh kosong"),
    check("medicalRecords.*.biaya").trim().notEmpty().withMessage("Biaya tidak boleh kosong"),
    check("medicalRecords.*.tgl_periksa").trim().notEmpty().withMessage("Tanggal periksa tidak boleh kosong"),
]