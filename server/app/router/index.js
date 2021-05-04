const UserRoutes = require('./api')
const video = require('./Video')
const tag = require('./Tag')
const task = require('./Task')
const user = require('./User')
const version = require('./version')
const score = require('./score')
const python = require('./python')


module.exports = app =>{
    app.use('/video',video)
    app.use('/version',version)
    app.use('/tag',tag)
    app.use('/task',task)
    app.use('/user',user)
    app.use('/api',UserRoutes)
    app.use('/score',score)
    app.use('/python',python)
}

