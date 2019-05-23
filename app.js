const express = require('express')
const { User } = require('./db.js')
const SECRET = '7jkfhajlkak89723nab'
const app = express()
app.use(express.json()) //允许处理客户端传来的json数据
const jwt = require('jsonwebtoken')

app.get('/', async (req, res) => {
  res.send('ok')
})

app.get('/api/users', async (req, res) => {
  const users = await User.find()
  res.send(users)
})

app.post('/api/register', async (req, res) => {
  const user = await User.create({
    username: req.body.username,
    password: req.body.password
  })

  res.send(user)
})

app.post('/api/login', async (req, res) => {
  const user = await User.findOne({
    username: req.body.username
  })

  if (!user) {
    return res.status(422).send({
      message: '用户名不正确'
    })
  }

  const isPasswordValid = require('bcrypt').compareSync(req.body.password, user.password)

  if (!isPasswordValid) {
    return res.status(422).send({
      message: '密码不正确'
    })
  }

  // 生成token
  const token = jwt.sign(
    {id: String(user._id)}, SECRET)

  res.send({
    user,
    token: token
  })

  res.send(user)
})

app.get('/api/profile', async (req, res) => {
  const raw = String(req.headers.authorization).split(' ').pop()
  const {id} = jwt.verify(raw, SECRET)
  const user = await User.findById(id)
  res.send(user)
})

app.listen(3000, () => {
  console.log('http://localhost:3000')
})