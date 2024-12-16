import Drugs from "./_models/Drugs.js"
import ImageProducts from "./_models/ImageProducts.js"
import MedicalRecords from "./_models/MedicalRecords.js"
import Patients from "./_models/Patients.js"
import Roles from "./_models/Roles.js"
import Users, { User_Role } from "./_models/Users.js"
import UsersDetails from "./_models/UsersDetails.js"


Users.belongsToMany(Roles,{through: User_Role, onDelete: "CASCADE"})
Roles.belongsToMany(Users,{through: User_Role })

Users.hasOne(UsersDetails,{ onDelete: "CASCADE" })
UsersDetails.belongsTo(Users)


// casecade di tabel induk
Users.hasMany(Drugs,{  onDelete: "CASCADE" })
Drugs.belongsTo(Users)

Drugs.hasMany(ImageProducts,{ onDelete: "CASCADE" })
ImageProducts.belongsTo(Drugs)

Patients.hasMany(MedicalRecords,{ onDelete: "CASCADE"})
MedicalRecords.belongsTo(Patients)

export {  
    Users, 
    Roles,  
    User_Role, 
    UsersDetails, 
    ImageProducts,
    Drugs,
    Patients,
    MedicalRecords,
}
