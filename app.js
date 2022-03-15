require('dotenv').config()
const express = require('express'),
  app = express(),
  https = require('https'),
  http = require('http')
  cors = require('cors'),
  QRCode = require('qrcode'),
  fs = require( 'fs' )

const port = process.env.PORT | 5000
const secure_port = process.env.SECURE_PORT | 443
let clients = {}
let page = '';
const debug = (process.env.NODE_DEV == 'development') ? true : false;

let options = {
  key: fs.readFileSync(__dirname + process.env.SSL_KEY_PATH),
  cert: fs.readFileSync(__dirname + process.env.SSL_CERT_PATH)
};

//process.env.SSL_KEY
//process.env.SSL_CERT
//process.env.SSL_CA
// const privateKey = fs.readFileSync('/etc/letsencrypt/live/yourdomain.com/privkey.pem', 'utf8');
// const certificate = fs.readFileSync('/etc/letsencrypt/live/yourdomain.com/cert.pem', 'utf8');
// const ca = fs.readFileSync('/etc/letsencrypt/live/yourdomain.com/chain.pem', 'utf8');

// const credentials = {
// 	key: privateKey,
// 	cert: certificate,
// 	ca: ca
// };

app.use(cors())
app.use(express.static('public'), { dotfiles: 'allow' });
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
server.listen(secure_port, '0.0.0.0', ()=> {
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

