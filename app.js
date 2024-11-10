const express = require("express");
const app = express();
const morgan = require("morgan");
const cookieParser = require("cookie-parser");

//middlewares
app.use(express.json())                             //to parse data coming in the body 
app.use(express.urlencoded({ extended: true }))      // to parse the data coming in the form url encoded

//cookies and file middlewares
app.use(cookieParser())                            //for accessing the cookies


//morgan middleware
app.use(morgan("tiny"));

//import all routes
const home = require("./routes/home");
const user = require("./routes/user");
const admin = require("./routes/admin")

//router middleware
//app.use("/api/v1", home);
app.use("/api/v1", admin);



module.exports = app