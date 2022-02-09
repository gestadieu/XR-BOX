require('dotenv').config()
const express = require('express'),
  app = express(),
  cors = require('cors'),
  QRCode = require('qrcode'),
  address = require('address')

const port = process.env.PORT | 3000
const http = require('http').createServer(app)
const io = require('socket.io')(http)
let clients = {}
let page = '';
const debug = true;

const pages = {
  'softmind': {
    name: 'softmind'
  },
  'vespa': {
    name: 'vespa',
    orientation: 'vertical'
  }
}

app.use(cors())
app.use(express.static('public'));
app.use(express.urlencoded({
  extended: true
}))
app.use(express.json({
  limit: '1mb'
}));

// const url = `http://${address.ip()}:${port}/index.html`
// QRCode.toFile('public/assets/urlqrcode.png', url)

http.listen(port, () => {
  console.log(`listening on port http://localhost:${port}`)
});

io.on('connection', socket => {
  if (debug) console.log('new client connected', socket.id);
  // io.emit('console', `new client ${socket.id}`)

  // identify each client 
  socket.on('join', location => {
    clients[socket.id] = location
    io.emit('console', 'in room ' + location);
    io.to(socket.id).emit('page', page)
    if (debug) console.log('joined room ', location, clients)
  });

  // select a page
  socket.on('page', msg => {
    page = msg
    if (debug) console.log(`msg from client ${clients[socket.id]} / page:  ${msg}`)
    io.emit('page', msg)
  })

  socket.on('disconnect', () => {
    if (debug) console.log(`${socket.id}/${clients[socket.id]} disconnected`);
    delete clients[socket.id]
  })
})

