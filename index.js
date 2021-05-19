const express = require('express')
const app = express()
const server = require('http').createServer(app)
const cors = require("cors");
const io = require('socket.io')(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
})
const { v4: uuidV4 } = require('uuid')
const PORT = process.env.PORT || 3000
const path = require('path')

app.use(cors())
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'));

app.get('/', (req, res) => {
  res.redirect(`/${uuidV4()}`)
})

app.get('/:room', (req, res) => {
  res.render('room', { roomId: req.params.room, PORT })
})

io.on('connection', socket => {
  socket.on('join-room', (roomId, userId) => {
    socket.join(roomId)
    socket.to(roomId).broadcast.emit('user-connected', userId)

    socket.on('disconnect', () => {
      socket.to(roomId).broadcast.emit('user-disconnected', userId)
    })
  })
})

server.listen(PORT)