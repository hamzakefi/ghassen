const express = require("express") ;
const app = express();


require("dotenv").config();

app.use(express.json())

const connectDB = require ('./config/connectDB')
connectDB();




const PORT = process.env.PORT || 7500

app.use('/', (req, res) => {
    res.send('Hello from Node.js!')
})

app.listen(PORT , error =>{
    
    error? console.error(`Fail to connect , ${error}`)
    :
    console.error(`Server is running on port ${PORT}`)
}) 