import { DataTypes, Op, where } from "sequelize"
import sequelize from "../../config/Database.js"
import Roles from "./Roles.js"
import Drugs from "./Drugs.js"
import UsersDetails from "./UsersDetails.js"


const Users = sequelize.define("Users",{
    id:{
        type: DataTypes.BIGINT.UNSIGNED,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
        unique: true
    },
    username: {
        type: DataTypes.STRING("260"),
        allowNull: false,
        defaultValue: "username"
    },
    namaDepan: {
        type: DataTypes.STRING("260"),
        allowNull: false,
        defaultValue: "fullname"
    },
    namaBelakang: {
        type: DataTypes.STRING("260"),
        allowNull: false,
        defaultValue: "fullname"
    },
    email: {
        type: DataTypes.STRING("100"),
        allowNull: false,
        defaultValue: "your_email@gmail.com",
        unique: true
    },
    password: {
        type: DataTypes.STRING("1000"),
        allowNull: false,
    },
    token: {
        type: DataTypes.TEXT("long"),
        allowNull: true,
    },
    resetToken: {
        type: DataTypes.TEXT("long"),
        allowNull: true,
    },
    resetTokenExp: {
        type: DataTypes.DATE,
        defaultValue: null,
        allowNull: true
    },
    isActive: {
        type: DataTypes.BOOLEAN(),
        defaultValue: false
    }
},{
    paranoid: true,
    freezeTableName: true,
    hooks: {
        afterBulkDestroy: async instace => {       
            const ids = instace.where.id
            console.log({ ids });
            
            await sequelize.transaction( async transaction => {
                await User_Role.destroy({ where: { UserId: ids }, transaction })
                const UserId = await Drugs.findAll({ where: { UserId: ids } })
                if(UserId.length > 0) await Drugs.destroy({ where: { UserId }, transaction })
                await UsersDetails.destroy({ where: { UserId: ids }, transaction })
            })
        },
        afterBulkRestore: async instance => {
            const ids = instance.where.id
            console.log({ ids });
            await sequelize.transaction( async transaction => {
                await User_Role.restore({ where: { UserId: ids }, transaction })
                const UserId = await Drugs.findAll({ where: { UserId: ids } })
                if(UserId.length > 0) await Drugs.restore({ where: { UserId }, transaction })
                await UsersDetails.restore({ where: { UserId: ids }, transaction })
            })
        }
    }
})

export const User_Role = sequelize.define("User_Role",{
    UserId: {
        type: DataTypes.BIGINT,
        references: {
            model: Users,
            key: "id"
        },
    },
    RoleId: {
        type: DataTypes.BIGINT,
        references: {
            model: Roles,
            key: "id"
        },
    },
},{
    freezeTableName: true,
    paranoid: true, 
})

// export const User_Drugs = sequelize.define("User_Drugs",{
//     UserId: {
//         type: DataTypes.BIGINT,
//         references: {
//             model: Users,
//             key: "id"
//         }
//     },
//     ProductId: {
//         type: DataTypes.BIGINT,
//         references: {
//             model: Drugs,
//             key: "id"
//         }
//     }
// },{
//     freezeTableName: true,
//     paranoid: true,
// })


// Users.belongsToMany(Roles,{through: User_Role})
// Roles.belongsToMany(Users,{through: User_Role})

export default Users