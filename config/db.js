const mongoose = require('mongoose')

const DatabaseConnection = () => {
    mongoose.connect(process.env.DATABASE_URL).then((data) => {
        console.log(`Mongodb connected with server: ${data.connection.host}`);
    }).catch((err) => {
        console.log("Database Server Error Message... ", err)
    })
}
module.exports = DatabaseConnection;