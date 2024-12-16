import { Op } from "sequelize"
import { CreateErrorMessage } from "../utils/CreateError.js"
import {  Users, Drugs, Roles, Patients, MedicalRecords } from "../models/Index.js"
import sequelize from "../config/Database.js"
//============================// 

export const countAllInfo= async (req) => {
  const usersCount = await Users.count({ paranoid: true, include:[{model:Roles, where: { name: {
    [Op.not]: "ADMIN"
  } }}] })
  const drugsCount = await Drugs.count({ paranoid: true })
  const patientsCount = await Patients.count({ paranoid: true })
  const medicalRecordsCount = await MedicalRecords.count({ paranoid: true })
  return { 
    status:  200,
    message: "", 
    response: { usersCount, drugsCount, patientsCount, medicalRecordsCount } 
  }

}
