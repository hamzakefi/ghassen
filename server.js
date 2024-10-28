const express = require("express") ;
const app = express();


require("dotenv").config();

app.use(express.json())

const connectDB = require ('./config/connectDB')
connectDB();


app.use('/api/user' , require ('./routes/user'))

app.use('/api/admin' , require ('./routes/admin'))

const PORT = process.env.PORT || 7500



app.listen(PORT , error =>{
    
    error? console.error(`Fail to connect , ${error}`)
    :
    console.error(`Server is running on port ${PORT}`)
}) 