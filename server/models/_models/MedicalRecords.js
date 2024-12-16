import { DataTypes } from "sequelize"
import Database from "../../config/Database.js"

const MedicalRecords = Database.define("MedicalRecords",{
    id: {
        type: DataTypes.BIGINT.UNSIGNED,
        unique: true,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    keluhan: {
        type: DataTypes.TEXT("long"),
        allowNull: true,
    },
    hasil_periksa: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    keterangan: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    resep: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    biaya: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    tgl_periksa: {
        type: DataTypes.DATE,
        allowNull: true,
    },
},{
    freezeTableName: true,
    paranoid: true
})

export default MedicalRecords
