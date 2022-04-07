const express = require('express')
const dotenv = require('dotenv')
const cors = require('cors')




//Configuration verable path set
dotenv.config({ path: './config/configs.env' })

// Handling Uncaught Exception
process.on('uncaughtException', (err) => {
    console.log(`Error Message: ${err.message}`);
    console.log('Shuting Down the Server due to Uncaught Exception');
    process.exit(1);
})



//Private Key Athuntication
if (!process.env.PRIVATE_KEY) {
    console.error("FATAl ERROR: Private Key Is Not Define...")
    process.exit(1)
}

const app = express();
app.use(express.json());

//Database
require('./config/db')()

//Cors
app.use(cors({
    origin: "*",
    optionsSuccessStatus: 200
}))

//Routes
require('./routes/routes')(app)


//Port Setting
const port = process.env.PORT || process.env.PORT_NUMBER;
const server = app.listen(port, () => console.log(`Your App Is Listening on The Given Port ${port} Number...`))

// Unhandled Promise Rejection
process.on("unhandledRejection", (err) => {
    console.log(`Error: ${err.message}`);
    console.log(`Shutting down the server due to Unhandled Promise Rejection`);

    server.close(() => {
        process.exit(1);
    });
});