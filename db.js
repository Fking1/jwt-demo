const mongoose = require('mongoose')
const URL = 'mongodb://localhost:27017/express-auth'

mongoose.connect(URL, {
    useCreateIndex: true,
    useNewUrlParser: true
})

const UserScheme = new mongoose.Schema({
    username: {
        type: String,
        unique: true
    },
    password: {
        type: String,
        set(val) {
            return require('bcrypt').hashSync(val, 10) //加密
        }
    }
})

const User = mongoose.model('User', UserScheme)

module.exports = {User}