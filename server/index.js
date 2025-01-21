const express = require('express')
const dotenv = require('dotenv').config()
const cors = require('cors')
const routes = require("./routes/Routes"); 
const mongoose = require('mongoose')
const fs = require('fs')


const app = express();
const port = 8000;


//database connection
mongoose.connect(process.env.MONGO_URL)
.then(()=> console.log('Database connected'))
.catch((err) => console.log('error', err))


//parsing json
app.use(express.json())
// app.use(cookieParser())
app.use(express.urlencoded({extended: false}))

app.use('/', routes)

app.use("/assets", express.static("assets"));


app.listen(port, () => console.log(`Server is running on port ${port} :)`))
