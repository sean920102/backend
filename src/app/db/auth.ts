'use strict';
import Sequelize = require('sequelize')
import db from "./database";

// var object = db.define("auth", {
//     email: {
//         field: "email",
//         type: Sequelize.STRING,
//     },
//     password: {
//         field: "password",
//         type: Sequelize.STRING,
//     },
//     cr_date: {
//         field: "cr_date",
//         type: Sequelize.STRING(7),
//     },
//     up_date: {
//         field: "up_date",
//         type: Sequelize.STRING(7),
//     },
//     op_user: {
//         field: "op_user",
//         type: Sequelize.STRING(100),
//     },
//     login_date: {
//         field: "login_date",
//         type: Sequelize.STRING(7),
//     },
//     is_enabled: {
//         field: "is_enabled",
//         type: Sequelize.BOOLEAN,
//     },
//     guid: {
//         field: 'guid',
//         type: Sequelize.UUID,
//         defaultValue: Sequelize.fn('uuid_generate_v4'),
//         allowNull: false,
//         primaryKey: true,
//     },
// }, {
//     freezeTableName: true,
//     timestamps: false
// });
var member = db.define("member", {
    member_id:{
        field: "member_id",
        type: Sequelize.INTEGER,
        primaryKey: true,
    },
    email: {
        field: "email",
        type: Sequelize.STRING,
    },
    password: {
        field: "password",
        type: Sequelize.STRING,
    },
    name: {
        field: "name",
        type: Sequelize.STRING,
    },
    
}, {
    freezeTableName: true,
    timestamps: false
});

export default member;