import { check } from "express-validator"
import Patients from "../../models/_models/Patients.js"
import { CreateErrorMessage } from "../../utils/CreateError.js"

export const validateDuplicate = (req,res,next) => {
    let { patients } = req.body
    const uniqName = []    
    if(!patients) throw CreateErrorMessage("Permintaan anda tidak valid",400)
    patients = patients.map((e,i)=> {
        const nama = e.nama.split(" ").map(t=> t.charAt(0).toUpperCase() + t.slice(1)).join(" ")
        uniqName.push(nama)
        return { ...e, nama }
    })
    const uniqErr = []
    patients.filter((e,i)=> {
        if(uniqName.indexOf(e.nama) != i) uniqErr.push({
            "value": e.nama,
            "msg": `Nama ( ${ e.nama } ) sudah digunakan`,
            "param": `patients[${i}].nama`,
            "location": "body"
        })
    })

    if(uniqErr.length > 0) return res.status(400).json({ errors: [...uniqErr] })
    req.body.patients = patients
    next()
}

export const validateUpdate = async (req,res,next) => {
    let { patients } = req.body
    const namelErr = []
    const usernameErr = []
    
    const allErr = []
    patients = await Promise.all(patients.map(async (e,i)=>{
        const nameInDb = await Patients.findOne({ where: { nama: e.nama }, paranoid: false })
        if(nameInDb && nameInDb.id != e.patients_id) namelErr.push({
            "value": e.nama,
            "msg": `Nama (${ e.nama }) sudah digunakan`,
            "param": `patients[${i}].nama`,
            "location": "body"
        })
        return e
    }))
    if(usernameErr.length > 0) allErr.push(usernameErr)

    if(namelErr.length > 0) allErr.push(namelErr)
    if(allErr.length > 0) return res.status(400).json({ errors: [...allErr] })
    req.body.patients = patients

    next()   
}


export const rule = [
    check("patients.*.nama").trim().notEmpty().withMessage("Nama tidak boleh kosong").custom( async (nama,{ req }) => {
        const inDb = await Patients.findOne({ where: { nama: nama }, paranoid: false })
        if(req.method == "POST"){
            if(inDb) throw new Error(`Nama ${ nama } sudah di gunakan`)
            return
        }
    }),
    check("patients.*.alamat").trim().notEmpty().withMessage("Alamat tidak boleh kosong"),
    check("patients.*.usia").trim().notEmpty().withMessage("Usia tidak boleh kosong"),
    check("patients.*.jenis_kelamin").trim().notEmpty().withMessage("Jenis kelamin tidak boleh kosong"),
    check("patients.*.tempat_lahir").trim().notEmpty().withMessage("Tempat lahir tidak boleh kosong"),
    check("patients.*.tgl_lahir").trim().notEmpty().withMessage("Tanggal lahir tidak boleh kosong"),
    check("patients.*.agama").trim().notEmpty().withMessage("Agama tidak boleh kosong"),
    check("patients.*.gol_darah").trim().notEmpty().withMessage("Gol darah tidak boleh kosong"),
    check("patients.*.pekerjaan").trim().notEmpty().withMessage("Pekerjaan tidak boleh kosong"),
    check("patients.*.tgl_daftar").trim().notEmpty().withMessage("Tanggal daftar tidak boleh kosong"),
]