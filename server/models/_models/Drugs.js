import { DataTypes } from "sequelize"
import Database from "../../config/Database.js"

const Drugs = Database.define("Drugs",{
    id: {
        type: DataTypes.BIGINT.UNSIGNED,
        unique: true,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    nama: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true
    },
    jenis: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    dosis: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    stok: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0,
    },
    harga: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: 0
    },
    tgl_kadaluarsa: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    desk: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: "deskripsi obat"
    }
},{
    freezeTableName: true,
    paranoid: true
})

export default Drugs
