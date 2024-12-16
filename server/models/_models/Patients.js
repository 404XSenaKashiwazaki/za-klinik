import { DataTypes } from "sequelize"
import Database from "../../config/Database.js"

const Patients = Database.define("Patients",{
    id: {
        type: DataTypes.BIGINT.UNSIGNED,
        unique: true,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    nama: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    alamat: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    usia: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    jenis_kelamin: {
        type: DataTypes.ENUM(["Laki-laki","Perempuan"]),
        allowNull: true,
        defaultValue: "Laki-laki"
    },
    tempat_lahir: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    tgl_lahir: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    noHp: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    agama: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    gol_darah: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    pekerjaan: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    tgl_daftar: {
        type: DataTypes.DATE,
        allowNull: true,
    },
},{
    freezeTableName: true,
    paranoid: true
})

export default Patients
