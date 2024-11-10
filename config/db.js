const mongoose = require('mongoose')


const connectWithDb = () => {
    mongoose.connect('mongodb://127.0.0.1:27017/burmanfood', {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    //Promise.resolve()
    .then(() => {
        console.log(`DB got connected`)
    })
    .catch(error => {
        console.log(`DB connection issues`)
        console.log(error)
        process.exit(1)
    })
}


module.exports = connectWithDb;