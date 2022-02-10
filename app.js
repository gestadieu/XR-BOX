require('dotenv').config()
const express = require('express'),
  app = express(),
  https = require('https'),
  http = require('http')
  cors = require('cors'),
  QRCode = require('qrcode'),
  fs = require( 'fs' )

const port = process.env.PORT | 80
const secure_port = 443; //process.env.SECURE_PORT | 443
let clients = {}
let page = '';
const debug = true;

let options = {
  key: fs.readFileSync(__dirname + '/../certs/selfsigned.key'),
  cert: fs.readFileSync(__dirname + '/../certs/selfsigned.crt')
};

app.use(cors())
app.use(express.static('public'));
app.use(express.urlencoded({
  extended: true
}))
app.use(express.json({
  limit: '1mb'
}));

http.createServer(app).listen(port, ()=> {
  console.log(`listening on http://localhost:${port}`)
})

let server = https.createServer(options, app)
const io = require('socket.io')(server)
server.listen(secure_port, ()=> {
  console.log(`listening on https://localhost:${secure_port}`)
})




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

