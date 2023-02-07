const mysql = require('mysql');

const connection = mysql.createConnection({
    host: process.env.DB_DEV_SERVER,
    user: process.env.DB_DEV_USERNAME,
    password: process.env.DB_DEV_PASSWORD,
    database: process.env.DB_DEV_DATABASE,
    port: process.env.DB_DEV_PORT
})

module.exports = {
    mysql,
    connection
}