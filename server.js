const express = require('express')
const dotenv = require('dotenv')
const app = express()
const connectDB = require('./config/db')
const colors = require('colors')

// Load environment variables from config.env
dotenv.config({path: './config/config.env'})

//Connect to database
connectDB()

//Body parser
app.use(express.json())

// Route files
const studios = require('./routes/studios')

// Mount routers
app.use('/api/v1/studios', studios)

// assign port for the server
const PORT = process.env.PORT || 3000

// Setup server to listen on PORT
const server = app.listen(PORT, () => console.log(`Server running on port ${PORT}`.yellow.bold))

//Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) =>{
    console.log(`Error: ${err.message}`.red)
    //Close the server and exit
    server.close( () => process.exit(1)) 
})
