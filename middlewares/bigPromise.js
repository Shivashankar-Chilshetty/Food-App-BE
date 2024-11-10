//try catch & async-await || user promise
module.exports = func => (req, res, next) => {
    Promise.resolve(func(req, res, next)).catch(next)
}