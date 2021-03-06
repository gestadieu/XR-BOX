require('dotenv').config()

const express = require('express')
const app = express()
const port = 80 //process.env.PORT || 3000
const secure_port = process.env.SECURE_PORT || 443

const https = require('https'),
  http = require('http'),
  forceSSL = require('express-enforces-ssl'),
  cors = require('cors'),
  helmet = require("helmet"),
  QRCode = require('qrcode'),
  fs = require( 'fs' )

app.use(cors())
app.use(forceSSL())
// app.use(helmet())
// app.use(helmet({
//   featurePolicy: "autoplay 'self'",
//   permissionsPolicy: "autoplay 'self'",
//   // contentSecurityPolicy: "default-src 'self'"
// }))
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(express.json({ limit: '1mb' }))

let clients = {}
let page = '';
const debug = (process.env.NODE_DEV == 'development') ? true : false;

const credentials = {
  key: fs.readFileSync(process.env.SSL_KEY_PATH),
  cert: fs.readFileSync(process.env.SSL_CERT_PATH)
};

// const ca = fs.readFileSync('/etc/letsencrypt/live/yourdomain.com/chain.pem', 'utf8');

let server_nossl = http.createServer(app).listen(port, ()=> {
  console.log(`listening on http://localhost:${port}`)
})
// const io = require('socket.io')(server_nossl)

let server_ssl = https.createServer(credentials, app)
const io = require('socket.io')(server_ssl)

server_ssl.listen(secure_port, '0.0.0.0', ()=> {
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

