const app = require("./app")
const connectWithDb = require("./config/db")
require("dotenv").config()

//conect with DB , before starting the server
connectWithDb();

app.listen(process.env.PORT, () =>{
    console.log(`Server is running at port: ${process.env.PORT}`)
})