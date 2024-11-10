const { StatusCodes } = require("http-status-codes")

const cookieToken = (admin, res) => {
    //for cookie contruction(added 3 days validity)
    const options = {
        expires: new Date(
            Date.now() + process.env.COOKIE_TIME * 24 * 60 * 60 * 1000
        ),
        httpOnly: true
    }
    //generating the token
    const token = admin.getJwtToken()

    admin.password = undefined
    //sending the token in the cookie(name of cookie is token here)  as well as 
    //json response(because this registration can be done on the mobile-maybe, not on the 
    //web, hence we are sending the token in the form of cookie, & we are also sending it 
    //in the form JSON response-if registration is being done from the browser)
    res.status(StatusCodes.CREATED).cookie('token', token, options).json({
        success: true,
        token,
        admin
    })
}


module.exports = cookieToken