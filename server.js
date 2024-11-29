const express = require("express") ;
const app = express();

const cors = require("cors");


// Utilisez CORS pour autoriser les requêtes depuis d'autres origines
app.use(cors()); 
require("dotenv").config();

app.use(express.json())

const connectDB = require ('./config/connectDB')
connectDB();


app.use('/api/user' , require ('./routes/user'))
app.use('/api/product',require('./routes/product'))
app.use('/api/message',require('./routes/messages'))


const PORT = process.env.PORT 



app.listen(PORT , error =>{
    
    error? console.error(`Fail to connect , ${error}`)
    :
    console.error(`Server is running on port ${PORT}`)
}) 